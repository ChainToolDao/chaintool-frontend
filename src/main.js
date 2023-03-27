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
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

Vue.use(JsonViewer);
Vue.use(MetaInfo);
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.functionSelector = functionSelector;
Vue.prototype.arrayParsing=arrayParsing
axios.defaults.timeout = 10000;
Vue.prototype.$axios = axios

Sentry.init({
  Vue,
  dsn: "https://e3f69262eafc4f75938174dd2f6d5a70@o4504909364068352.ingest.sentry.io/4504909371080704",
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ["localhost", "my-site-url.com", /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})