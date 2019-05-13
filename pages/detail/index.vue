<template>
    <view class="index_outside">
        <view class="xin-outbar">
            <image class="bj-img" src="/static/bj-xin-off.png"></image>
            <image class="bj-img" src="/static/bj-xin-on.png" v-if="deviceStatus == 4"></image>
            <view class="bpm">BPM</view>
            <view class="text-xintiao">
                <text v-if="heartNum == 65436">--</text>
                <text v-if="heartNum != 65436">{{ heartNum }}</text>
            </view>
            <image class="icon-xin" src="/static/icon-xintiao.png"></image>
            <view class="text-huxi">
                <text v-if="breathNum == -100">--</text>
                <text v-if="breathNum != -100">{{ breathNum }}</text>
            </view>
            <image class="icon-huxi" src="/static/icon-huxi.png"></image>
            <view class="ci">次/分</view>
        </view>

        <view class="bed-outbar">
            <view class="bed-state">
                <text v-if="deviceStatus == 3">离床</text>
                <text v-if="deviceStatus == 4">在床</text>
                <text v-if="deviceStatus == 5">光纤故障</text>
                <text v-if="deviceStatus == 6">离线</text>
                <text v-if="deviceStatus == 9">传感器负荷</text>
                <text v-if="deviceStatus == 10">信号弱</text>
            </view>
            <image class="bj-img" src="/static/c-on.png" v-if="deviceStatus == 4"></image>
            <image class="bj-img" src="/static/c-off.png" v-if="deviceStatus != 4"></image>
        </view>

        <view class="btn-bar">
            <view class="btn-k" @click="linkRecord">
                <image class="bj-img" src="/static/tubiao.png"></image>
                <text>历史数据</text>
            </view>
            <view class="btn-k" @click="linkSetting">
                <image class="bj-img" src="/static/chilun.png"></image>
                <text>守护设置</text>
            </view>
        </view>

        <!--报警弹窗-->
        <view class="base-box warn-box" catchtouchmove="true" v-if="warnNing == 1">
            <view class="gray-back"></view>
            <view class="box-content">
                <text class="txt">{{ warningText }}</text>
                <view class="img"><image src="/static/warning.png"></image></view>
                <view><button @click="audioPause">已知晓!</button></view>
            </view>
        </view>
        <!--居中灰色块Loading-->
        <view class="base-box loading-box" catchtouchmove='true' v-if="loading == 1">
            <view class="gray-back"></view>
            <view class="box-content">
                <view class="img">
                    <image src="/static/loading.gif"></image>
                </view>
                <view class="txt">加载中...</view>
            </view>
        </view>
        <!--toast提示弹窗-->
        <view class="show-toast" v-if="showToast == 1">
            <text>{{ toastTxt }}</text>
        </view>

    </view>
</template>

<script>
var util = require('../../common/util.js');

var baseHost = util.baseHost;
var imgUrl = util.imgUrl;
var warnRule = util.warnRule;
var warnState = util.warnState;
var setCookie = util.setCookie;
var getCookie = util.getCookie;
var myAjax = util.myAjax;
var myAjax2 = util.myAjax2;
var getWarnCookie = util.getWarnCookie;
var setWarnCookie = util.setWarnCookie;
var audioPause = util.audioPause;
var changeWarn = util.changeWarn;
var checkWarn = util.checkWarn;

var backgroundAudioManager = wx.getBackgroundAudioManager();

export default {
    data() {
        return {
            title: 'Smater 守护',

            showToast: 0,
            toastTxt: '',
            loading: 0,

            userInfo: null,
            deviceNos: '', // 设备号
            accessToken: null,

            breathNum: '--', // 呼吸值 -100_无效值，其他为正常值
            deviceStatus: null, // 设备状态 3_离床，4_在床，5_光纤故障，6_离线，9_传感器负荷，10_信号弱
            heartNum: '--', // 心率值 65436_无效值，其他为正常值
            markTime: null, // 发生的时间戳
            motionNum: null, // 体动值 0_正常，3_轻微体动，4_中度体动，5_大幅体动，-100_无效值
            timer: null,

            device: '', // 是否监控离床
            deviceTimes: '', // 离床持续时间
            deviceStart: '', // 监控时段开始
            deviceEnd: '', // 监控时段结束
            heart: '', // 是否监控心率
            heartUp: '', // 心率过快峰值
            heartDown: '', // 心率过慢峰值
            breath: '', // 是否监控呼吸率
            breathUp: '', // 呼吸过快峰值
            breathDown: '', // 呼吸过慢峰值
            motion: '', // 是否监控体动值
            motionTimes: '', // 大幅体动持续时间
            motionStart: '', // 体动监控时段开始
            motionEnd: '', // 体动监控时段结束

            warnNing: 0,
            warningText: '',
            warnNo: '',
            warnDeviceTime: '',
            warnHeartTime: '',
            warnBreathTime: '',
            warnMotionTime: '',

            firstTimes: 0
        };
    },
    onLoad() {},
    onLaunch() {},
    onShow() {
        let _this = this;
        let accessToken = getCookie('accessToken');
        let deviceNos = getCookie('deviceNos');
        let userInfo = getCookie('username');
        if (!accessToken) {
            uni.redirectTo({
                url: '../login/index'
            });
        } else if (!deviceNos) {
            uni.redirectTo({
                url: '../code/index'
            });
        } else {
            changeWarn(_this);
            getWarnCookie(_this);
            _this.userInfo = userInfo;
            _this.accessToken = accessToken;
            _this.deviceNos = deviceNos;
            _this.getActual();
            _this.setSocketTask();
            _this.timer = setInterval(function() {
                _this.getActual();
            }, 3000);
        }
    },
    onHide() {
        clearInterval(this.timer);
    },
    onUnload() {
        clearInterval(this.timer);
    },
    methods: {
        /**
         * 03. 获取设备当前的状态/心率/呼吸/体动数据
         */
        getActual(loading) {
            console.log('获取设备当前的状态一次(detail)!')
            if (loading) {
                this.loading = 1
            }
            let obj = {
                deviceNos: this.deviceNos
            };
            let _this = this;
            myAjax2(
                'post',
                '/device/physiology/actual',
                obj,
                function(res) {
                    if (res.retCode == '10000') {
                        let deviceStatus = res.successData[0].deviceStatus;
                        if (warnRule.device && _this.deviceStatus=='4' && deviceStatus == '3' && !warnState.warnDeviceTime) {
                            console.log('离床已记录，以此时间为基准开始计算报警数据');
                            warnState.warnDeviceTime = Date.parse(new Date());
                            warnState.warnHeartTime = null;
                            warnState.warnBreathTime = null;
                            warnState.warnMotionTime = null;
                            _this.warnDeviceTime = warnState.warnDeviceTime;
                            _this.warnHeartTime = null;
                            _this.warnBreathTime = null;
                            _this.warnMotionTime = null;
                        }
                        if (deviceStatus == '4') {
                            warnState.warnDeviceTime = null;
                            _this.warnDeviceTime = null;
                            console.log('解除离床报警计算数据');
                        }

                        checkWarn(_this, res, backgroundAudioManager);
                        _this.deviceStatus = deviceStatus;
                        _this.breathNum = res.successData[0].breath;
                        _this.heartNum = res.successData[0].heart;
                        _this.markTime = res.successData[0].markTime;
                        _this.motionNum = res.successData[0].motion;
                        _this.loading = 0;
                    } else {
                        // console.log('未知错误，请重新登录');
                        setCookie('accessToken', '');
                        setCookie('username', '');
                        uni.redirectTo({
                            url: '../login/index'
                        });
                    }
                },
                function(reg) {
                    // console.log(JSON.stringify(reg));
                }
            );
        },
        linkRecord() {
            uni.navigateTo({
                url: '../record/index'
            });
        },
        linkSetting() {
            uni.navigateTo({
                url: '../setting/index'
            });
        },
        /**
         * 时时数据推送
         */
        setSocketTask() {
            if (this.firstTimes == 1) return
            this.firstTimes = 1;
            let accessToken = util.getCookie('accessToken');
            let _this = this;
            // 建立连接
            // console.log('建立连接!');
            wx.connectSocket({
                url: 'ws://stream.darma.cn:17004/ws',
                sluccess() {
                    // console.log('连接成功...');
                },
                fail() {
                    // console.log('连接失败...');
                }
            });
            // 连接成功
            wx.onSocketOpen(function() {
                // console.log('连接成功!');
                let obj = {
                    // 消息类型msgType前有 login（登录消息），deviceStatus（设备状态消息）healthData（心率呼吸数据消息），paramError（参数错误消息）
                    msgType: 'login',
                    data: {
                        token: accessToken,
                        // 订阅类型subType有“ALL”,“SINGLETON”(区分大小写)
                        // subType: 'SINGLETON', /*订阅所有的设备*/
                        deviceNo: _this.deviceNos
                    }
                };
                wx.sendSocketMessage({
                    data: JSON.stringify(obj)
                });
            });
            // 接收数据
            wx.onSocketMessage(function(data) {
                console.log('***************************detail回执')
                // console.log('接收数据回执，warnState.warnNing = ' + warnState.warnNing)
                // heartBreathBcg、healthBreathData、deviceStatus

                // if (JSON.parse(data.data).msgType == 'healthBreathData' || JSON.parse(data.data).msgType == 'deviceStatus') {
                    // console.log(data.data);
                    // console.log('111111111111' + JSON.parse(data.data).msgType)
                // }
                // 当状态发生变化会初始化时，会推送此条数据
                // console.log('warnRule.device = ' + util.warnRule.device)
                // if (JSON.parse(data.data).msgType == 'deviceStatus' && util.warnRule.device) {
                //     console.log('222222222222---' + JSON.parse(data.data).data.deviceStatus)
                //     if (JSON.parse(data.data).data.deviceStatus == '3') {
                //         console.log('离床已记录，以此时间为基准开始计算报警数据');
                //         warnState.warnDeviceTime = Date.parse(new Date());
                //         warnState.warnHeartTime = null;
                //         warnState.warnBreathTime = null;
                //         warnState.warnMotionTime = null;
                //         _this.warnDeviceTime = warnState.warnDeviceTime;
                //         _this.warnHeartTime = null;
                //         _this.warnBreathTime = null;
                //         _this.warnMotionTime = null;
                //     } else {
                //         warnState.warnDeviceTime = null;
                //         _this.warnDeviceTime = null;
                //         console.log('解除离床报警计算数据');
                //     }
                // }
            });
            //连接失败
            wx.onSocketError(function() {
                // console.log('websocket连接失败！');
            });
        },
        /**
         * 关闭报警
         */
        audioPause() {
            util.audioPause(this, backgroundAudioManager);
        }
    }
};
</script>

<style>
page {
    height: auto;
}
view {
    display: block;
    text-align: center;
}

.xin-outbar {
    width: 440upx;
    height: 440upx;
    margin: 120upx auto 0;
    position: relative;
}

.xin-outbar .bj-img {
    width: 440upx;
    height: 440upx;
    position: absolute;
    left: 0;
    top: 0;
}

.xin-outbar .bpm {
    width: 440upx;
    line-height: 44upx;
    font-size: 26upx;
    color: #fff;
    text-align: center;
    position: absolute;
    left: 0;
    top: 80upx;
    z-index: 2;
}

.xin-outbar .text-xintiao {
    width: 220upx;
    height: 60upx;
    font-size: 54upx;
    color: #fff;
    text-align: right;
    position: absolute;
    left: 0;
    top: 102upx;
    z-index: 2;
}

.xin-outbar .icon-xin {
    width: 36upx;
    height: 36upx;
    position: absolute;
    left: 236upx;
    top: 135upx;
    z-index: 2;
}

.xin-outbar .text-huxi {
    width: 220upx;
    height: 60upx;
    font-size: 54upx;
    color: #fff;
    text-align: right;
    position: absolute;
    left: 0;
    top: 235upx;
    z-index: 2;
}

.xin-outbar .icon-huxi {
    width: 36upx;
    height: 36upx;
    position: absolute;
    left: 236upx;
    top: 264upx;
    z-index: 2;
}

.xin-outbar .ci {
    width: 440upx;
    line-height: 44upx;
    font-size: 26upx;
    color: #fff;
    text-align: center;
    position: absolute;
    left: 0;
    top: 315upx;
    z-index: 2;
}

.bed-outbar .bed-state {
    font-size: 30upx;
    color: #0099e9;
    padding: 50upx 0 40upx;
    overflow: hidden;
}

.bed-outbar image {
    width: 400upx;
    height: 278upx;
}

.btn-bar {
    width: 750upx;
    height: 120upx;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 2;
}

.btn-bar .btn-k {
    width: 300upx;
    height: 80upx;
    border-radius: 80upx;
    background-color: #0099e9;
    float: left;
    margin-left: 50upx;
    overflow: hidden;
}

.btn-bar .btn-k:active {
    opacity: 0.7;
}

.btn-bar .btn-k image {
    width: 40upx;
    height: 40upx;
    float: left;
    margin: 20upx 20upx 0 56upx;
}

.btn-bar .btn-k text {
    line-height: 40upx;
    display: inline-block;
    font-size: 32upx;
    color: #ffdc9e;
    float: left;
    margin-top: 20upx;
}
</style>
