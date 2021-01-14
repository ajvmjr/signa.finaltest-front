import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    repositories: [],
    snackbar: false,
	  snackbarMsg: '',
  },
  mutations: {
    setRepositories(state, data){
      state.repositories = data
    },
    setSnackbar(state, { status, message }) {
      state.snackbar = status
      state.snackbarMsg = message
    },
  },
  actions: {
    async getAllRepositories({commit}){
      const { data } = await axios.get("http://localhost:5000/get/all/repositories")
      commit("setRepositories", data)
    },
    async setRepositories({commit}, q){
      const { data } = await axios.get(`http://localhost:5000/get/starred/${q}`)
      commit('setRepositories', data)
    },
    async addTag({commit, dispatch}, info){
      const { repositoryId, repositoryTags } = info
      await axios.post("http://localhost:5000/insert/repository/tag/", {
        repositoryId,
        repositoryTags
      })
      dispatch("getAllRepositories")
    },
    async editTag({commit, dispatch}, info){
      const { repositoryId, repositoryTags } = info
      await axios.put("http://localhost:5000/update/repository/tag", {
        repositoryId, 
        repositoryTags
      })
      dispatch("getAllRepositories")
    },
    async deleteTag({commit, dispatch}, info){
      const { repositoryId, repositoryTags } = info
      await axios.delete("http://localhost:5000/delete/repository/tag", {
        data: {
          repositoryId,
          repositoryTags
        }
      })
      dispatch("getAllRepositories")
    },
    async searchByQuery({commit}, query){
      const { data } = await axios.get(`http://localhost:5000/get/repository/${query}`)
      commit("setRepositories", data)
    },
    setSnackbar({ commit }, data) {
      commit('setSnackbar', data)
    },
  },
  getters: {
    getRepositories: state => state.repositories,
    getSnackbar: state => state.snackbar,
	  getSnackbarMsg: state => state.snackbarMsg,
  }
})
