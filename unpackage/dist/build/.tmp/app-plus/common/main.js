(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["common/main"],{"4e76":function(n,t,e){"use strict";(function(n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var e={onLaunch:function(){plus.screen.lockOrientation("portrait-primary"),n.request({url:"https://uniapp.dcloud.io/update",data:{appid:plus.runtime.appid,version:plus.runtime.version,imei:plus.device.imei},success:function(t){if(200==t.statusCode&&t.data.isUpdate){var e="iOS"===plus.os.name?t.data.iOS:t.data.Android;n.showModal({title:"更新提示",content:t.data.note?t.data.note:"是否选择更新",success:function(n){n.confirm&&plus.runtime.openURL(e)}})}}})},onShow:function(){},onHide:function(){}};t.default=e}).call(this,e("6e42")["default"])},"575d":function(n,t,e){"use strict";e.r(t);var u=e("93d3");for(var a in u)"default"!==a&&function(n){e.d(t,n,function(){return u[n]})}(a);e("886a");var o,i,r=e("2877"),c=Object(r["a"])(u["default"],o,i,!1,null,null,null);t["default"]=c.exports},8776:function(n,t,e){},"886a":function(n,t,e){"use strict";var u=e("8776"),a=e.n(u);a.a},"93d3":function(n,t,e){"use strict";e.r(t);var u=e("4e76"),a=e.n(u);for(var o in u)"default"!==o&&function(n){e.d(t,n,function(){return u[n]})}(o);t["default"]=a.a}},[["615a","common/runtime","common/vendor"]]]);