<template>
    <view class="login-outside">
        <view class="login-line login-line-first">
            <view class="section-title">用户名：</view>
            <input class="section-input" type="text" placeholder="输入用户名" @input="bindKeyInput" v-model="inputValue" />
        </view>

        <view class="login-line">
            <view class="section-title">密 码：</view>
            <input class="section-input" type="password" placeholder="输入密码" @input="bindPassInput" v-model="inputPassWords" />
        </view>

        <view class="section-center"><button class="section-post" @click="toLogin">登录</button></view>

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
var util = require('../../common/util.js')
var setCookie = util.setCookie
var getCookie = util.getCookie
var myAjax = util.myAjax
export default {
    data() {
        return {
            title: '登录',
            
            showToast: 0,
            toastTxt: '',
            loading: 0,
            
            userInfo: null,
            inputValue: '',
            inputPassWords: ''
        }
    },
    onLoad() {},
    onLaunch() {},
    onShow() {
        console.log('onShow')
    },
    onHide() {},
    methods: {
        bindKeyInput(event) {
            this.inputValue = event.target.value
        },
        bindPassInput(event) {
            this.inputPassWords = event.target.value
        },
        /**
         * 02. 用户名密码登录
         */
        toLogin() {
            let _this = this
            let { inputValue, inputPassWords } = _this
            if (!inputValue || !inputPassWords) {
                util.showToastBox(_this, '请输入用户名、密码!')
                return false
            }
            let obj = {
                username: inputValue,
                password: inputPassWords
            }
            _this.loading = 1
            myAjax(
                'post',
                '/user/authorize',
                obj,
                function(res) {
                    let deviceNos = getCookie('deviceNos')
                    if (res.retCode == '10000') {
                        _this.userInfo = res.successData
                        _this.loading = 0
                        setCookie('accessToken', res.successData.accessToken)
                        setCookie('username', res.successData.username)
                        if (!deviceNos) {
                            uni.redirectTo({
                                url: '../code/index'
                            })
                        } else {
                            uni.redirectTo({
                                url: '../detail/index'
                            })
                        }
                    } else if (res.retCode == '10007') {
                        util.showToastBox(_this, '用户名或密码错误!')
                        _this.loading = 0
                    } else if (res.retCode == '10008') {
                        util.showToastBox(_this, 'token已过期，请重新登录!')
                        _this.loading = 0
                    } else {
                        util.showToastBox(_this, '未知错误，请重新登录!')
                        _this.loading = 0
                    }
                    // console.log(JSON.stringify(res))
                },
                function(reg) {
                    // console.log(JSON.stringify(reg))
                }
            )
        }
    }
}
</script>

<style>
.login-line {
    overflow: hidden;
    padding: 20upx 0;
}

.login-line-first {
    padding-top: 100upx;
}

.section-title {
    display: inline-block;
    width: 200upx;
    line-height: 68upx;
    float: left;
    font-size: 14px;
    text-align: right;
}

.section-input {
    display: inline-block;
    width: 400upx;
    height: 66upx;
    line-height: 66upx;
    border: 1px solid #0099e9;
    border-radius: 3px;
    float: left;
    font-size: 14px;
    padding-left: 20upx;
}

.section-center {
    text-align: center;
    padding-top: 50upx;
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
