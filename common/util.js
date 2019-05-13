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
    let warnRuleCookie = JSON.parse(getCookie('warnRule'))
    if (!warnRuleCookie) {
        warnRuleCookie = warnRule
    }
    that.device = warnRuleCookie.device
    that.deviceTimes = warnRuleCookie.deviceTimes
    that.deviceStart = warnRuleCookie.deviceStart
    that.deviceEnd = warnRuleCookie.deviceEnd
    that.heart = warnRuleCookie.heart
    that.heartUp = warnRuleCookie.heartUp
    that.heartDown = warnRuleCookie.heartDown
    that.breath = warnRuleCookie.breath
    that.breathUp = warnRuleCookie.breathUp
    that.breathDown = warnRuleCookie.breathDown
    that.motion = warnRuleCookie.motion
    that.motionTimes = warnRuleCookie.motionTimes
    that.motionStart = warnRuleCookie.motionStart
    that.motionEnd = warnRuleCookie.motionEnd
    
    warnRule.device = warnRuleCookie.device
    warnRule.deviceTimes = warnRuleCookie.deviceTimes
    warnRule.deviceStart = warnRuleCookie.deviceStart
    warnRule.deviceEnd = warnRuleCookie.deviceEnd
    warnRule.heart = warnRuleCookie.heart
    warnRule.heartUp = warnRuleCookie.heartUp
    warnRule.heartDown = warnRuleCookie.heartDown
    warnRule.breath = warnRuleCookie.breath
    warnRule.breathUp = warnRuleCookie.breathUp
    warnRule.breathDown = warnRuleCookie.breathDown
    warnRule.motion = warnRuleCookie.motion
    warnRule.motionTimes = warnRuleCookie.motionTimes
    warnRule.motionStart = warnRuleCookie.motionStart
    warnRule.motionEnd = warnRuleCookie.motionEnd
}

/**
 * 设置报警规则缓存
 * @param {Object} that 作用域
 */
function setWarnCookie(that) {
    let warnRuleCookie = {
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
    setCookie('warnRule', JSON.stringify(warnRuleCookie))
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
 * 触发报警
 * @param {Object} that 作用域
 * @param {Object} backgroundAudioManager 背景音乐
 */
function audioStart(that, backgroundAudioManager) {
    that.warnNing = 1
    warnState.warnNing = 1
    backgroundAudioManager.title = '报警'
    backgroundAudioManager.epname = '报警'
    backgroundAudioManager.singer = '报警'
    backgroundAudioManager.coverImgUrl = ''
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = 'http://www.hanjiaxin.cn/images/warning.mp3';
    backgroundAudioManager.onEnded(() => {
        backgroundAudioManager.src = 'http://www.hanjiaxin.cn/images/warning.mp3?time=' + Date.parse(new Date());
    });
}

/**
 * 检验报警
 * @param {Object} that 作用域
 * @param {Object} res 数据
 */
function checkWarn(that, res, backgroundAudioManager) {

    checkDevice(that, res, backgroundAudioManager)
    checkHeart(that, res, backgroundAudioManager)
    checkBreath(that, res, backgroundAudioManager)
    checkMotion(that, res, backgroundAudioManager)

}

/**
 * 离床检测
 * @param {Object} that 作用域
 * @param {Object} res 数据
 */
function checkDevice(that, res, backgroundAudioManager) {
    // 如果正在报警，跳出检测
    if (warnState.warnNing == 1) return
    let warnRule = JSON.parse(getCookie('warnRule'))
    let nowTime = Date.parse(new Date())
    let nowTimeHour = new Date().getHours() + ':' + new Date().getMinutes()
    let deviceStatus = res.successData[0].deviceStatus
    let oldDeviceStatus = that.deviceStatus
    // 系统设置为不监控 跳出检测
    if (!warnRule.device) {
        // console.log('系统设置为不监控 跳出检测')
        warnState.warnDeviceTime = null
        return
    }
    // 系统设置时间有误，跳出检测
    if (warnRule.deviceStart > warnRule.deviceEnd) {
        // console.log('系统设置时间有误，跳出检测')
        warnState.warnDeviceTime = null
        return
    }
    // 如果没有离床报警记录点时间戳，跳出检测
    if (!warnState.warnDeviceTime) {
        // console.log('如果没有离床报警记录点时间戳，跳出检测')
        return
    }
    // 状态为4_在床，5_光纤故障，6_离线，9_传感器负荷，10_信号弱，则终止离床检测倒计时
    if (deviceStatus == 4 || deviceStatus == 5 || deviceStatus == 6 || deviceStatus == 9 || deviceStatus == 10) {
        // console.log('状态为4_在床，5_光纤故障，6_离线，9_传感器负荷，10_信号弱，则终止离床检测倒计时')
        warnState.warnDeviceTime = null
        return
    }
    // 不在报警时间段内，跳出检测
    if (warnRule.deviceStart > nowTimeHour || warnRule.deviceEnd < nowTimeHour) {
        // console.log('不在报警时间段内，跳出检测')
        warnState.warnDeviceTime = null
        return
    }
    console.log(nowTime - warnState.warnDeviceTime, '...离床监测..', warnRule.deviceTimes * 60 * 1000)
    // 记录时间点已超出系统设置离床时间上限，触发离床报警
    if ((nowTime - warnState.warnDeviceTime) > (warnRule.deviceTimes * 60 * 1000)) {
        // console.log('记录时间点已超出系统设置离床时间上限，触发离床报警')
        let t = new Date(warnState.warnDeviceTime)
        that.warningText = '用户于' + (t.getHours() < 10 ? '0' + t.getHours() : t.getHours()) + ':' + (t.getMinutes() < 10 ?
            '0' + t.getMinutes() : t.getMinutes()) + '离床，并已超过' + warnRule.deviceTimes + '分钟'
        that.warning = 1
        warnState.warnNing = 1
        warnState.warnNo = 0
        audioStart(that, backgroundAudioManager)
        warnState.warnDeviceTime = null
    }
}

/**
 * 心率检测
 * @param {Object} that 作用域
 * @param {Object} res 数据
 */
function checkHeart(that, res, backgroundAudioManager) {
    // console.log('心率检测!')
    // 如果正在报警，跳出检测
    if (warnState.warnNing == 1) return
    let warnRule = JSON.parse(getCookie('warnRule'))
    let nowTime = Date.parse(new Date())
    let nowTimeHour = new Date().getHours() + ':' + new Date().getMinutes()
    let deviceStatus = res.successData[0].deviceStatus
    // 如果不是在床状态，跳出检测
    if (deviceStatus != 4) {
        // console.log('如果不是在床状态，跳出检测')
        warnState.warnHeartTime = null
        return
    }
    // 系统设置为不监控 跳出检测
    if (!warnRule.heart) {
        // console.log('系统设置为不监控 跳出检测')
        warnState.warnHeartTime = null
        return
    }
    // 系统设置上下限规则有误，跳出检测
    if (warnRule.heartDown > warnRule.heartUp) {
        // console.log('系统设置上下限规则有误，跳出检测')
        warnState.warnHeartTime = null
        return
    }
    // 如果没有心率报警记录点时间戳，设置记录点并跳出检测
    if (!warnState.warnHeartTime) {
        // console.log('如果没有心率报警记录点时间戳，跳出检测')
        warnState.warnHeartTime = Date.parse(new Date())
        return
    }
    // 心率回归正常值，初始化数据，并跳出检测
    if (res.successData[0].heart <= warnRule.heartUp && res.successData[0].heart >= warnRule.heartDown) {
        // console.log('心率回归正常值，初始化数据，并跳出检测')
        warnState.warnHeartTime = null
        return
    }
    
    console.log(nowTime - warnState.warnHeartTime, '...心率监测(有异常)..')
    // 记录时间点已超出系统默认设置心率持续异常时间上限，触发离床报警
    if ((nowTime - warnState.warnHeartTime) > (30 * 1000)) {
        if (res.successData[0].heart > warnRule.heartUp) {
            // console.log('记录时间点已超出系统默认设置心率持续异常时间上限，触发心率报警')
            let t = new Date(warnState.warnHeartTime)
            that.warningText = '用户于' + nowTimeHour + '心率持续30秒高于您设置的上限峰值!'
            that.warning = 1
            warnState.warnNing = 1
            warnState.warnNo = 1
            audioStart(that, backgroundAudioManager)
            warnState.warnHeartTime = null
        } else {
            // console.log('记录时间点已超出系统默认设置心率持续异常时间上限，触发心率报警')
            let t = new Date(warnState.warnHeartTime)
            that.warningText = '用户于' + nowTimeHour + '心率持续30秒低于您设置的下限峰值!'
            that.warning = 1
            warnState.warnNing = 1
            warnState.warnNo = 1
            audioStart(that, backgroundAudioManager)
            warnState.warnHeartTime = null
        }
    }
}

/**
 * 呼吸率检测
 * @param {Object} that 作用域
 * @param {Object} res 数据
 */
function checkBreath(that, res, backgroundAudioManager) {
    // console.log('呼吸检测!')
    // 如果正在报警，跳出检测
    if (warnState.warnNing == 1) return
    let warnRule = JSON.parse(getCookie('warnRule'))
    let nowTime = Date.parse(new Date())
    let nowTimeHour = new Date().getHours() + ':' + new Date().getMinutes()
    let deviceStatus = res.successData[0].deviceStatus
    // 如果不是在床状态，跳出检测
    if (deviceStatus != 4) {
        // console.log('如果不是在床状态，跳出检测')
        warnState.warnBreathTime = null
        return
    }
    // 系统设置为不监控 跳出检测
    if (!warnRule.breath) {
        // console.log('系统设置为不监控 跳出检测')
        warnState.warnBreathTime = null
        return
    }
    // 系统设置上下限规则有误，跳出检测
    if (warnRule.breathDown * 1 > warnRule.breathUp * 1) {
        // console.log('系统设置上下限规则有误，跳出检测')
        warnState.warnBreathTime = null
        return
    }
    // 如果没有呼吸率报警记录点时间戳，设置记录点并跳出检测
    if (!warnState.warnBreathTime) {
        // console.log('如果没有呼吸率报警记录点时间戳，设置记录点并跳出检测')
        warnState.warnBreathTime = Date.parse(new Date())
        return
    }
    // 呼吸率回归正常值，初始化数据，并跳出检测
    if (res.successData[0].breath * 1 <= warnRule.breathUp * 1 && res.successData[0].breath * 1 >= warnRule.breathDown * 1) {
        // console.log('呼吸率回归正常值，初始化数据，并跳出检测')
        warnState.warnBreathTime = null
        return
    }
    
    console.log(nowTime - warnState.warnBreathTime, '...呼吸监测(有异常)..')
    
    // 记录时间点已超出系统默认设置呼吸率持续异常时间上限，触发呼吸报警
    if ((nowTime - warnState.warnBreathTime) > (30 * 1000)) {
        if (res.successData[0].breath > warnRule.breathUp) {
            // console.log('记录时间点已超出系统默认设置呼吸率持续异常时间上限，触发呼吸率报警')
            let t = new Date(warnState.warnBreathTime)
            that.warningText = '用户于' + (t.getHours() < 10 ? '0' + t.getHours() : t.getHours()) + ':' + (t.getMinutes() <
                10 ? '0' + t.getMinutes() : t.getMinutes()) + '呼吸率持续30秒高于您设置的上限峰值!'
            that.warning = 1
            warnState.warnNing = 1
            warnState.warnNo = 1
            audioStart(that, backgroundAudioManager)
            warnState.warnBreathTime = null
        } else {
            // console.log('记录时间点已超出系统默认设置呼吸率持续异常时间上限，触发呼吸率报警')
            let t = new Date(warnState.warnBreathTime)
            that.warningText = '用户于' + nowTimeHour + '呼吸率持续30秒低于您设置的下限峰值!'
            that.warning = 1
            warnState.warnNing = 1
            warnState.warnNo = 1
            audioStart(that, backgroundAudioManager)
            warnState.warnBreathTime = null
        }
    }
}

/**
 * 体动检测
 * @param {Object} that 作用域
 * @param {Object} res 数据
 */
function checkMotion(that, res, backgroundAudioManager) {
    // console.log('时时体动数据 = ' + res.successData[0].motion)
    // 如果正在报警，跳出检测
    if (warnState.warnNing == 1) return
    let warnRule = JSON.parse(getCookie('warnRule'))
    let nowTime = Date.parse(new Date())
    let nowTimeHour = new Date().getHours() + ':' + new Date().getMinutes()
    let deviceStatus = res.successData[0].deviceStatus
    // 如果不是在床状态，跳出检测
    if (deviceStatus != 4) {
        // console.log('如果不是在床状态，跳出检测')
        warnState.warnBreathTime = null
        return
    }
    // 系统设置为不监控 跳出检测
    if (!warnRule.motion) {
        // console.log('系统设置为不监控 跳出检测')
        warnState.warnMotionTime = null
        return
    }
    // 系统设置时间有误，跳出检测
    if (warnRule.motionStart > warnRule.motionEnd) {
        // console.log('系统设置时间有误，跳出检测')
        warnState.warnMotionTime = null
        return
    }
    // 如果没有体动报警记录点时间戳，跳出检测
    if (!warnState.warnMotionTime) {
        warnState.warnMotionTime = Date.parse(new Date())
        return
    }
    // 不在报警时间段内，跳出检测
    if (warnRule.motionStart > nowTimeHour || warnRule.motionEnd < nowTimeHour) {
        // console.log('不在报警时间段内，跳出检测')
        warnState.warnMotionTime = null
        return
    }
    // 体动值回复正常数据，初始化数据并跳出检测
    if (res.successData[0].motion < 4) {
        // console.log('体动值回复正常数据，初始化数据并跳出检测')
        warnState.warnMotionTime = null
        return
    }
    console.log(nowTime - warnState.warnMotionTime, '...体动监测..', warnRule.motionTimes * 60 * 1000)
    // 记录时间点已超出系统设置体动时间上限，触发体动报警
    if ((nowTime - warnState.warnMotionTime) > (warnRule.motionTimes * 60 * 1000)) {
        // console.log('记录时间点已超出系统设置体动时间上限，触发体动报警')
        let t = new Date(warnState.warnMotionTime)
        that.warningText = '用户于' + (t.getHours() < 10 ? '0' + t.getHours() : t.getHours()) + ':' + (t.getMinutes() < 10 ?
            '0' + t.getMinutes() : t.getMinutes()) + '开始体动频繁，并已超过' + warnRule.motionTimes + '分钟！'
        that.warning = 1
        warnState.warnNing = 1
        warnState.warnNo = 0
        audioStart(that, backgroundAudioManager)
        warnState.warnMotionTime = null
    }
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
    showToastBox,
    checkWarn
}
