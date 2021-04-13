import Vue from "vue";
import Router from "vue-router";
import MainPage from "./components/MainPage";
import Register from "./components/Register";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: MainPage,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
  ],
});
