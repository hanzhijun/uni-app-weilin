<template>

    <view class="login-outside">
        <view class="login-line" style="padding-top: 100upx">
            <view class="section-title">用户名：</view>
            <input class="section-input" type="text" placeholder="输入用户名" @input="bindKeyInput" v-model="inputValue"></input>
        </view>

        <view class="login-line">
            <view class="section-title">密　码：</view>
            <input class="section-input" type="password" placeholder="输入密码" @input="bindPassInput" v-model="inputPassWords"></input>
        </view>

        <view class="section-center">
            <button class="section-post" @click="toLogin">登录</button>
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
    var setStorage = util.setStorage
    var getStorage = util.getStorage
    var myAjax = util.myAjax
    export default {
        data() {
            return {
                title: '登录',
                showToast: 0,
                toastTxt: '',
                userInfo: null,
                inputValue: '',
                inputPassWords: ''
            }
        },
        onLoad() {
            // var timestamp = Date.parse(new Date())
            // console.log(timestamp)
        },
        onLaunch: function() {
            console.log('App Launch-login')
        },
        onShow: function() {
            console.log('App Show-login')
        },
        onHide: function() {
            console.log('App Hide-login')
        },
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
                let {
                    inputValue,
                    inputPassWords
                } = _this
                if (!inputValue || !inputPassWords) {
                    util.showToastBox(_this, '请输入用户名、密码!');
                    return false
                }
                let obj = {
                    username: inputValue,
                    password: inputPassWords
                }

                myAjax('post', '/user/authorize', obj, function(res) {
                    let deviceNos = getCookie('deviceNos');
                    if (res.retCode == '10000') {
                        _this.userInfo = res.successData
                        setCookie('accessToken', res.successData.accessToken)
                        setCookie('username', res.successData.username)
                        if (!deviceNos) {
                            uni.redirectTo({
                                url: '../code/index'
                            });
                        } else {
                            uni.redirectTo({
                                url: '../detail/index'
                            })
                        }
                    } else if (res.retCode == '10007') {
                        util.showToastBox(_this, '用户名或密码错误!');
                    } else if (res.retCode == '10008') {
                        util.showToastBox(_this, 'token已过期，请重新登录!');
                    } else {
                        util.showToastBox(_this, '未知错误，请重新登录!');
                    }
                    console.log(JSON.stringify(res))
                }, function(reg) {
                    console.log(JSON.stringify(reg))
                })
            }
        }
    }
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
