let baseHost = 'https://api.darma.cn/mattress'
let imgUrl = 'http://www.hanjiaxin.cn/images/'
let backgroundAudioManager = wx.getBackgroundAudioManager()
backgroundAudioManager.title = '报警'
backgroundAudioManager.epname = '报警'
backgroundAudioManager.singer = '报警'
backgroundAudioManager.coverImgUrl = ''

// var deviceNos = '641743000773'

/**
 * 报警规则数据值
 */
let warnRuleData = {
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
 * 报警状态数据值
 */
let warnStateData = {
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
    let warnRuleCookie
    if (!warnRuleCookie) {
        warnRuleCookie = warnRuleData
    } else {
        warnRuleCookie = JSON.parse(getCookie('warnRule'))
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
    
    warnRuleData.device = warnRuleCookie.device
    warnRuleData.deviceTimes = warnRuleCookie.deviceTimes
    warnRuleData.deviceStart = warnRuleCookie.deviceStart
    warnRuleData.deviceEnd = warnRuleCookie.deviceEnd
    warnRuleData.heart = warnRuleCookie.heart
    warnRuleData.heartUp = warnRuleCookie.heartUp
    warnRuleData.heartDown = warnRuleCookie.heartDown
    warnRuleData.breath = warnRuleCookie.breath
    warnRuleData.breathUp = warnRuleCookie.breathUp
    warnRuleData.breathDown = warnRuleCookie.breathDown
    warnRuleData.motion = warnRuleCookie.motion
    warnRuleData.motionTimes = warnRuleCookie.motionTimes
    warnRuleData.motionStart = warnRuleCookie.motionStart
    warnRuleData.motionEnd = warnRuleCookie.motionEnd
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
 */
function audioPause(that) {
    backgroundAudioManager.pause()
    warnStateData.warnNing = 0
    if (warnStateData.warnNo == 0) {
        warnStateData.warnDeviceTime = null
    } else if (warnStateData.warnNo == 1) {
        warnStateData.warnHeartTime = null
    } else if (warnStateData.warnNo == 2) {
        warnStateData.warnBreathTime = null
    } else if (warnStateData.warnNo == 3) {
        warnStateData.warnMotionTime = null
    }
    warnStateData.warnNo = null
    changeWarnToThis(that)
}

/**
 * 同步报警状态值
 * @param {Object} that 作用域
 */
function changeWarnToThis(that) {
    that.warnNing = warnStateData.warnNing
    that.warnNo = warnStateData.warnNo
    that.warnDeviceTime = warnStateData.warnDeviceTime
    that.warnHeartTime = warnStateData.warnHeartTime
    that.warnBreathTime = warnStateData.warnBreathTime
    that.warnMotionTime = warnStateData.warnMotionTime
    that.warningText = warnStateData.warningText
}

/**
 * 触发报警
 * @param {Object} that 作用域
 * @param {Object} backgroundAudioManager 背景音乐
 */
function audioStart(that) {
    that.warnNing = 1
    warnStateData.warnNing = 1
    if (backgroundAudioManager.paused) {
        backgroundAudioManager.title = '报警' + Date.parse(new Date())
        backgroundAudioManager.src = 'http://www.hanjiaxin.cn/images/warning.mp3?time=' + Date.parse(new Date())
        backgroundAudioManager.play()
    } else {
        // 设置了 src 之后会自动播放
        if (!backgroundAudioManager.src) {
            backgroundAudioManager.title = '报警' + Date.parse(new Date())
            backgroundAudioManager.src = 'http://www.hanjiaxin.cn/images/warning.mp3'
        }
        backgroundAudioManager.onEnded(() => {
            backgroundAudioManager.title = '报警' + Date.parse(new Date())
            backgroundAudioManager.src = 'http://www.hanjiaxin.cn/images/warning.mp3?time=' + Date.parse(new Date())
        })
    }
}

/**
 * 检验报警
 * @param {Object} that 作用域
 * @param {Object} res 数据
 */
function checkWarn(that, res) {

    checkDevice(that, res)
    checkHeart(that, res)
    checkBreath(that, res)
    checkMotion(that, res)

}

/**
 * 离床检测
 * @param {Object} that 作用域
 * @param {Object} res 数据
 */
function checkDevice(that, res) {
    // 如果正在报警，跳出检测
    if (warnStateData.warnNing == 1) return
    // let warnRule = JSON.parse(getCookie('warnRule'))
    let nowTime = Date.parse(new Date())
    let nowTimeHour = new Date().getHours() + ':' + new Date().getMinutes()
    let deviceStatus = res.successData[0].deviceStatus
    let oldDeviceStatus = that.deviceStatus
    // 系统设置为不监控 跳出检测
    if (!warnRuleData.device) {
        // console.log('系统设置为不监控 跳出检测')
        warnStateData.warnDeviceTime = null
        return
    }
    // 系统设置时间有误，跳出检测
    if (warnRuleData.deviceStart > warnRuleData.deviceEnd) {
        // console.log('系统设置时间有误，跳出检测')
        warnStateData.warnDeviceTime = null
        return
    }
    // 如果没有离床报警记录点时间戳，跳出检测
    if (!warnStateData.warnDeviceTime) {
        // console.log('如果没有离床报警记录点时间戳，跳出检测')
        return
    }
    // 状态为4_在床，5_光纤故障，6_离线，9_传感器负荷，10_信号弱，则终止离床检测倒计时
    if (deviceStatus == 4 || deviceStatus == 5 || deviceStatus == 6 || deviceStatus == 9 || deviceStatus == 10) {
        // console.log('状态为4_在床，5_光纤故障，6_离线，9_传感器负荷，10_信号弱，则终止离床检测倒计时')
        warnStateData.warnDeviceTime = null
        return
    }
    // 不在报警时间段内，跳出检测
    if (warnRuleData.deviceStart > nowTimeHour || warnRuleData.deviceEnd < nowTimeHour) {
        // console.log('不在报警时间段内，跳出检测')
        warnStateData.warnDeviceTime = null
        return
    }
    console.log(nowTime - warnStateData.warnDeviceTime, '...离床监测..', warnRuleData.deviceTimes * 60 * 1000)
    // 记录时间点已超出系统设置离床时间上限，触发离床报警
    if ((nowTime - warnStateData.warnDeviceTime) > (warnRuleData.deviceTimes * 60 * 1000)) {
        // console.log('记录时间点已超出系统设置离床时间上限，触发离床报警')
        let t = new Date(warnStateData.warnDeviceTime)
        that.warningText = '用户于' + (t.getHours() < 10 ? '0' + t.getHours() : t.getHours()) + ':' + (t.getMinutes() < 10 ?
            '0' + t.getMinutes() : t.getMinutes()) + '离床，并已超过' + warnRuleData.deviceTimes + '分钟'
        that.warning = 1
        warnStateData.warnNing = 1
        warnStateData.warnNo = 0
        audioStart(that, backgroundAudioManager)
        warnStateData.warnDeviceTime = null
    }
}

/**
 * 心率检测
 * @param {Object} that 作用域
 * @param {Object} res 数据
 */
function checkHeart(that, res) {
    // console.log('心率检测!')
    // 如果正在报警，跳出检测
    if (warnStateData.warnNing == 1) return
    // let warnRule = JSON.parse(getCookie('warnRule'))
    let nowTime = Date.parse(new Date())
    let nowTimeHour = new Date().getHours() + ':' + new Date().getMinutes()
    let deviceStatus = res.successData[0].deviceStatus
    // 如果不是在床状态，跳出检测
    if (deviceStatus != 4) {
        // console.log('如果不是在床状态，跳出检测')
        warnStateData.warnHeartTime = null
        return
    }
    // 系统设置为不监控 跳出检测
    if (!warnRuleData.heart) {
        // console.log('系统设置为不监控 跳出检测')
        warnStateData.warnHeartTime = null
        return
    }
    // 系统设置上下限规则有误，跳出检测
    if (warnRuleData.heartDown > warnRuleData.heartUp) {
        // console.log('系统设置上下限规则有误，跳出检测')
        warnStateData.warnHeartTime = null
        return
    }
    // 如果没有心率报警记录点时间戳，设置记录点并跳出检测
    if (!warnStateData.warnHeartTime) {
        // console.log('如果没有心率报警记录点时间戳，跳出检测')
        warnStateData.warnHeartTime = Date.parse(new Date())
        return
    }
    // 心率回归正常值，初始化数据，并跳出检测
    if (res.successData[0].heart <= warnRuleData.heartUp && res.successData[0].heart >= warnRuleData.heartDown) {
        // console.log('心率回归正常值，初始化数据，并跳出检测')
        warnStateData.warnHeartTime = null
        return
    }
    
    console.log(nowTime - warnStateData.warnHeartTime, '...心率监测(有异常)..')
    // 记录时间点已超出系统默认设置心率持续异常时间上限，触发离床报警
    if ((nowTime - warnStateData.warnHeartTime) > (30 * 1000)) {
        if (res.successData[0].heart > warnRuleData.heartUp) {
            // console.log('记录时间点已超出系统默认设置心率持续异常时间上限，触发心率报警')
            let t = new Date(warnStateData.warnHeartTime)
            that.warningText = '用户于' + nowTimeHour + '心率持续30秒高于您设置的上限峰值!'
            warnStateData.warningText = '用户于' + nowTimeHour + '心率持续30秒高于您设置的上限峰值!'
            that.warning = 1
            warnStateData.warnNing = 1
            warnStateData.warnNo = 1
            audioStart(that, backgroundAudioManager)
            warnStateData.warnHeartTime = null
        } else {
            // console.log('记录时间点已超出系统默认设置心率持续异常时间上限，触发心率报警')
            let t = new Date(warnStateData.warnHeartTime)
            that.warningText = '用户于' + nowTimeHour + '心率持续30秒低于您设置的下限峰值!'
            warnStateData.warningText = '用户于' + nowTimeHour + '心率持续30秒低于您设置的下限峰值!'
            that.warning = 1
            warnStateData.warnNing = 1
            warnStateData.warnNo = 1
            audioStart(that, backgroundAudioManager)
            warnStateData.warnHeartTime = null
        }
    }
}

/**
 * 呼吸率检测
 * @param {Object} that 作用域
 * @param {Object} res 数据
 */
function checkBreath(that, res) {
    // console.log('呼吸检测!')
    // 如果正在报警，跳出检测
    if (warnStateData.warnNing == 1) return
    // let warnRule = JSON.parse(getCookie('warnRule'))
    let nowTime = Date.parse(new Date())
    let nowTimeHour = new Date().getHours() + ':' + new Date().getMinutes()
    let deviceStatus = res.successData[0].deviceStatus
    // 如果不是在床状态，跳出检测
    if (deviceStatus != 4) {
        // console.log('如果不是在床状态，跳出检测')
        warnStateData.warnBreathTime = null
        return
    }
    // 系统设置为不监控 跳出检测
    if (!warnRuleData.breath) {
        // console.log('系统设置为不监控 跳出检测')
        warnStateData.warnBreathTime = null
        return
    }
    // 系统设置上下限规则有误，跳出检测
    if (warnRuleData.breathDown * 1 > warnRuleData.breathUp * 1) {
        // console.log('系统设置上下限规则有误，跳出检测')
        warnStateData.warnBreathTime = null
        return
    }
    // 如果没有呼吸率报警记录点时间戳，设置记录点并跳出检测
    if (!warnStateData.warnBreathTime) {
        // console.log('如果没有呼吸率报警记录点时间戳，设置记录点并跳出检测')
        warnStateData.warnBreathTime = Date.parse(new Date())
        return
    }
    // 呼吸率回归正常值，初始化数据，并跳出检测
    if (res.successData[0].breath * 1 <= warnRuleData.breathUp * 1 && res.successData[0].breath * 1 >= warnRuleData.breathDown * 1) {
        // console.log('呼吸率回归正常值，初始化数据，并跳出检测')
        warnStateData.warnBreathTime = null
        return
    }
    
    console.log(nowTime - warnStateData.warnBreathTime, '...呼吸监测(有异常)..')
    
    // 记录时间点已超出系统默认设置呼吸率持续异常时间上限，触发呼吸报警
    if ((nowTime - warnStateData.warnBreathTime) > (30 * 1000)) {
        if (res.successData[0].breath > warnRuleData.breathUp) {
            // console.log('记录时间点已超出系统默认设置呼吸率持续异常时间上限，触发呼吸率报警')
            let t = new Date(warnStateData.warnBreathTime)
            that.warningText = '用户于' + nowTimeHour + '呼吸率持续30秒高于您设置的上限峰值!'
            warnStateData.warningText = '用户于' + nowTimeHour + '呼吸率持续30秒高于您设置的上限峰值!'
            that.warning = 1
            warnStateData.warnNing = 1
            warnStateData.warnNo = 1
            audioStart(that)
            warnStateData.warnBreathTime = null
        } else {
            // console.log('记录时间点已超出系统默认设置呼吸率持续异常时间上限，触发呼吸率报警')
            let t = new Date(warnStateData.warnBreathTime)
            that.warningText = '用户于' + nowTimeHour + '呼吸率持续30秒低于您设置的下限峰值!'
            warnStateData.warningText = '用户于' + nowTimeHour + '呼吸率持续30秒低于您设置的下限峰值!'
            that.warning = 1
            warnStateData.warnNing = 1
            warnStateData.warnNo = 1
            audioStart(that)
            warnStateData.warnBreathTime = null
        }
    }
}

/**
 * 体动检测
 * @param {Object} that 作用域
 * @param {Object} res 数据
 */
function checkMotion(that, res) {
    // console.log('时时体动数据 = ' + res.successData[0].motion)
    // 如果正在报警，跳出检测
    if (warnStateData.warnNing == 1) return
    // let warnRule = JSON.parse(getCookie('warnRule'))
    let nowTime = Date.parse(new Date())
    let nowTimeHour = new Date().getHours() + ':' + new Date().getMinutes()
    let deviceStatus = res.successData[0].deviceStatus
    // 如果不是在床状态，跳出检测
    if (deviceStatus != 4) {
        // console.log('如果不是在床状态，跳出检测')
        warnStateData.warnBreathTime = null
        return
    }
    // 系统设置为不监控 跳出检测
    if (!warnRuleData.motion) {
        // console.log('系统设置为不监控 跳出检测')
        warnStateData.warnMotionTime = null
        return
    }
    // 系统设置时间有误，跳出检测
    if (warnRuleData.motionStart > warnRuleData.motionEnd) {
        // console.log('系统设置时间有误，跳出检测')
        warnStateData.warnMotionTime = null
        return
    }
    // 如果没有体动报警记录点时间戳，跳出检测
    if (!warnStateData.warnMotionTime) {
        warnStateData.warnMotionTime = Date.parse(new Date())
        return
    }
    // 不在报警时间段内，跳出检测
    if (warnRuleData.motionStart > nowTimeHour || warnRuleData.motionEnd < nowTimeHour) {
        // console.log('不在报警时间段内，跳出检测')
        warnStateData.warnMotionTime = null
        return
    }
    // 体动值回复正常数据，初始化数据并跳出检测
    if (res.successData[0].motion < 4) {
        // console.log('体动值回复正常数据，初始化数据并跳出检测')
        warnStateData.warnMotionTime = null
        return
    }
    console.log(nowTime - warnStateData.warnMotionTime, '...体动监测..', warnRuleData.motionTimes * 60 * 1000)
    // 记录时间点已超出系统设置体动时间上限，触发体动报警
    if ((nowTime - warnStateData.warnMotionTime) > (warnRuleData.motionTimes * 60 * 1000)) {
        // console.log('记录时间点已超出系统设置体动时间上限，触发体动报警')
        let t = new Date(warnStateData.warnMotionTime)
        that.warningText = '用户于' + (t.getHours() < 10 ? '0' + t.getHours() : t.getHours()) + ':' + (t.getMinutes() < 10 ?
            '0' + t.getMinutes() : t.getMinutes()) + '开始体动频繁，并已超过' + warnRuleData.motionTimes + '分钟！'
        warnStateData.warningText = '用户于' + (t.getHours() < 10 ? '0' + t.getHours() : t.getHours()) + ':' + (t.getMinutes() < 10 ?
            '0' + t.getMinutes() : t.getMinutes()) + '开始体动频繁，并已超过' + warnRuleData.motionTimes + '分钟！'
        that.warning = 1
        warnStateData.warnNing = 1
        warnStateData.warnNo = 0
        audioStart(that)
        warnStateData.warnMotionTime = null
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
    warnRuleData, // 报警规则数据值
    warnStateData, // 报警状态数据值
    setCookie,
    getCookie,
    myAjax,
    myAjax2,
    getWarnCookie,
    setWarnCookie,
    audioPause,
    changeWarnToThis,
    showToastBox,
    checkWarn,
    backgroundAudioManager
}
