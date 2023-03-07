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

//提交函数签名
Vue.prototype.submitFunctionSelector = async function (functionName, functionSelector) {
  try {
    axios
      .post(intefUrl.selector, {
        signature: functionName,
        selector: functionSelector,
      })
      .then((res) => { });
  } catch (error) {
  }
}

//获取函数签名
Vue.prototype.getFunctionSignature = async function (functionSelector) {
  let signatureData = [];
  try {
    await axios
      .get(intefUrl.selector + "/" + functionSelector)
      .then((res) => {
        for (let i in res.data.data) {
          if (signatureData.indexOf(res.data.data[i]) == -1) {
            signatureData.push(res.data.data[i]);
          }
        }
      });
  } catch (error) {
  }
  functionSelector = functionSelector.slice(2);
  try {
    await axios
      .get(
        "https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/" +
        functionSelector
      )
      .then((res) => {
        let data = res.data.split(";");
        for (let i in data) {
          if (signatureData.indexOf(data[i]) == -1) {
            signatureData.push(data[i]);
            this.submitFunctionSelector(data[i], ("0x" + functionSelector))
          }
        }
      });
  } catch (error) {
  }
  return signatureData
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})