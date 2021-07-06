import { getAllApplications, getApplicationById, updateApplicationById } from '@/api/applications'

const getDefaultState = () => {
  return {
    responseList: {},
    applicationObject: {},
    status: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_RESPONSE_LIST: (state, responseList) => {
    state.responseList = responseList
  },
  SET_RESPONSE_OBJECT: (state, role) => {
    state.applicationObject = role
  }
}

const actions = {
  getAll({ commit }, pageNumber, pageSize, licenseType) {
    return new Promise((resolve, reject) => {
      getAllApplications(pageNumber, pageSize, licenseType).then(response => {
        const { data } = response
        commit('SET_RESPONSE_LIST', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  update({ commit }, data, data_id) {
    return new Promise((resolve, reject) => {
      updateApplicationById(data, data_id).then(response => {
        const { data } = response
        commit('licenceApplications/SET_RESPONSE_OBJECT', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getById({ commit }, data_id) {
    return new Promise((resolve, reject) => {
      getApplicationById(data_id).then(response => {
        const { data } = response
        commit('SET_RESPONSE_OBJECT', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

const getters = {
  getLicenseResponseList: state => state.responseList,
  getLicenseResponseObject: state => state.applicationObject

}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

