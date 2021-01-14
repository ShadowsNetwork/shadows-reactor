import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueI18n from 'vue-i18n';

Vue.use(ElementUI);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: localStorage.getItem('language')||'cn', //使用localStorage缓存到本地，当下次使用时可默认当前使用语言
  messages: {
    'cn': require('./components/language/cn'),
    'us': require('./components/language/us')
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
