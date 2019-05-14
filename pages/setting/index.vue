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
function getDate(type) {
    const date = new Date()

    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    if (type === 'start') {
        year = year - 60
    } else if (type === 'end') {
        year = year + 2
    }
    month = month > 9 ? month : '0' + month
    day = day > 9 ? day : '0' + day

    return `${year}-${month}-${day}`
}

var util = require('../../common/util.js')

var warnRuleData = util.warnRuleData
var setCookie = util.setCookie
var getCookie = util.getCookie
var getWarnCookie = util.getWarnCookie
var setWarnCookie = util.setWarnCookie
var changeWarnToThis = util.changeWarnToThis

export default {
    data() {
        return {
            title: '系统设置',
            toast: 0,
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
            warnMotionTime: ''
        }
    },
    onLoad() {
        let _this = this
        _this.timer = setInterval(function() {
            changeWarnToThis(_this)
            // console.log('setting页面同步一次报警数据')
        }, 1000)
    },
    onLaunch() {},
    onShow() {
        let _this = this
        let accessToken = util.getCookie('accessToken')
        let deviceNos = getCookie('deviceNos')
        if (!accessToken) {
            wx.redirectTo({
                url: '../login/index'
            })
        } else if (!deviceNos) {
            uni.redirectTo({
                url: '../code/index'
            })
        } else {
            _this.accessToken = accessToken
            _this.deviceNos = deviceNos
            changeWarnToThis(_this)
            getWarnCookie(_this)
        }
    },
    onHide() {},
    onUnload() {
        clearInterval(this.timer)
    },
    methods: {
        // 01. 离床提醒开关
        switch1Change(e) {
            this.device = e.target.value
            warnRuleData.device = e.target.value
            setWarnCookie(this)
        },
        // 01 - 1 离床持续时长设置
        deviceTimesChange(e) {
            let value = e.target.value
            if (value < 1 || value > 300) {
                value = 1
                util.showToastBox(this, '请输入1-300的数字')
            }
            this.deviceTimes = value
            warnRuleData.deviceTimes = value
            setWarnCookie(this)
        },
        // 01 - 2 离床提醒设置时间段-开始时间
        deviceStartChange(e) {
            this.deviceStart = e.target.value
            warnRuleData.deviceStart = e.target.value
            setWarnCookie(this)
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!')
            }
        },
        // 01 - 3 离床提醒设置时间段-结束时间
        deviceEndChange(e) {
            this.deviceEnd = e.target.value
            warnRuleData.deviceEnd = e.target.value
            setWarnCookie(this)
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!')
            }
        },
        // 02. 心率提醒开关
        switch2Change(e) {
            this.heart = e.target.value
            warnRuleData.heart = e.target.value
            setWarnCookie(this)
        },
        // 02 - 1 心率提醒下限设置
        heartDownChange(e) {
            let value = e.target.value
            if (value < 1 || value > 180) {
                value = 1
                util.showToastBox(this, '请输入1-180的数字')
            }
            this.heartDown = value
            warnRuleData.heartDown = value
            setWarnCookie(this)
        },
        // 02 - 2 心率提醒上限设置
        heartUpChange(e) {
            let value = e.target.value
            if (value < 1 || value > 180) {
                value = 1
                util.showToastBox(this, '请输入1-180的数字')
            }
            this.heartUp = value
            warnRuleData.heartUp = value
            setWarnCookie(this)
        },
        // 03. 呼吸提醒开关
        switch3Change(e) {
            this.breath = e.target.value
            warnRuleData.breath = e.target.value
            setWarnCookie(this)
        },
        // 03 - 1 呼吸率提醒下限设置
        breathDownChange(e) {
            let value = e.target.value
            if (value < 1 || value > 180) {
                value = 1
                util.showToastBox(this, '请输入1-180的数字')
            }
            this.breathDown = value
            warnRuleData.breathDown = value
            setWarnCookie(this)
        },
        // 03 - 2 呼吸率提醒上限设置
        breathUpChange(e) {
            let value = e.target.value
            if (value < 1 || value > 180) {
                value = 1
                util.showToastBox(this, '请输入1-180的数字')
            }
            this.breathUp = value
            warnRuleData.breathUp = value
            setWarnCookie(this)
        },
        // 04. 体动频繁提醒开关
        switch4Change(e) {
            this.motion = e.target.value
            warnRuleData.motion = e.target.value
            setWarnCookie(this)
        },
        // 04 - 1 体动频繁持续时长设置
        motionTimesChange(e) {
            let value = e.target.value
            if (value < 1 || value > 300) {
                value = 1
                util.showToastBox(this, '请输入1-300的数字')
            }
            this.motionTimes = value
            warnRuleData.motionTimes = value
            setWarnCookie(this)
        },
        // 04 - 2 体动频繁提醒设置时间段-开始时间
        motionStartChange(e) {
            this.motionStart = e.target.value
            warnRuleData.motionStart = e.target.value
            setWarnCookie(this)
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!')
            }
        },
        // 04 - 3 体动频繁提醒设置时间段-结束时间
        motionEndChange(e) {
            this.motionEnd = e.target.value
            warnRuleData.motionEnd = e.target.value
            setWarnCookie(this)
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!')
            }
        },
        
        /**
         * 关闭报警
         */
        audioPause() {
            util.audioPause(this)
        }
    }
}
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

</style>
