(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/setting/index"],{2005:function(e,t,i){"use strict";var n=i("6982"),a=i.n(n);a.a},6982:function(e,t,i){},7197:function(e,t,i){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=i("2a7e"),a=(n.baseHost,n.imgUrl,n.warnRule),o=n.warnState,r=n.setCookie,s=n.getCookie,c=(n.myAjax,n.myAjax2),u=n.getWarnCookie,h=(n.setWarnCookie,n.audioPause,n.changeWarn),l=n.checkWarn,v=wx.getBackgroundAudioManager(),d={data:function(){return{title:"系统设置",toast:0,toastTxt:"",loading:0,confirm:0,userInfo:null,deviceNos:"",accessToken:null,breathNum:"--",deviceStatus:null,heartNum:"--",markTime:null,motionNum:null,timer:null,device:"",deviceTimes:"",deviceStart:"",deviceEnd:"",heart:"",heartUp:"",heartDown:"",breath:"",breathUp:"",breathDown:"",motion:"",motionTimes:"",motionStart:"",motionEnd:"",warnNing:0,warningText:"",warnNo:"",warnDeviceTime:"",warnHeartTime:"",warnBreathTime:"",warnMotionTime:""}},onLoad:function(){var t=this,i=s("accessToken"),n=s("deviceNos"),a=s("username");i?n?(h(t),u(t),t.userInfo=a,t.accessToken=i,t.deviceNos=n,t.getActual(),t.timer=setInterval(function(){t.getActual()},3e3)):e.redirectTo({url:"../code/index"}):e.redirectTo({url:"../login/index"})},onLaunch:function(){},onShow:function(){},onHide:function(){clearInterval(this.timer)},onUnload:function(){clearInterval(this.timer)},methods:{getActual:function(t){console.log("获取设备当前的状态一次(setting)!"," at pages\\setting\\index.vue:322");var i={deviceNos:this.deviceNos},n=this;c("post","/device/physiology/actual",i,function(t){if("10000"==t.retCode){var i=t.successData[0].deviceStatus;a.device&&"4"==n.deviceStatus&&"3"==i&&!o.warnDeviceTime&&(console.log("离床已记录，以此时间为基准开始计算报警数据"," at pages\\setting\\index.vue:335"),o.warnDeviceTime=Date.parse(new Date),o.warnHeartTime=null,o.warnBreathTime=null,o.warnMotionTime=null,n.warnDeviceTime=o.warnDeviceTime,n.warnHeartTime=null,n.warnBreathTime=null,n.warnMotionTime=null),"4"==i&&(o.warnDeviceTime=null,n.warnDeviceTime=null,console.log("解除离床报警计算数据"," at pages\\setting\\index.vue:348")),l(n,t,v),n.deviceStatus=i,n.breathNum=t.successData[0].breath,n.heartNum=t.successData[0].heart,n.markTime=t.successData[0].markTime,n.motionNum=t.successData[0].motion,n.loading=0}else r("accessToken",""),r("username",""),e.redirectTo({url:"../login/index"})},function(e){})},switch1Change:function(e){this.device=e.target.value,a.device=e.target.value,n.setWarnCookie(this)},switch2Change:function(e){this.heart=e.target.value,a.heart=e.target.value,n.setWarnCookie(this)},switch3Change:function(e){this.breath=e.target.value,a.breath=e.target.value,n.setWarnCookie(this)},switch4Change:function(e){this.motion=e.target.value,a.motion=e.target.value,n.setWarnCookie(this)},bindTime01Change:function(e){this.deviceStart=e.target.value,a.deviceStart=e.target.value,n.setWarnCookie(this)},bindTime02Change:function(e){this.deviceEnd=e.target.value,a.deviceEnd=e.target.value,n.setWarnCookie(this)},deviceTimesChange:function(e){var t=e.target.value;(t<1||t>300)&&(t=1,n.showToastBox(this,"请输入1-300的数字")),this.deviceTimes=t,a.deviceTimes=t,n.setWarnCookie(this)},deviceStartChange:function(e){this.deviceStart=e.target.value,a.deviceStart=e.target.value,n.setWarnCookie(this),this.deviceStart>this.deviceEnd&&n.showToastBox(this,"开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!")},deviceEndChange:function(e){this.deviceEnd=e.target.value,a.deviceEnd=e.target.value,n.setWarnCookie(this),this.deviceStart>this.deviceEnd&&n.showToastBox(this,"开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!")},heartDownChange:function(e){var t=e.target.value;(t<1||t>180)&&(t=1,n.showToastBox(this,"请输入1-180的数字")),this.heartDown=t,a.heartDown=t,n.setWarnCookie(this)},heartUpChange:function(e){var t=e.target.value;(t<1||t>180)&&(t=1,n.showToastBox(this,"请输入1-180的数字")),this.heartUp=t,a.heartUp=t,n.setWarnCookie(this)},breathDownChange:function(e){var t=e.target.value;(t<1||t>180)&&(t=1,n.showToastBox(this,"请输入1-180的数字")),this.breathDown=t,a.breathDown=t,n.setWarnCookie(this)},breathUpChange:function(e){var t=e.target.value;(t<1||t>180)&&(t=1,n.showToastBox(this,"请输入1-180的数字")),this.breathUp=t,a.breathUp=t,n.setWarnCookie(this)},motionTimesChange:function(e){var t=e.target.value;(t<1||t>300)&&(t=1,n.showToastBox(this,"请输入1-300的数字")),this.motionTimes=t,a.motionTimes=t,n.setWarnCookie(this)},motionEndChange:function(e){this.motionEnd=e.target.value,a.motionEnd=e.target.value,n.setWarnCookie(this),this.deviceStart>this.deviceEnd&&n.showToastBox(this,"开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!")},motionStartChange:function(e){this.motionStart=e.target.value,a.motionStart=e.target.value,n.setWarnCookie(this),this.deviceStart>this.deviceEnd&&n.showToastBox(this,"开始时间不可晚于结束时间, 错误时间段将导致无法做出提醒!")},audioPause:function(){n.audioPause(this,v)},openConfirmBox:function(){this.confirm=1},closeConfirmBox:function(){this.confirm=0},loginOut:function(){r("accessToken",""),r("username",""),r("deviceNos",""),r("warnRule",""),this.confirm=0,clearInterval(this.timer),e.reLaunch({url:"../login/index"})}}};t.default=d}).call(this,i("6e42")["default"])},"99fc":function(e,t,i){"use strict";i.r(t);var n=i("7197"),a=i.n(n);for(var o in n)"default"!==o&&function(e){i.d(t,e,function(){return n[e]})}(o);t["default"]=a.a},a340:function(e,t,i){"use strict";i.r(t);var n=i("b094"),a=i("99fc");for(var o in a)"default"!==o&&function(e){i.d(t,e,function(){return a[e]})}(o);i("2005");var r=i("2877"),s=Object(r["a"])(a["default"],n["a"],n["b"],!1,null,null,null);t["default"]=s.exports},b094:function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;e._self._c},a=[];i.d(t,"a",function(){return n}),i.d(t,"b",function(){return a})}},[["95c0","common/runtime","common/vendor"]]]);