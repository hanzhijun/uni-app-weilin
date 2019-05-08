var baseHost = 'https://api.darma.cn/mattress'
var imgUrl = 'http://www.hanjiaxin.cn/images/'
var deviceNos = '641743000773'

function formatTime(time) {
    if (typeof time !== 'number' || time < 0) {
        return time
    }

    var hour = parseInt(time / 3600)
    time = time % 3600
    var minute = parseInt(time / 60)
    time = time % 60
    var second = time

    return ([hour, minute, second]).map(function(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }).join(':')
}

function formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
        longitude = parseFloat(longitude)
        latitude = parseFloat(latitude)
    }

    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
        longitude: longitude.toString().split('.'),
        latitude: latitude.toString().split('.')
    }
}
var dateUtils = {
    UNITS: {
        '年': 31557600000,
        '月': 2629800000,
        '天': 86400000,
        '小时': 3600000,
        '分钟': 60000,
        '秒': 1000
    },
    humanize: function(milliseconds) {
        var humanize = '';
        for (var key in this.UNITS) {
            if (milliseconds >= this.UNITS[key]) {
                humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前'
                break
            }
        }
        return humanize || '刚刚';
    },
    format: function(dateStr) {
        var date = this.parse(dateStr)
        var diff = Date.now() - date.getTime()
        if (diff < this.UNITS['天']) {
            return this.humanize(diff)
        }
        var _format = function(number) {
            return (number < 10 ? ('0' + number) : number)
        };
        return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
            _format(date.getHours()) + ':' + _format(date.getMinutes())
    },
    parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
        var a = str.split(/[^0-9]/)
        return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
    }
}

/**
 * 设置添加本地local storage缓存
 * @param key
 * @param value
 */
function setCookie(key, value) {
    uni.setStorageSync(key, value)
}
function setStorage(key, value) {
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
function getStorage(key) {
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

module.exports = {
    formatTime,
    formatLocation,
    dateUtils,
    setCookie,
    getCookie,
    setStorage,
    getStorage,
    myAjax,
    myAjax2
}
