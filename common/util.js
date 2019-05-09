var baseHost = 'https://api.darma.cn/mattress'
var imgUrl = 'http://www.hanjiaxin.cn/images/'
// var deviceNos = '641743000773'

/**
 * 报警规则初始化值
 */
var warnRule = {
    device: false, // 是否监控离床
    deviceTimes: '10', // 离床持续时间
    deviceStart: '00:00', // 监控时段开始
    deviceEnd: '23:59', // 监控时段结束
    heart: false, // 是否监控心率
    heartUp: '120', // 心率过快峰值
    heartDown: '40', // 心率过慢峰值
    breath: false, // 是否监控呼吸率
    breathUp: '30', // 呼吸过快峰值
    breathDown: '8', // 呼吸过慢峰值
    motion: false, // 是否监控体动值
    motionTimes: '5', // 大幅体动持续时间
    motionStart: '0:00', // 体动监控时段开始
    motionEnd: '23:59' // 体动监控时段结束
}

/**
 * 报警状态记录
 */
var warnState = {
    warnNing: 0, // 是否正在报警
    warnNo: null, // 报警类型 0离床、1心率、2呼吸率、3体动
    warnDeviceTime: null, // 离床报警记录点时间戳
    warnHeartTime: null, // 心率报警记录点时间戳
    warnBreathTime: null, // 心率报警记录点时间戳
    warnMotionTime: null, // 心率报警记录点时间戳
    warningText: '' // 报警提示语
}

/**
 * 设置添加本地local storage缓存
 * @param key
 * @param value
 */
function setCookie(key, value) {
    uni.setStorageSync(key, value)
}

/**
 * 获取local storage缓存
 * @param key
 * @returns {*}
 */
function getCookie(key) {
    return uni.getStorageSync(key)
}

/**
 * 公共异步 一级接口 (不需登录)
 * @param type 类型： post,get,put,delete
 * @param url 接口地址
 * @param data 参数
 * @param res 成功
 * @param reg 失败
 */
function myAjax(type, url, data, res, reg) {
    uni.request({
        url: baseHost + url,
        data,
        header: {
            'content-type': 'application/json'
        },
        method: type,
        success(data) {
            res && res(data.data)
        },
        fail(data) {
            reg && reg(data.data)
        }
    })
}

/**
 * 公共异步 二级接口 (需登录)
 * @param type 类型： post,get,put,delete
 * @param url 接口地址
 * @param data 参数
 * @param res 成功
 * @param reg 失败
 */
function myAjax2(type, url, data, res, reg) {
    let accessToken = getCookie('accessToken')
    if (!accessToken) {
        uni.redirectTo({
            url: '../login/index'
        })
    }
    uni.request({
        url: baseHost + url,
        data,
        header: {
            'content-type': 'application/json',
            'accessToken': accessToken
        },
        method: type,
        success(data) {
            res && res(data.data)
        },
        fail(data) {
            reg && reg(data.data)
        }
    })
}

/**
 * 获取报警规则缓存
 * @param {Object} that 作用域
 */
function getWarnCookie(that) {
    let warnRule = JSON.parse(getCookie('warnRule'))
    that.device = warnRule.device
    that.deviceTimes = warnRule.deviceTimes
    that.deviceStart = warnRule.deviceStart
    that.deviceEnd = warnRule.deviceEnd
    that.heart = warnRule.heart
    that.heartUp = warnRule.heartUp
    that.heartDown = warnRule.heartDown
    that.breath = warnRule.breath
    that.breathUp = warnRule.breathUp
    that.breathDown = warnRule.breathDown
    that.motion = warnRule.motion
    that.motionTimes = warnRule.motionTimes
    that.motionStart = warnRule.motionStart
    that.motionEnd = warnRule.motionEnd
}

/**
 * 设置报警规则缓存
 * @param {Object} that 作用域
 */
function setWarnCookie(that) {
    let warnRule = {
        device: that.device,
        deviceTimes: that.deviceTimes,
        deviceStart: that.deviceStart,
        deviceEnd: that.deviceEnd,
        heart: that.heart,
        heartUp: that.heartUp,
        heartDown: that.heartDown,
        breath: that.breath,
        breathUp: that.breathUp,
        breathDown: that.breathDown,
        motion: that.motion,
        motionTimes: that.motionTimes,
        motionStart: that.motionStart,
        motionEnd: that.motionEnd
    }
    setCookie('warnRule', JSON.stringify(warnRule))
}

/**
 * 关闭报警
 * @param {Object} that 作用域
 * @param {Object} backgroundAudioManager 背景音乐
 */
function audioPause(that, backgroundAudioManager) {
    backgroundAudioManager.pause()
    warnState.warnNing = 0
    if (warnState.warnNo == 0) {
        warnState.warnDeviceTime = null
    } else if (warnState.warnNo == 1) {
        warnState.warnHeartTime = null
    } else if (warnState.warnNo == 2) {
        warnState.warnBreathTime = null
    } else if (warnState.warnNo == 3) {
        warnState.warnMotionTime = null
    }
    warnState.warningText = ''
    warnState.warnNo = null
    changeWarn(that)
}

/**
 * 同步报警状态值
 * @param {Object} that 作用域
 */
function changeWarn(that) {
    that.warnNing = warnState.warnNing
    that.warnNo = warnState.warnNo
    that.warnDeviceTime = warnState.warnDeviceTime
    that.warnHeartTime = warnState.warnHeartTime
    that.warnBreathTime = warnState.warnBreathTime
    that.warnMotionTime = warnState.warnMotionTime
    that.warningText = warnState.warningText
}

/**
 * toast提示弹窗
 * @param {Object} that 作用域
 * @param {Object} text 提示文字
 */
function showToastBox(that, text) {
    that.toastTxt = text
    that.showToast = 1
    setTimeout(function() {
        that.toastTxt = ''
        that.showToast = 0
    }, 3000)
}

module.exports = {
    baseHost,
    imgUrl,
    warnRule,
    warnState,
    setCookie,
    getCookie,
    myAjax,
    myAjax2,
    getWarnCookie,
    setWarnCookie,
    audioPause,
    changeWarn,
    showToastBox
}
