import { createStore } from 'vuex';

export default createStore({
  state: {
    isAuthenticated: false
  },
  mutations: {
    setAuthenticated(state, status) {
      state.isAuthenticated = status;
      localStorage.setItem('isAuthenticated', status); 
    }
  },
  actions: {
    login({ commit }) {
      commit('setAuthenticated', true);
    },
    logout({ commit }) {
      commit('setAuthenticated', false);
    }
  }
});
