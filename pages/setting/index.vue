<template>
    <view class="set-outside" style="padding-top: 10upx;">
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
                            温馨提示: 起止时间点一样说明24小时内都需要报警，例:“00:00 - 00:00”,离床持续时长为10分钟,说明在24小时内,离床超过10分钟推送离床预警
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
                    <view class="uni-list-cell"><text class="warn-note">温馨提示: 设备采集到的心率数据, 超过了设定的上限或者低于设定的下限, 推送一条心率预警</text></view>
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
                    <view class="uni-list-cell"><text class="warn-note">温馨提示: 设备采集到的呼吸数据,超过了设定的上限或者低于设定的下限,推送一条呼吸预警</text></view>
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
                            起止时间点一样说明24小时内都需要报警，例:“00:00 - 00:00”,体动频繁持续时长为10分钟,说明在24小时内,频繁体动超过10分钟推送体动频繁预警
                        </text>
                    </view>
                </view>
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

        <!--toast提示弹窗-->
        <view class="show-toast" v-if="showToast == 1">
            <text>{{ toastTxt }}</text>
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
var getCookie = util.getCookie;
var setCookie = util.setCookie;
var changeWarn = util.changeWarn;
var getWarnCookie = util.getWarnCookie;
var myAjax2 = util.myAjax2;
var backgroundAudioManager = wx.getBackgroundAudioManager();
export default {
    data() {
        return {
            title: '系统设置',
            showToast: 0,
            toastTxt: '',
            userInfo: null,
            deviceNos: '', // 设备号
            accessToken: null,
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
            motionEnd: '' // 体动监控时段结束
        };
    },
    onLoad() {},
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
        }
    },
    onHide: function() {},
    methods: {
        bindPickerChange: function(e) {
            console.log('picker发送选择改变，携带值为：' + e.target.value);
            this.index = e.target.value;
        },
        bindMultiPickerColumnChange: function(e) {
            console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value);
            this.multiIndex[e.detail.column] = e.detail.value;
            this.$forceUpdate();
        },
        bindTime01Change: function(e) {
            this.deviceStart = e.target.value;
        },
        bindTime02Change: function(e) {
            this.deviceEnd = e.target.value;
        },
        /**
         * 关闭报警
         */
        audioPause: function() {
            util.audioPause(this, backgroundAudioManager);
        },
        switch1Change: function(e) {
            this.device = e.target.value;
            util.setWarnCookie(this);
        },
        switch2Change: function(e) {
            this.heart = e.target.value;
            util.setWarnCookie(this);
        },
        switch3Change: function(e) {
            this.breath = e.target.value;
            util.setWarnCookie(this);
        },
        switch4Change: function(e) {
            this.motion = e.target.value;
            util.setWarnCookie(this);
        },
        deviceTimesChange: function(e) {
            let value = e.target.value;
            if (value < 1 || value > 300) {
                value = 1;
                util.showToastBox(this, '请输入1-300的数字');
            }
            this.deviceTimes = value;
            util.setWarnCookie(this);
        },
        deviceStartChange: function(e) {
            this.deviceStart = e.target.value;
            util.setWarnCookie(this);
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!');
            }
        },
        deviceEndChange: function(e) {
            this.deviceEnd = e.target.value;
            util.setWarnCookie(this);
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!');
            }
        },
        heartDownChange: function(e) {
            let value = e.target.value;
            if (value < 1 || value > 180) {
                value = 1;
                util.showToastBox(this, '请输入1-180的数字');
            }
            this.heartDown = value;
            util.setWarnCookie(this);
        },
        heartUpChange: function(e) {
            let value = e.target.value;
            if (value < 1 || value > 180) {
                value = 1;
                util.showToastBox(this, '请输入1-180的数字');
            }
            this.heartUp = value;
            util.setWarnCookie(this);
        },
        breathDownChange: function(e) {
            let value = e.target.value;
            if (value < 1 || value > 180) {
                value = 1;
                util.showToastBox(this, '请输入1-180的数字');
            }
            this.breathDown = value;
            util.setWarnCookie(this);
        },
        breathUpChange: function(e) {
            let value = e.target.value;
            if (value < 1 || value > 180) {
                value = 1;
                util.showToastBox(this, '请输入1-180的数字');
            }
            this.breathUp = value;
            util.setWarnCookie(this);
        },
        motionTimesChange: function(e) {
            let value = e.target.value;
            if (value < 1 || value > 300) {
                value = 1;
                util.showToastBox(this, '请输入1-300的数字');
            }
            this.motionTimes = value;
            // util.warnRule.motionTimes = value;
            util.setWarnCookie(this);
        },
        motionEndChange: function(e) {
            this.motionEnd = e.target.value;
            util.setWarnCookie(this);
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!');
            }
        },
        motionStartChange: function(e) {
            this.motionStart = e.target.value;
            util.setWarnCookie(this);
            if (this.deviceStart > this.deviceEnd) {
                util.showToastBox(this, '开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!');
            }
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
    margin: 0 10upx 10upx;
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
</style>
