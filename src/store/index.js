import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    repositories: [],
  },
  mutations: {
    setRepositories(state, data){
      state.repositories = data
    }
  },
  actions: {
    async setRepositories({commit}, q){
      const { data } = await axios.get(`http://localhost:5000/get/starred/${q}`)
      commit('setRepositories', data)
    }
  },
  getters: {
    getRepositories: state => state.repositories
  }
})
