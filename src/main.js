import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import App from './App'
import store from './store'
import router from './router'
import MetaInfo from "vue-meta-info";
import JsonViewer from 'vue-json-viewer';
import functionSelector from "./functionSelector";
import arrayParsing from './ arrayParsing'
import i18n from '@/lang'

Vue.use(JsonViewer);
Vue.use(MetaInfo);
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.functionSelector = functionSelector;
Vue.prototype.arrayParsing=arrayParsing
axios.defaults.timeout = 10000;
Vue.prototype.$axios = axios

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
})