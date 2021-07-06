
import { getAllClients, getClientByParcelRef, getClientByRef, createClient } from '@/api/clients'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    ResponseList: {},
    loading: false
  }
}

const state = getDefaultState()
const mutations = {
  RESPONSE_LIST: (state, ResponseList) => {
    state.ResponseList = ResponseList
  }
}
const actions = {
  ClientCreate({ commit }, clientInfo) {
    commit('RESPONSE_LIST', {})
    return new Promise((resolve, reject) => {
      createClient(clientInfo).then(response => {
        commit('RESPONSE_LIST', response.data.data)

        var res = response
        this.ClientGetAll()
        if (res.code === 200) {
          Message({
            message: res.message,
            type: 'success',
            duration: 5 * 1000
          })
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  ClientGetAll({ commit }, pageSize, PageNumber) {
    commit('RESPONSE_LIST', {})
    return new Promise((resolve, reject) => {
      getAllClients(pageSize, PageNumber).then(response => {
        commit('RESPONSE_LIST', response.data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  getClientByReferenceNumber({ commit }, referenceNumber) {
    commit('RESPONSE_LIST', {})
    return new Promise((resolve, reject) => {
      getClientByRef(referenceNumber).then(response => {
        commit('RESPONSE_LIST', response.data.data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  getClientByParcelReference({ commit }, referenceNumber) {
    commit('RESPONSE_LIST', {})
    return new Promise((resolve, reject) => {
      getClientByParcelRef(referenceNumber).then(response => {
        commit('RESPONSE_LIST', response.data.data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }

}

const getters = {
  GetClientResponse: state => state.ResponseList

}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}

