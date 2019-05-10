<template>
    <view class="detail_outside">
        <view class="logo"><image src="/static/logo-1024-02.png" @click="linkToLogin"></image></view>

        <ul class="text">
            <li>智慧产品，24小时智慧科技保姆;</li>
            <li>不穿不戴，老幼全方位智慧照护;</li>
            <li>智慧创新科技，优雅健康生活。</li>
            <li>{{ show }}</li>
        </ul>

        <view class="text-b">技术支持：成都市微麟科技有限责任公司</view>
    </view>
</template>

<script>
var util = require('../../common/util.js');
var getCookie = util.getCookie;
var setCookie = util.setCookie;

export default {
    data() {
        return {
            title: '微麟守护者'
        };
    },
    onLoad() {
        let accessToken = getCookie('accessToken');
        let deviceNos = getCookie('deviceNos');
        let warnRule = getCookie('warnRule');
        if (!warnRule) {
            warnRule = util.warnRule;
            setCookie('warnRule', JSON.stringify(warnRule));
        }
        this.show = accessToken;
        setTimeout(function() {
            if (!accessToken) {
                uni.redirectTo({
                    url: '../login/index'
                });
            } else if (!deviceNos) {
                uni.redirectTo({
                    url: '../code/index'
                });
            } else {
                uni.redirectTo({
                    url: '../detail/index'
                });
            }
        }, 5000);
    },
    onLaunch() {},
    onShow() {},
    onHide() {},
    methods: {
        linkToLogin() {
            uni.redirectTo({
                url: '../login/index'
            });
        }
    }
};
</script>

<style>
.detail_outside .logo {
    text-align: center;
    padding: 150upx 0 0 0;
}

.detail_outside image {
    width: 120upx;
    height: 120upx;
    margin: 0 auto;
    border-radius: 30upx;
}

.detail_outside ul,
.detail_outside li {
    display: block;
    font-size: 24upx;
    line-height: 40upx;
    text-align: center;
}

.detail_outside ul {
    padding: 460upx 0 0 0;
}

.text-b {
    display: block;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 15upx;
    font-size: 18upx;
    color: #999;
    text-align: center;
}
</style>
