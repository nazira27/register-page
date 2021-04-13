import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: {},
  },
  getters: {
    user: (state) => state.user,
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
  },
  actions: {
    saveUser({ commit }, payload) {
      console.log(payload, "store");
      commit("setUser", payload);
    },
  },
});
