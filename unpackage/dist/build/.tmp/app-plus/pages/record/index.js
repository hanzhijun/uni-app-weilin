(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/record/index"],{"0837":function(e,t,i){"use strict";i.r(t);var a=i("e16b"),n=i.n(a);for(var o in a)"default"!==o&&function(e){i.d(t,e,function(){return a[e]})}(o);t["default"]=n.a},1414:function(e,t,i){"use strict";var a=i("6191"),n=i.n(a);n.a},1962:function(e,t,i){"use strict";i.r(t);var a=i("41f1"),n=i("0837");for(var o in n)"default"!==o&&function(e){i.d(t,e,function(){return n[e]})}(o);i("1414");var r=i("2877"),s=Object(r["a"])(n["default"],a["a"],a["b"],!1,null,null,null);t["default"]=s.exports},"41f1":function(e,t,i){"use strict";var a=function(){var e=this,t=e.$createElement;e._self._c},n=[];i.d(t,"a",function(){return a}),i.d(t,"b",function(){return n})},6191:function(e,t,i){},e16b:function(e,t,i){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,n=o(i("0687"));function o(e){return e&&e.__esModule?e:{default:e}}var r=null,s=null,c=null,u=i("2a7e"),l=(u.baseHost,u.imgUrl,u.warnRule),h=u.warnState,d=u.setCookie,m=u.getCookie,f=(u.myAjax,u.myAjax2),g=u.getWarnCookie,v=(u.setWarnCookie,u.audioPause,u.changeWarn),T=u.checkWarn,p=wx.getBackgroundAudioManager(),w={data:function(){return{title:"历史记录",showToast:0,toastTxt:"",loading:0,userInfo:null,deviceNos:"",accessToken:null,breathNum:"--",deviceStatus:null,heartNum:"--",markTime:null,motionNum:null,timer:null,tabNum:"1",startTime:null,endTime:null,historyData:[],cWidth:"",cHeight:"",cWidth2:"",cHeight2:"",pixelRatio:1,serverData:"",firstLoad:0,device:"",deviceTimes:"",deviceStart:"",deviceEnd:"",heart:"",heartUp:"",heartDown:"",breath:"",breathUp:"",breathDown:"",motion:"",motionTimes:"",motionStart:"",motionEnd:"",warnNing:0,warningText:"",warnNo:"",warnDeviceTime:"",warnHeartTime:"",warnBreathTime:"",warnMotionTime:""}},onLoad:function(){a=this,setTimeout(function(){a.firstLoad=1},2e3),a.cWidth=e.upx2px(750),a.cHeight=e.upx2px(500),a.cWidth2=e.upx2px(700),a.cHeight2=e.upx2px(1100);var t=m("accessToken"),i=m("deviceNos"),n=m("username");t?i?(v(a),g(a),a.userInfo=n,a.accessToken=t,a.deviceNos=i,a.getActual(),a.timer=setInterval(function(){a.getActual()},3e3),a.getTime(1),a.history()):e.redirectTo({url:"../code/index"}):e.redirectTo({url:"../login/index"})},onLaunch:function(){},onShow:function(){},onHide:function(){},onUnload:function(){clearInterval(this.timer)},methods:{getActual:function(t){console.log("获取设备当前的状态一次(record)!"," at pages\\record\\index.vue:242");var i={deviceNos:this.deviceNos},a=this;f("post","/device/physiology/actual",i,function(t){if("10000"==t.retCode){var i=t.successData[0].deviceStatus;l.device&&"4"==a.deviceStatus&&"3"==i&&!h.warnDeviceTime&&(console.log("离床已记录，以此时间为基准开始计算报警数据"," at pages\\record\\index.vue:255"),h.warnDeviceTime=Date.parse(new Date),h.warnHeartTime=null,h.warnBreathTime=null,h.warnMotionTime=null,a.warnDeviceTime=h.warnDeviceTime,a.warnHeartTime=null,a.warnBreathTime=null,a.warnMotionTime=null),"4"==i&&(h.warnDeviceTime=null,a.warnDeviceTime=null,console.log("解除离床报警计算数据"," at pages\\record\\index.vue:268")),T(a,t,p),a.deviceStatus=i,a.breathNum=t.successData[0].breath,a.heartNum=t.successData[0].heart,a.markTime=t.successData[0].markTime,a.motionNum=t.successData[0].motion,a.loading=0}else d("accessToken",""),d("username",""),e.redirectTo({url:"../login/index"})},function(e){})},checkWarnState:function(){},linkToLogin:function(){e.redirectTo({url:"../login/index"})},changeNav:function(e){var t=this.tabNum;t!=e&&(this.tabNum=e,this.getTime(e),this.history())},getTime:function(e){var t=Date.parse(new Date),i=null;"1"==e?i=this.getTodayStartTime():"2"==e?i=parseInt(t/1e3)-259200:"3"==e&&(i=parseInt(t/1e3)-604798),this.endTime=parseInt(t/1e3),this.startTime=i},history:function(){this.loading=1;var e={deviceNos:this.deviceNos,startTime:this.startTime,endTime:this.endTime},t=this;f("post","/device/physiology/history",e,function(e){"10000"==e.retCode&&t.setHistoryData(e)},function(e){})},setHistoryData:function(e){for(var t=e.successData,i=[],a=[],n=[],o=[],r=[],s=t.length-1;s>-1;s--){var c={heart:t[s].heart,breath:t[s].breath,motion:1*t[s].motion.substring(0,1),time:this.getLocalTime(t[s].createTime)};i.push(c),a.push(this.getLocalTime(t[s].createTime).substring(0,11)),n.push(t[s].heart),o.push(t[s].breath),r.push(1*t[s].motion.substring(0,1))}this.historyData=i,this.chartsTime=a,this.chartsHeart=n,this.chartsBreath=o,this.chartsTidong=r;var u={categories:a,series:[{name:"心率",data:n,color:"#1890ff"},{name:"呼吸率",data:o,color:"#2fc25b"},{name:"体动值",data:r,color:"#facc14"}]};u.categories.length>0&&u.series.length>0&&(this.showLineB("canvasLineB",u),this.showArea("canvasArea",u))},getLocalTime:function(e){var t=new Date(1e3*e),i=t.getMonth()+1;i<10&&(i="0"+i);var a=t.getDate();a<10&&(a="0"+a);var n=t.getHours();n<10&&(n="0"+n);var o=t.getMinutes();o<10&&(o="0"+o);var r=t.getSeconds();return r<10&&(r="0"+r),i+"-"+a+" "+n+":"+o+":"+r},getTodayStartTime:function(){var e=new Date(Date.parse(new Date)),t=e.getFullYear(),i=e.getMonth()+1,a=e.getDate(),n=t+"/"+i+"/"+a+" 00:00:01";return new Date(n).getTime()/1e3},showLineB:function(e,t){s=new n.default({$this:a,canvasId:e,type:"line",fontSize:11,legend:!0,background:"#FFFFFF",pixelRatio:a.pixelRatio,rotate:!0,categories:t.categories,animation:!1,series:t.series,xAxis:{disableGrid:!0},yAxis:{},width:a.cWidth2*a.pixelRatio,height:a.cHeight2*a.pixelRatio,dataLabel:!1,dataPointShape:!1,extra:{lineStyle:"curve"}})},showArea:function(e,t){c=new n.default({$this:a,canvasId:e,type:"area",fontSize:11,legend:!0,background:"#FFFFFF",pixelRatio:a.pixelRatio,categories:t.categories,animation:!1,series:t.series,xAxis:{disableGrid:!0},yAxis:{},width:a.cWidth*a.pixelRatio,height:a.cHeight*a.pixelRatio,dataLabel:!1,dataPointShape:!1})},touchLineA:function(e){r.scrollStart(e)},moveLineA:function(e){r.scroll(e)},touchEndLineA:function(e){r.scrollEnd(e),r.showToolTip(e,{format:function(e,t){return t+" "+e.name+":"+e.data}})},touchLineB:function(e){s.showToolTip(e,{format:function(e,t){return t+" "+e.name+":"+e.data}})},touchArea:function(e){c.showToolTip(e,{format:function(e,t){return t+" "+e.name+":"+e.data}})},audioPause:function(){u.audioPause(this,p)}}};t.default=w}).call(this,i("6e42")["default"])}},[["333c","common/runtime","common/vendor"]]]);