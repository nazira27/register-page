import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import vuetify from "./plugins/vuetify";

Vue.use(axios);
Vue.use(vuetify, {
  options: {
    customProperties: true,
  },
  iconfont: "mdi",
});
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
