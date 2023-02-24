import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import App from './App'
import store from './store'
import router from './router'

import MetaInfo from "vue-meta-info"; 
Vue.use(MetaInfo);

axios.defaults.timeout = 10000;

Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.$axios = axios

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})