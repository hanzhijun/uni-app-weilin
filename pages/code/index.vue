<template>
    <view class="login-outside">
        <view class="login-line" style="padding-top: 100upx;">
            <view class="section-title">编码：</view>
            <input class="section-input" type="text" placeholder="输入设备编码" @input="bindCodeInput" v-model="inputCode" />
            <image class="section-code" src="/static/code.png" @click="bindScanCode"></image>
        </view>

        <view class="text-note">手动输入或扫描设备二维码获取编码</view>

        <view class="section-center"><button class="section-post" @click="toConfirm">确定添加</button></view>

        <!--toast提示弹窗-->
        <view class="show-toast" v-if="showToast == 1">
            <text>{{ toastTxt }}</text>
        </view>
    </view>
</template>

<script>
var util = require('../../common/util.js');
var setCookie = util.setCookie;
var getCookie = util.getCookie;
var setStorage = util.setStorage;
var getStorage = util.getStorage;
var myAjax = util.myAjax;
var myAjax2 = util.myAjax2;

export default {
    data() {
        return {
            title: '添加设备',
            showToast: 0,
            toastTxt: '',
            userInfo: '',
            inputValue: '',
            inputPassWords: '',
            inputCode: ''
        };
    },
    onLoad() {
        // var timestamp = Date.parse(new Date())
        // console.log(timestamp)
    },
    onLaunch: function() {
        console.log('App Launch-login');
    },
    onShow: function() {
        console.log('App Show-login');
    },
    onHide: function() {
        console.log('App Hide-login');
    },
    methods: {
        bindScanCode() {
            // 只允许通过相机扫码
            let _this = this;
            uni.scanCode({
                onlyFromCamera: true,
                success: function(res) {
                    console.log('条码类型：' + res.scanType);
                    console.log('条码内容：' + res.result);
                    _this.inputCode = res.result;
                }
            });
        },
        bindCodeInput(event) {
            this.inputCode = event.target.value;
        },
        /**
         * 08. 获取设备的信息
         */
        toConfirm() {
            let _this = this;
            let deviceNos = this.inputCode;
            if (isNaN(deviceNos)) {
                util.showToastBox(_this, '设备编码校验有误，请重新输入！');
                return;
            } else if ((deviceNos + '').length != 12) {
                util.showToastBox(_this, '设备编码校验有误，请重新输入！');
                return;
            }
            let obj = {
                deviceNos: _this.inputCode
            };
            myAjax2(
                'post',
                '/device/physiology/actual',
                obj,
                function(res) {
                    if (res.retCode == '10000' && res.successData != '') {
                        setCookie('deviceNos', _this.inputCode);
                        util.showToastBox(_this, '设备添加成功，即将跳转！');
                        setTimeout(function() {
                            uni.redirectTo({
                                url: '../detail/index'
                            });
                        }, 3000);
                    } else {
                        util.showToastBox(_this, '设备编码校验有误，请重新输入或与管理员联系解决！');
                    }
                    console.log(JSON.stringify(res));
                },
                function(reg) {
                    console.log(JSON.stringify(reg));
                }
            );
        }
    }
};
</script>

<style>
.login-line {
    overflow: hidden;
    padding: 20upx 0;
}

.section-title {
    display: inline-block;
    width: 200upx;
    line-height: 68upx;
    float: left;
    font-size: 14px;
    text-align: right;
}

.text-note {
    text-align: center;
    font-size: 22upx;
    color: #999;
}

.section-input {
    display: inline-block;
    width: 300upx;
    height: 66upx;
    line-height: 66upx;
    border: 1px solid #0099e9;
    border-radius: 3px;
    float: left;
    font-size: 14px;
    padding-left: 20upx;
}

.section-code {
    width: 66upx;
    height: 66upx;
    float: left;
    margin-left: 30upx;
}

.section-center {
    text-align: center;
    padding-top: 350upx;
}

.section-post {
    display: inline-block;
    width: 500upx;
    font-size: 16px;
    background-color: #0099e9;
    color: #fff;
    margin: 0 auto;
}

.section-post:active {
    background-color: #0082c5;
}
</style>
