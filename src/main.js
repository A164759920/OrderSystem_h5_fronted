import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;
import AnimateIconVue from "@/components/AnimateIcon.vue";
Vue.component("AnimateIconVue", AnimateIconVue);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
