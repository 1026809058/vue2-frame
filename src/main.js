import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 自动引入处理组件插件
import componentsList from "./plugins/componentsRegister";
import "./utils/routes";

Vue.config.productionTip = false;
Vue.use(componentsList);

console.log("ENV----" + process.env.NODE_ENV);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
