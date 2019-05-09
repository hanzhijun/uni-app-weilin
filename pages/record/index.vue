<template>
    <view class="record-outside">
        <view class="tab-bar">
            <text :class="tabNum == '1' ? 'thisover' : ''" @click="changeNav('1')">今日</text>
            <text :class="tabNum == '2' ? 'thisover' : ''" @click="changeNav('2')">近三日</text>
            <text :class="tabNum == '3' ? 'thisover' : ''" @click="changeNav('3')">近一周</text>
        </view>

        <view class="qiun-columns" v-if="historyData != ''">
            <view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">折线图（横屏图表）</view></view>
            <view class="qiun-charts-rotate" v-if="historyData != ''">
                <!--#ifdef H5 || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO-->
                <canvas
                    canvas-id="canvasLineB"
                    id="canvasLineB"
                    class="charts-rotate"
                    :style="{
                        width: cWidth2 * pixelRatio + 'px',
                        height: cHeight2 * pixelRatio + 'px',
                        transform: 'scale(' + 1 / pixelRatio + ')',
                        'margin-left': (-cWidth2 * (pixelRatio - 1)) / 2 + 'px',
                        'margin-top': (-cHeight2 * (pixelRatio - 1)) / 2 + 'px'
                    }"
                    @touchstart="touchLineB"
                ></canvas>
                <!--#endif-->
                <!--#ifdef MP-WEIXIN || APP-PLUS -->
                <canvas canvas-id="canvasLineB" id="canvasLineB" class="charts-rotate" @touchstart="touchLineB"></canvas>
                <!--#endif-->
            </view>
            <view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">区域图</view></view>
            <view class="qiun-charts">
                <!--#ifdef H5 || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO-->
                <canvas
                    canvas-id="canvasArea"
                    id="canvasArea"
                    class="charts"
                    :style="{
                        width: cWidth * pixelRatio + 'px',
                        height: cHeight * pixelRatio + 'px',
                        transform: 'scale(' + 1 / pixelRatio + ')',
                        'margin-left': (-cWidth * (pixelRatio - 1)) / 2 + 'px',
                        'margin-top': (-cHeight * (pixelRatio - 1)) / 2 + 'px'
                    }"
                    @touchstart="touchArea"
                ></canvas>
                <!--#endif-->
                <!--#ifdef MP-WEIXIN || APP-PLUS -->
                <canvas canvas-id="canvasArea" id="canvasArea" class="charts" @touchstart="touchArea"></canvas>
                <!--#endif-->
            </view>

            <view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">表格数据</view></view>

            <view class="record-liebiao-tit">
                <text class="time-long">时间</text>
                <text>心率/分</text>
                <text>呼吸率/分</text>
                <text>体动值</text>
            </view>

            <ul class="record-liebiao-ul" v-if="historyData">
                <li v-for="(item, index) in historyData" :key="index" :class="index % 2 == 1 ? 'thisover' : ''">
                    <text class="time-long">{{ item.time }}</text>
                    <text>{{ item.heart ? item.heart : '--' }}</text>
                    <text>{{ item.breath ? item.breath : '--' }}</text>
                    <text>{{ item.motion ? item.motion : '--' }}</text>
                </li>
            </ul>
        </view>

        <view class="qiun-columns" v-if="historyData == '' && firstLoad == 1">
            <ul>
                <li style="padding: 180upx 0; overflow: hidden; display: block; font-size: 36upx; text-align: center; color: #999;">此时间段没有有效数据!</li>
            </ul>
        </view>

        <!--报警弹窗-->
        <view class="base-box warn-box" v-if="warning == '1'" catchtouchmove="true">
            <view class="gray-back"></view>
            <view class="box-content">
                <text class="txt">{{ warningText }}</text>
                <view class="img"><image src="/static/warning.png"></image></view>
                <view><button @click="audioPause">已知晓!</button></view>
            </view>
        </view>

        <!--报警弹窗-->
        <view class="base-box warn-box" catchtouchmove="true" v-if="warning == 1">
            <view class="gray-back"></view>
            <view class="box-content">
                <text class="txt">111111111</text>
                <view class="img"><image src="/static/warning.png"></image></view>
                <view><button @click="audioPause">已知晓!</button></view>
            </view>
        </view>
    </view>
</template>

<script>
import wxCharts from '../../components/wx-charts/wxcharts.js';
var _self;
var canvaLineA = null;
var canvaLineB = null;
var canvaArea = null;

var util = require('../../common/util.js');
var getCookie = util.getCookie;
var setCookie = util.setCookie;
var setStorage = util.setStorage;
var getStorage = util.getStorage;
var getWarnCookie = util.getWarnCookie;
var changeWarn = util.changeWarn;
var myAjax2 = util.myAjax2;
var backgroundAudioManager = wx.getBackgroundAudioManager();

export default {
    data() {
        return {
            title: '历史记录',
            showToast: 0,
            toastTxt: '',
            userInfo: null,
            deviceNos: '', // 设备号
            accessToken: null,
            breath: '--', // 呼吸值 -100_无效值，其他为正常值
            deviceStatus: null, // 设备状态 3_离床，4_在床，5_光纤故障，6_离线，9_传感器负荷，10_信号弱
            heart: '--', // 心率值 65436_无效值，其他为正常值
            markTime: null, // 发生的时间戳
            motion: null, // 体动值 0_正常，3_轻微体动，4_中度体动，5_大幅体动，-100_无效值
            timer: null,
            tabNum: '1', // 导航焦点值
            startTime: null, // 开始时间
            endTime: null, // 结束时间
            historyData: [],
            cWidth: '',
            cHeight: '',
            cWidth2: '', //横屏图表
            cHeight2: '', //横屏图表
            pixelRatio: 1,
            serverData: '',
            firstLoad: 0
        };
    },
    onLoad() {
        _self = this;
        //#ifdef H5 || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
        uni.getSystemInfo({
            success: function(res) {
                if (res.pixelRatio > 1) {
                    //正常这里给2就行，如果pixelRatio=3性能会降低一点
                    //_self.pixelRatio =res.pixelRatio
                    _self.pixelRatio = 2;
                }
            }
        });
        //#endif
        this.cWidth = uni.upx2px(750);
        this.cHeight = uni.upx2px(500);
        this.cWidth2 = uni.upx2px(700);
        this.cHeight2 = uni.upx2px(1100);
        setTimeout(function(){
            this.firstLoad = 1
        },2000);
    },
    onLaunch: function() {},
    onShow: function() {
        let _this = this;
        let accessToken = util.getCookie('accessToken');
        let deviceNos = getCookie('deviceNos');
        if (!accessToken) {
            wx.redirectTo({
                url: '../login/index'
            });
        } else if (!deviceNos) {
            uni.redirectTo({
                url: '../code/index'
            });
        } else {
            _this.accessToken = accessToken;
            _this.deviceNos = deviceNos;
            changeWarn(_this, backgroundAudioManager);
            getWarnCookie(_this);
            _this.getTime(1);
            _this.history();
        }
    },
    onHide: function() {},
    methods: {
        linkToLogin: function() {
            uni.redirectTo({
                url: '../login/index'
            });
        },
        changeNav(type) {
            let tabNum = this.tabNum;
            if (tabNum != type) {
                this.tabNum = type;
                this.getTime(type);
                this.history();
            }
        },
        getTime: function(page) {
            let timestamp = Date.parse(new Date());
            let result = null;
            if (page == '1') {
                result = this.getTodayStartTime();
            } else if (page == '2') {
                result = parseInt(timestamp / 1000) - 259200;
            } else if (page == '3') {
                result = parseInt(timestamp / 1000) - 604798;
            }
            this.endTime = parseInt(timestamp / 1000);
            this.startTime = result;
        },
        /**
         * 04. 获取设备的历史心率/呼吸/体动数据
         */
        history() {
            this.loading = 1;
            let obj = {
                deviceNos: this.deviceNos,
                startTime: this.startTime,
                endTime: this.endTime
            };
            let _this = this;
            myAjax2(
                'post',
                '/device/physiology/history',
                obj,
                function(res) {
                    if (res.retCode == '10000') {
                        console.log('history请求成功');
                        _this.setHistoryData(res);
                    } else {
                        console.log('history未知错误');
                    }
                    // console.log(JSON.stringify(res))
                },
                function(reg) {
                    console.log(JSON.stringify(reg));
                }
            );
        },
        /**
         * 转换列表类数据
         * @param data
         */
        setHistoryData(data) {
            let successData = data.successData;
            let result = [];
            let chartsTime = [];
            let chartsHeart = [];
            let chartsBreath = [];
            let chartsTidong = [];
            for (let i = successData.length - 1; i > -1; i--) {
                let obj = {
                    heart: successData[i].heart,
                    breath: successData[i].breath,
                    motion: successData[i].motion.substring(0, 1) * 1,
                    time: this.getLocalTime(successData[i].createTime)
                };
                result.push(obj);
                chartsTime.push(this.getLocalTime(successData[i].createTime).substring(0, 11));
                chartsHeart.push(successData[i].heart);
                chartsBreath.push(successData[i].breath);
                chartsTidong.push(successData[i].motion.substring(0, 1) * 1);
            }
            this.historyData = result;
            this.chartsTime = chartsTime;
            this.chartsHeart = chartsHeart;
            this.chartsBreath = chartsBreath;
            this.chartsTidong = chartsTidong;
            let LineA = {
                categories: chartsTime,
                series: [
                    {
                        name: '心率',
                        data: chartsHeart,
                        color: '#1890ff'
                    },
                    {
                        name: '呼吸率',
                        data: chartsBreath,
                        color: '#2fc25b'
                    },
                    {
                        name: '体动值',
                        data: chartsTidong,
                        color: '#facc14'
                    }
                ]
            };
            if (LineA.categories.length > 0 && LineA.series.length > 0) {
                _self.showLineB('canvasLineB', LineA);
                _self.showArea('canvasArea', LineA);
            }
        },
        /**
         * 格式化时间
         * @param sj
         * @returns {string}
         */
        getLocalTime(sj) {
            let now = new Date(sj * 1000);
            let month = now.getMonth() + 1;
            if (month < 10) month = '0' + month;
            let date = now.getDate();
            if (date < 10) date = '0' + date;
            let hour = now.getHours();
            if (hour < 10) hour = '0' + hour;
            let minute = now.getMinutes();
            if (minute < 10) minute = '0' + minute;
            let second = now.getSeconds();
            if (second < 10) second = '0' + second;
            return month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
        },
        /**
         * 根据当前时间获取今日开始时间点
         */
        getTodayStartTime() {
            let now = new Date(Date.parse(new Date()));
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let date = now.getDate();
            let time = year + '/' + month + '/' + date + ' ' + '00:00:01';
            return new Date(time).getTime() / 1000;
        },
        showLineA(canvasId, chartData) {
            canvaLineA = new wxCharts({
                $this: _self,
                canvasId: canvasId,
                type: 'line',
                fontSize: 11,
                legend: true,
                background: '#FFFFFF',
                pixelRatio: _self.pixelRatio,
                categories: chartData.categories,
                series: chartData.series,
                animation: false,
                enableScroll: false, //开启图表拖拽功能
                xAxis: {
                    disableGrid: false,
                    type: 'grid',
                    gridType: 'dash',
                    itemCount: 4, //可不填写，配合enableScroll图表拖拽功能使用，x轴单屏显示数据的数量，默认为5个
                    scrollShow: true //新增是否显示滚动条，默认false
                    //scrollBackgroundColor:'#F7F7FF',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条背景颜色,默认为 #EFEBEF
                    //scrollColor:'#DEE7F7',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条颜色,默认为 #A6A6A6
                },
                yAxis: {
                    //disabled:true
                    gridType: 'dash',
                    splitNumber: 8,
                    min: 0,
                    max: 180,
                    format: val => {
                        return val.toFixed(0);
                    } //如不写此方法，Y轴刻度默认保留两位小数
                },
                width: _self.cWidth * _self.pixelRatio,
                height: _self.cHeight * _self.pixelRatio,
                dataLabel: true,
                dataPointShape: true,
                extra: {
                    lineStyle: 'straight'
                }
            });
        },
        showLineB(canvasId, chartData) {
            canvaLineB = new wxCharts({
                $this: _self,
                canvasId: canvasId,
                type: 'line',
                fontSize: 11,
                legend: true,
                background: '#FFFFFF',
                pixelRatio: _self.pixelRatio,
                rotate: true, //开启图表横屏
                categories: chartData.categories,
                animation: false,
                series: chartData.series,
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    //disabled:true
                },
                width: _self.cWidth2 * _self.pixelRatio,
                height: _self.cHeight2 * _self.pixelRatio,
                dataLabel: false,
                dataPointShape: true,
                extra: {
                    lineStyle: 'curve'
                }
            });
        },
        showArea(canvasId, chartData) {
            canvaArea = new wxCharts({
                $this: _self,
                canvasId: canvasId,
                type: 'area',
                fontSize: 11,
                legend: true,
                background: '#FFFFFF',
                pixelRatio: _self.pixelRatio,
                categories: chartData.categories,
                animation: false,
                series: chartData.series,
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    //disabled:true
                },
                width: _self.cWidth * _self.pixelRatio,
                height: _self.cHeight * _self.pixelRatio,
                dataLabel: false,
                dataPointShape: true
            });
        },
        touchLineA(e) {
            canvaLineA.scrollStart(e);
        },
        moveLineA(e) {
            canvaLineA.scroll(e);
        },
        touchEndLineA(e) {
            canvaLineA.scrollEnd(e);
            //下面是toolTip事件，如果滚动后不需要显示，可不填写
            canvaLineA.showToolTip(e, {
                format: function(item, category) {
                    return category + ' ' + item.name + ':' + item.data;
                }
            });
        },
        touchLineB(e) {
            canvaLineB.showToolTip(e, {
                format: function(item, category) {
                    return category + ' ' + item.name + ':' + item.data;
                }
            });
        },
        touchArea(e) {
            canvaArea.showToolTip(e, {
                format: function(item, category) {
                    return category + ' ' + item.name + ':' + item.data;
                }
            });
        },
        /**
         * 关闭报警
         */
        audioPause: function() {
            util.audioPause(this, backgroundAudioManager);
        }
    }
};
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0;
}

view {
    display: block;
}

ec-canvas {
    width: 100%;
    height: 100%;
}

.record-outside {
    width: 750upx;
    height: 100vh;
    background-color: #fff;
}

.tab-bar {
    width: 750upx;
    height: 70upx;
    border-bottom: 1upx solid #eee;
}

.tab-bar text {
    display: inline-block;
    width: 33%;
    line-height: 70upx;
    float: left;
    text-align: center;
    font-size: 28upx;
}

.tab-bar text.thisover {
    color: #0099e9;
}

.record-tit {
    display: block;
    width: 700upx;
    height: 100upx;
    line-height: 100upx;
    border-bottom: 1upx solid #eee;
    margin: 0 25upx;
    text-align: left;
    font-size: 30upx;
}

.record-liebiao-tit {
    width: 700upx;
    height: 60upx;
    background-color: #eee;
    margin: 20upx 25upx 0;
    border: 1px solid #eee;
    text-align: center;
}

.record-liebiao-tit text {
    display: inline-block;
    line-height: 60upx;
    width: 20%;
    float: left;
    font-size: 24upx;
    color: #666;
}

.record-liebiao-tit text.time-long {
    width: 40%;
}

.record-liebiao-ul {
    display: block;
    width: 700upx;
    margin: 0 25upx 50upx;
    overflow: hidden;
    border: 1upx solid #eee;
}

.record-liebiao-ul li {
    display: block;
    overflow: hidden;
    height: 50upx;
    text-align: center;
}

.record-liebiao-ul li.thisover {
    background-color: #f9f9f9;
}

.record-liebiao-ul li text {
    display: inline-block;
    width: 20%;
    height: 50upx;
    line-height: 50upx;
    font-size: 24upx;
    color: #666;
    float: left;
}

.record-liebiao-ul li text.time-long {
    width: 40%;
}

.qiun-padding {
    padding: 2%;
    width: 96%;
}

.qiun-wrap {
    display: flex;
    flex-wrap: wrap;
}

.qiun-rows {
    display: flex;
    flex-direction: row !important;
}

.qiun-columns {
    display: flex;
    flex-direction: column !important;
}

.qiun-common-mt {
    margin-top: 10upx;
}

.qiun-bg-white {
    background: #ffffff;
}

.qiun-title-bar {
    width: 710upx;
    padding: 30upx 0 20upx;
    flex-wrap: nowrap;
    border-bottom: 1upx solid #f5f5f5;
    margin: 0 auto;
}

.qiun-title-dot-light {
    border-left: 10upx solid #0099e9;
    padding-left: 10upx;
    font-size: 32upx;
    color: #333;
    line-height: 40upx;
}

/* 通用样式 */
.qiun-charts {
    width: 750upx;
    height: 500upx;
    background-color: #ffffff;
}

.charts {
    width: 750upx;
    height: 500upx;
    background-color: #ffffff;
}

/* 横屏样式 */
.qiun-charts-rotate {
    width: 700upx;
    height: 1100upx;
    background-color: #ffffff;
    padding: 25upx;
}

.charts-rotate {
    width: 700upx;
    height: 1100upx;
    background-color: #ffffff;
}

/* 圆弧进度样式 */
.qiun-charts3 {
    width: 750upx;
    height: 250upx;
    background-color: #ffffff;
    position: relative;
}

.charts3 {
    position: absolute;
    width: 250upx;
    height: 250upx;
    background-color: #ffffff;
}

.qiun-tip {
    display: block;
    width: auto;
    overflow: hidden;
    padding: 15upx;
    height: 30upx;
    line-height: 30upx;
    margin: 10upx;
    background: #ff9933;
    font-size: 30upx;
    border-radius: 8upx;
    justify-content: center;
    text-align: center;
    border: 1upx solid #dc7004;
    color: #ffffff;
}

</style>
