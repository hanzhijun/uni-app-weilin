<template>
    <view class="set-outside">
        <!-- 离床提醒 -->
        <view class="setting-section">
            <view class="setting-auto">
                <text>离床提醒</text>
                <switch v-if="device" name="switch" class="wx-switch-input" @change="switch1Change" checked />
                <switch v-if="!device" name="switch" class="wx-switch-input" @change="switch1Change" />
            </view>

            <view class="setting-detail" style="padding: 0 20upx">
                <view class="uni-list">
                    <view class="uni-list-cell" style="padding: 12upx 0">
                        <view class="uni-list-cell-left">离床持续时长(分)</view>
                        <view class="uni-list-cell-db"><input type="number" class="input-num" @change="deviceTimesChange" v-model="deviceTimes" /></view>
                    </view>
                </view>

                <view class="uni-list" style="border-top: 1upx solid #eee;border-bottom: 1upx solid #eee">
                    <view class="uni-list-cell">
                        <view class="uni-list-cell-left">告警时间段(开始)</view>
                        <view class="uni-list-cell-db">
                            <picker mode="time" :value="time" start="00:00" end="23:59" @change="deviceStartChange">
                                <view class="uni-input">{{ deviceStart }}</view>
                            </picker>
                        </view>
                    </view>
                </view>

                <view class="uni-list" style="border-bottom: 1upx solid #eee;">
                    <view class="uni-list-cell">
                        <view class="uni-list-cell-left">告警时间段(结束)</view>
                        <view class="uni-list-cell-db">
                            <picker mode="time" :value="time" start="00:00" end="23:59" @change="deviceEndChange">
                                <view class="uni-input">{{ deviceEnd }}</view>
                            </picker>
                        </view>
                    </view>
                </view>

                <view class="uni-list">
                    <view class="uni-list-cell">
                        <text class="warn-note">
                            温馨提示: 离床报警将只在上述时间段内,离床持续时长超过设定分钟数时执行 (结束时间需大于开始时间，否则视为错误设置，无法触发报警)
                        </text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 心率异常提醒 -->
        <view class="setting-section">
            <view class="setting-auto">
                <text>心率异常提醒</text>
                <switch v-if="heart" name="switch" class="wx-switch-input" @change="switch2Change" checked />
                <switch v-if="!heart" name="switch" class="wx-switch-input" @change="switch2Change" />
            </view>

            <view class="setting-detail" style="padding: 0 20upx">
                <view class="uni-list">
                    <view class="uni-list-cell" style="padding: 12upx 0">
                        <view class="uni-list-cell-left">告警下限(次/分)</view>
                        <view class="uni-list-cell-db"><input type="number" class="input-num" @change="heartDownChange" v-model="heartDown" /></view>
                    </view>
                </view>

                <view class="uni-list" style="border-top: 1upx solid #eee;border-bottom: 1upx solid #eee;padding: 12upx 0">
                    <view class="uni-list-cell">
                        <view class="uni-list-cell-left">告警上限(次/分)</view>
                        <view class="uni-list-cell-db">
                            <view class="uni-list-cell-db"><input type="number" class="input-num" @change="heartUpChange" v-model="heartUp" /></view>
                        </view>
                    </view>
                </view>

                <view class="uni-list">
                    <view class="uni-list-cell"><text class="warn-note">温馨提示: 设备采集到的心率数据, 超过了设定的上限或者低于设定的下限, 将触发心率异常报警</text></view>
                </view>
            </view>
        </view>

        <!-- 呼吸率异常提醒 -->
        <view class="setting-section">
            <view class="setting-auto">
                <text>呼吸率异常提醒</text>
                <switch v-if="breath" name="switch" class="wx-switch-input" @change="switch3Change" checked />
                <switch v-if="!breath" name="switch" class="wx-switch-input" @change="switch3Change" />
            </view>

            <view class="setting-detail" style="padding: 0 20upx">
                <view class="uni-list">
                    <view class="uni-list-cell" style="padding: 12upx 0">
                        <view class="uni-list-cell-left">告警下限(次/分)</view>
                        <view class="uni-list-cell-db"><input type="number" class="input-num" @change="breathDownChange" v-model="breathDown" /></view>
                    </view>
                </view>

                <view class="uni-list" style="border-top: 1upx solid #eee;border-bottom: 1upx solid #eee;padding: 12upx 0">
                    <view class="uni-list-cell">
                        <view class="uni-list-cell-left">告警上限(次/分)</view>
                        <view class="uni-list-cell-db">
                            <view class="uni-list-cell-db"><input type="number" class="input-num" @change="breathUpChange" v-model="breathUp" /></view>
                        </view>
                    </view>
                </view>

                <view class="uni-list">
                    <view class="uni-list-cell"><text class="warn-note">温馨提示: 设备采集到的呼吸数据,超过了设定的上限或者低于设定的下限,将触发呼吸异常报警</text></view>
                </view>
            </view>
        </view>

        <!-- 体动频繁提醒 -->
        <view class="setting-section">
            <view class="setting-auto">
                <text>体动频繁提醒</text>
                <switch v-if="motion" name="switch" class="wx-switch-input" @change="switch4Change" checked />
                <switch v-if="!motion" name="switch" class="wx-switch-input" @change="switch4Change" />
            </view>

            <view class="setting-detail" style="padding: 0 20upx">
                <view class="uni-list">
                    <view class="uni-list-cell" style="padding: 12upx 0">
                        <view class="uni-list-cell-left">持续时长(分)</view>
                        <view class="uni-list-cell-db"><input type="number" class="input-num" @change="motionTimesChange" v-model="motionTimes" /></view>
                    </view>
                </view>

                <view class="uni-list" style="border-top: 1upx solid #eee;border-bottom: 1upx solid #eee">
                    <view class="uni-list-cell">
                        <view class="uni-list-cell-left">告警时间段(开始)</view>
                        <view class="uni-list-cell-db">
                            <picker mode="time" :value="time" start="00:00" end="23:59" @change="motionStartChange">
                                <view class="uni-input">{{ motionStart }}</view>
                            </picker>
                        </view>
                    </view>
                </view>

                <view class="uni-list" style="border-bottom: 1upx solid #eee;">
                    <view class="uni-list-cell">
                        <view class="uni-list-cell-left">告警时间段(结束)</view>
                        <view class="uni-list-cell-db">
                            <picker mode="time" :value="time" start="00:00" end="23:59" @change="motionEndChange">
                                <view class="uni-input">{{ motionEnd }}</view>
                            </picker>
                        </view>
                    </view>
                </view>

                <view class="uni-list">
                    <view class="uni-list-cell">
                        <text class="warn-note">
                            温馨提示: 体动频繁报警将只在上述时间段内,体动频繁持续时长超过设定分钟数时执行 (结束时间需大于开始时间，否则视为错误设置，无法触发报警)
                        </text>
                    </view>
                </view>
            </view>
        </view>
        
        <!-- 其他设置-->
        <view class="setting-section">
            <view class="setting-other" @click="openConfirmBox">
                <text class="setting-txt">退出</text>
                <text class="setting-icon">></text>
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
        <!-- 确定操作弹窗-->
        <view class="base-box warn-box" catchtouchmove="true" v-if="confirm == 1">
            <view class="gray-back"></view>
            <view class="box-confirm">
                <text class="txt">确定退出当前帐户？</text>
                <view class="confirm-btn"><text @click="closeConfirmBox">取消</text><text class="blue" @click="loginOut">确定</text></view>
            </view>
        </view>
    </view>
</template>

<script>
function getDate(type) {
    const date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (type === 'start') {
        year = year - 60;
    } else if (type === 'end') {
        year = year + 2;
    }
    month = month > 9 ? month : '0' + month;
    day = day > 9 ? day : '0' + day;

    return `${year}-${month}-${day}`;
}

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
            title: '系统设置',
            toast: 0,
            toastTxt: '',
            loading: 0,
            confirm: 0,

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
            warnMotionTime: ''
        };
    },
    onLoad() {
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
            _this.timer = setInterval(function() {
                _this.getActual();
            }, 5000);
        }
    },
    onLaunch() {},
    onShow() {},
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
            console.log('获取设备当前的状态一次(setting)!')
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
                        if (warnRule.device && _this.deviceStatus=='4' && deviceStatus == '3') {
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
        switch1Change(e) {
            this.device = e.target.value;
            warnRule.device = e.target.value;
            util.setWarnCookie(this);
        },
        switch2Change(e) {
            this.heart = e.target.value;
            warnRule.heart = e.target.value;
            util.setWarnCookie(this);
        },
        switch3Change(e) {
            this.breath = e.target.value;
            warnRule.breath = e.target.value;
            util.setWarnCookie(this);
        },
        switch4Change(e) {
            this.motion = e.target.value;
            warnRule.motion = e.target.value;
            util.setWarnCookie(this);
        },
        bindTime01Change(e) {
            this.deviceStart = e.target.value;
            warnRule.deviceStart = e.target.value;
            util.setWarnCookie(this);
        },
        bindTime02Change(e) {
            this.deviceEnd = e.target.value;
            warnRule.deviceEnd = e.target.value;
            util.setWarnCookie(this);
        },
        deviceTimesChange(e) {
            let value = e.target.value;
            if (value < 1 || value > 300) {
                value = 1;
                util.showToastBox(this, '请输入1-300的数字');
            }
            this.deviceTimes = value;
            warnRule.deviceTimes = value;
            util.setWarnCookie(this);
        },
        deviceStartChange(e) {
            this.deviceStart = e.target.value;
            warnRule.deviceStart = e.target.value;
            util.setWarnCookie(this);
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!');
            }
        },
        deviceEndChange(e) {
            this.deviceEnd = e.target.value;
            warnRule.deviceEnd = e.target.value;
            util.setWarnCookie(this);
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!');
            }
        },
        heartDownChange(e) {
            let value = e.target.value;
            if (value < 1 || value > 180) {
                value = 1;
                util.showToastBox(this, '请输入1-180的数字');
            }
            this.heartDown = value;
            warnRule.heartDown = value;
            util.setWarnCookie(this);
        },
        heartUpChange(e) {
            let value = e.target.value;
            if (value < 1 || value > 180) {
                value = 1;
                util.showToastBox(this, '请输入1-180的数字');
            }
            this.heartUp = value;
            warnRule.heartUp = value;
            util.setWarnCookie(this);
        },
        breathDownChange(e) {
            let value = e.target.value;
            if (value < 1 || value > 180) {
                value = 1;
                util.showToastBox(this, '请输入1-180的数字');
            }
            this.breathDown = value;
            warnRule.breathDown = value;
            util.setWarnCookie(this);
        },
        breathUpChange(e) {
            let value = e.target.value;
            if (value < 1 || value > 180) {
                value = 1;
                util.showToastBox(this, '请输入1-180的数字');
            }
            this.breathUp = value;
            warnRule.breathUp = value;
            util.setWarnCookie(this);
        },
        motionTimesChange(e) {
            let value = e.target.value;
            if (value < 1 || value > 300) {
                value = 1;
                util.showToastBox(this, '请输入1-300的数字');
            }
            this.motionTimes = value;
            warnRule.motionTimes = value;
            util.setWarnCookie(this);
        },
        motionEndChange(e) {
            this.motionEnd = e.target.value;
            warnRule.motionEnd = e.target.value;
            util.setWarnCookie(this);
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!');
            }
        },
        motionStartChange(e) {
            this.motionStart = e.target.value;
            warnRule.motionStart = e.target.value;
            util.setWarnCookie(this);
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!');
            }
        },
        /**
         * 关闭报警
         */
        audioPause() {
            util.audioPause(this, backgroundAudioManager);
        },
        openConfirmBox() {
            this.confirm = 1;
        },
        closeConfirmBox() {
            this.confirm = 0;
        },
        loginOut() {
            setCookie('accessToken', '');
            setCookie('username', '');
            setCookie('deviceNos', '');
            setCookie('warnRule', '');
            this.confirm = 0;
            clearInterval(this.timer);
            uni.reLaunch({
                url: '../login/index'
            });
        }
    }
};
</script>

<style>
.set-outside {
    width: 100vw;
    height: 100vh;
    background-color: #ededed;
    overflow-y: auto;
}

.set-outside .image {
    width: 650upx;
    height: 600upx;
    margin: 100upx auto 0;
}

.setting-section {
    width: 730upx;
    overflow: hidden;
    background-color: #fff;
    margin: 10upx;
}

.setting-section .setting-auto {
    height: 80upx;
    border-bottom: 1px solid #eee;
}

.setting-section .setting-auto text {
    display: inline-block;
    height: 40upx;
    line-height: 40upx;
    font-size: 28upx;
    color: #000;
    border-left: 3px solid #0099e9;
    float: left;
    margin: 20upx 0 0 10upx;
    padding-left: 20upx;
}

.setting-section .wx-switch-input {
    float: right;
    margin: 10upx 20upx 0 0;
    width: 82upx !important;
    height: 40upx !important;
}

.setting-section .wx-switch-input::before {
    width: 80upx !important;
    height: 36upx !important;
}

.setting-section .wx-switch-input::after {
    width: 38upx !important;
    height: 36upx !important;
}

.uni-list {
    position: static;
}

.warn-note {
    display: block;
    padding: 10upx 12upx 10upx 26upx;
    font-size: 22upx;
    color: #999;
    line-height: 36upx;
}

.input-num {
    width: 200upx;
    height: 36upx;
    border: 1upx solid #f5f5f5;
    font-size: 24upx;
    padding-left: 15upx;
    line-height: 36upx;
    margin-left: 15upx;
}

.uni-list-cell-left {
    font-size: 24upx;
    min-width: 180upx;
}

.setting-other {
    overflow: hidden;
    padding: 20upx 30upx 20upx 45upx;
}

.setting-other:active {
    opacity: .7;
}

.setting-other text {
    display: inline-block;
    line-height: 36upx;
    float: left;
}

.setting-other text.setting-icon {
    float: right;
}

.box-confirm {
    width: 500upx;
    height: 250upx;
    background: #fff;
    border-radius: 10upx;
    position: absolute;
    left: calc(50vw - 250upx);
    top: calc(50vh - 350upx);
}

.box-confirm .txt {
    display: block;
    line-height: 150upx;
    text-align: center;
    font-size: 32upx;
}

.box-confirm .confirm-btn {
    border-top: 1upx solid #eee;
}

.box-confirm .confirm-btn text {
    display: inline-block;
    width: 50%;
    height: 100upx;
    line-height: 100upx;
    text-align: center;
    float: left;
}

.box-confirm .confirm-btn text.blue {
    background-color: #0099e9;
    color: #fff;
    border-bottom-right-radius: 10upx;
}

</style>
