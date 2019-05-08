<template>

    <view class="index_outside">

        <view class="xin-outbar">

            <image class="bj-img" src="http://www.hanjiaxin.cn/images/bj-xin-off.png"></image>
            <image class="bj-img" src="http://www.hanjiaxin.cn/images/bj-xin-on.png" v-if="deviceStatus == 4"></image>
            <view class="bpm">BPM</view>
            <view class="text-xintiao">
                <text v-if="heart == 65436">--</text>
                <text v-if="heart != 65436">{{ heart }}</text>
            </view>
            <image class="icon-xin" src="http://www.hanjiaxin.cn/images/icon-xintiao.png"></image>
            <view class="text-huxi">
                <text v-if="breath == -100">--</text>
                <text v-if="breath != -100">{{ breath }}</text>
            </view>
            <image class="icon-huxi" src="http://www.hanjiaxin.cn/images/icon-huxi.png"></image>
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
                <image class="bj-img" src="http://www.hanjiaxin.cn/images/tubiao.png"></image><text>历史数据</text>
            </view>
            <view class="btn-k" @click="linkSetting">
                <image class="bj-img" src="http://www.hanjiaxin.cn/images/chilun.png"></image><text>守护设置</text>
            </view>
        </view>

        <!--报警弹窗-->
        <view class="base-box warn-box" v-if="warning=='1'" catchtouchmove="true">
            <view class="gray-back"></view>
            <view class="box-content">
                <text class="txt">{{ warningText }}</text>
                <view class="img">
                    <image src="http://www.hanjiaxin.cn/images/warning.png"></image>
                </view>
                <view>
                    <button @click="audioPause">已知晓!</button>
                </view>
            </view>
        </view>

    </view>

</template>

<script>
    var util = require('../../common/util.js')
    var getCookie = util.getCookie
    var setCookie = util.setCookie
    var setStorage = util.setStorage
    var getStorage = util.getStorage
    var myAjax = util.myAjax
    var myAjax2 = util.myAjax2
    var backgroundAudioManager = wx.getBackgroundAudioManager()
    export default {
        data() {
            return {
                title: '微麟守护者',
                userInfo: null,
                deviceNos: '641743000773', // 设备号
                accessToken: null,
                breath: '--', // 呼吸值 -100_无效值，其他为正常值
                deviceStatus: null, // 设备状态 3_离床，4_在床，5_光纤故障，6_离线，9_传感器负荷，10_信号弱
                heart: '--', // 心率值 65436_无效值，其他为正常值
                markTime: null, // 发生的时间戳
                motion: null, // 体动值 0_正常，3_轻微体动，4_中度体动，5_大幅体动，-100_无效值
                timer: null,
                toast: 0,
                toastTxt: '',
                loading: 0,
                warning: 0,
                warningText: '',
                leaveTime: null
            }
        },
        onLoad() {

        },
        onLaunch: function() {
            console.log('App Launch-detail')
        },
        onShow: function() {
            let accessToken = getCookie('accessToken')
            let userInfo = getCookie('username')
            if (!accessToken) {
                uni.redirectTo({
                    url: '../login/index'
                })
            } else {
                this.userInfo = userInfo
                this.accessToken = accessToken
                this.getActual()
                this.setSocketTask()
                let _this = this
                this.timer = setInterval(function() {
                    _this.getActual()
                }, 10000)

            }
        },
        onHide: function() {
            console.log('App Hide-detail')
        },
        methods: {
            /**
             * 03. 获取设备当前的状态/⼼率/呼吸/体动数据
             */
            getActual() {
                let obj = {
                    deviceNos: this.deviceNos
                }
                let _this = this;
                myAjax2('post', '/device/physiology/actual', obj, function(res) {
                    if (res.retCode == '10000') {
                        if (res.successData[0].deviceStatus == 3 && _this.leaveTime) {
                            let time = Date.parse(new Date())
                            if (time - _this.leaveTime > 12000 && _this.warning == 0) {
                                console.log(time - _this.leaveTime)
                                _this.warningText = '离床报警已触发'
                                _this.warning = 1
                                // _this.audioCtx = uni.createAudioContext('myAudio')
                                // _this.audioCtx.setSrc('http://www.hanjiaxin.cn/images/warning.mp3')
                                // _this.audioCtx.play()
                                backgroundAudioManager.title = '报警'
                                backgroundAudioManager.epname = '报警'
                                backgroundAudioManager.singer = '报警'
                                backgroundAudioManager.coverImgUrl = ''
                                // 设置了 src 之后会自动播放
                                backgroundAudioManager.src = 'http://www.hanjiaxin.cn/images/warning.mp3'
                                backgroundAudioManager.onEnded(() => {
                                    backgroundAudioManager.src = 'http://www.hanjiaxin.cn/images/warning.mp3?time=' + Date.parse(new Date())
                                })
                            }
                        }
                        _this.breath = res.successData[0].breath
                        _this.deviceStatus = res.successData[0].deviceStatus
                        _this.heart = res.successData[0].heart
                        _this.markTime = res.successData[0].markTime
                        _this.motion = res.successData[0].motion
                    } else {
                        console.log('未知错误，请重新登录')
                        setCookie('accessToken', '')
                        setCookie('username', '')
                        uni.redirectTo({
                            url: '../login/index'
                        })

                    }
                }, function(reg) {
                    console.log(JSON.stringify(reg))
                })
            },
            /**
             * 关闭报警
             */
            audioPause: function() {
                // this.audioCtx.pause()
                backgroundAudioManager.pause()
                this.leaveTime = null,
                    this.warning = 0

            },
            linkRecord: function() {
                uni.navigateTo({
                    url: '../record/index'
                })
            },
            linkSetting: function() {
                uni.navigateTo({
                    url: '../setting/index'
                })
            },
            setSocketTask() {
                let accessToken = util.getCookie('accessToken')
                let deviceNo = this.deviceNos
                let _this = this
                // 建立连接
                console.log('建立连接!');
                wx.connectSocket({
                    url: "ws://stream.darma.cn:17004/ws",
                    sluccess() {
                        console.log('连接成功...')
                    },
                    fail() {
                        console.log('连接失败...')
                    }
                });
                // 连接成功
                wx.onSocketOpen(function() {
                    console.log('连接成功!')
                    let obj = {
                        // 消息类型msgType⽬前有 login（登录消息），deviceStatus（设备状态消息）healthData（⼼率呼吸数据消息），paramError（参数错误消息）
                        msgType: 'login',
                        data: {
                            token: accessToken,
                            // 订阅类型subType有“ALL”,“SINGLETON”(区分⼤⼩写)
                            // subType: 'SINGLETON', /*订阅所有的设备*/
                            deviceNo: _this.deviceNos
                        }
                    };
                    wx.sendSocketMessage({
                        data: JSON.stringify(obj)
                    })
                });
                // 接收数据
                wx.onSocketMessage(function(data) {
                    // heartBreathBcg、healthBreathData、deviceStatus
                    if (JSON.parse(data.data).msgType == 'healthBreathData' || JSON.parse(data.data).msgType ==
                        'deviceStatus') {
                        console.log(data.data)
                        // uni.showToast({
                        //     title: data.data,
                        //     duration: 1000
                        // })
                    }
                    // 当状态发生变化会初始化时，会推送此条数据
                    if (JSON.parse(data.data).msgType == 'deviceStatus') {
                        if (JSON.parse(data.data).data.deviceStatus == '3') {
                            console.log('离床已记录，以此时间为基准开始计算报警数据')
                            _this.leaveTime = Date.parse(new Date())
                        } else {
                            _this.leaveTime = null
                            console.log('解除离床报警计算数据')
                        }
                    }

                });
                //连接失败
                wx.onSocketError(function() {
                    console.log('websocket连接失败！')
                })
            }
        }
    }
</script>

<style>
    view {
        display: block;
        text-align: center;
    }

    .xin-outbar {
        width: 440rpx;
        height: 440rpx;
        margin: 120rpx auto 0;
        position: relative;
    }

    .xin-outbar .bj-img {
        width: 440rpx;
        height: 440rpx;
        position: absolute;
        left: 0;
        top: 0;
    }

    .xin-outbar .bpm {
        width: 440rpx;
        line-height: 44rpx;
        font-size: 26rpx;
        color: #fff;
        text-align: center;
        position: absolute;
        left: 0;
        top: 80rpx;
        z-index: 2;
    }

    .xin-outbar .text-xintiao {
        width: 220rpx;
        height: 60rpx;
        font-size: 54rpx;
        color: #fff;
        text-align: right;
        position: absolute;
        left: 0;
        top: 118rpx;
        z-index: 2;
    }

    .xin-outbar .icon-xin {
        width: 36rpx;
        height: 36rpx;
        position: absolute;
        left: 236rpx;
        top: 135rpx;
        z-index: 2;
    }

    .xin-outbar .text-huxi {
        width: 220rpx;
        height: 60rpx;
        font-size: 54rpx;
        color: #fff;
        text-align: right;
        position: absolute;
        left: 0;
        top: 249rpx;
        z-index: 2;
    }

    .xin-outbar .icon-huxi {
        width: 36rpx;
        height: 36rpx;
        position: absolute;
        left: 236rpx;
        top: 264rpx;
        z-index: 2;
    }

    .xin-outbar .ci {
        width: 440rpx;
        line-height: 44rpx;
        font-size: 26rpx;
        color: #fff;
        text-align: center;
        position: absolute;
        left: 0;
        top: 315rpx;
        z-index: 2;
    }

    .bed-outbar .bed-state {
        font-size: 30rpx;
        color: #0099e9;
        padding: 50rpx 0 40rpx;
        overflow: hidden;
    }

    .bed-outbar image {
        width: 400rpx;
        height: 278rpx;
    }

    .btn-bar {
        width: 750rpx;
        height: 120rpx;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 2;
    }

    .btn-bar .btn-k {
        width: 300rpx;
        height: 80rpx;
        border-radius: 80rpx;
        background-color: #0099e9;
        float: left;
        margin-left: 50rpx;
        overflow: hidden;
    }

    .btn-bar .btn-k:active {
        opacity: .7;
    }

    .btn-bar .btn-k image {
        width: 40rpx;
        height: 40rpx;
        float: left;
        margin: 20rpx 20rpx 0 56rpx;
    }

    .btn-bar .btn-k text {
        line-height: 40rpx;
        display: inline-block;
        font-size: 32rpx;
        color: #ffdc9e;
        float: left;
        margin-top: 20rpx;
    }

    .base-box {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 101;
    }

    .base-box .gray-back {
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: .4;
        position: absolute;
        left: 0;
        top: 0
    }

    .loading-box .gray-back {
        background-color: #fff;
        opacity: 0;
    }

    .loading-box .box-content {
        width: 120px;
        height: 120px;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        left: calc(50vw - 60px);
        top: calc(50vh - 60px);
        border-radius: 5px;
    }

    .loading-box .box-content .img {
        text-align: center;
        padding: 30px 0 20px;
    }

    .loading-box .box-content .img image {
        width: 30px;
        height: 30px;
    }

    .loading-box .box-content .txt {
        text-align: center;
        font-size: 12px;
        color: #f0f0f0;
    }

    .warn-box .box-content {
        width: 500rpx;
        background: rgba(0, 153, 233, 1);
        position: absolute;
        left: calc(50vw - 250rpx);
        top: calc(50vh - 350rpx);
        border-radius: 20rpx;
        padding-bottom: 60rpx;
    }

    .warn-box .box-content .img {
        text-align: center;
        padding: 30px 0 20px;
    }

    .warn-box .box-content .img image {
        width: 250rpx;
        height: 250rpx;
    }

    .warn-box .box-content .txt {
        display: block;
        text-align: center;
        font-size: 30rpx;
        color: #f0f0f0;
        padding: 30rpx 20rpx 0;
        overflow: hidden;
    }

    .warn-box .box-content button {
        width: 360rpx;
        height: 70rpx;
        line-height: 70rpx;
        margin: 0 auto;
        border-radius: 45rpx;
        background-color: #dce400;
        color: #fff;
        font-size: 30rpx;
    }
</style>
