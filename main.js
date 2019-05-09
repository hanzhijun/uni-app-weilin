import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.warningAuto = '0'; // 报警开关
Vue.prototype.warningText = ''; // 报警提示语
Vue.prototype.warningState = '0'; // 报警类型 0离床，1心跳，2呼吸，3体动

Vue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}

App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()