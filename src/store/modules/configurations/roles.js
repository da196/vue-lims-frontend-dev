import { getAllPermissionList, updateRole } from '@/api/user'

export default {
  namespaced: true,

  state: {
    responselist: {},
    roleObject: {},
    status: '',
    permissions: [],
    loader: false
  },

  mutations: {
    // RESET_STATE: (state) => {
    //   Object.assign(state, getDefaultState())
    // },
    SET_RESPONSE_LIST: (state, responselist) => {
      state.responselist = responselist
    },
    SET_RESPONSE_OBJECT: (state, role) => {
      state.roleObject = role
    },
    ALL_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    LOADING: (state, loader) => {
      state.loader = loader
    }

  },

  actions: {
    update({ commit }, data, data_id) {
      return new Promise((resolve, reject) => {
        updateRole(data, data_id).then(response => {
          const { data } = response
          commit('SET_RESPONSE_OBJECT', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    getPermissionsList({ commit }) {
      return new Promise((resolve, reject) => {
        commit('LOADING', true)
        getAllPermissionList().then(response => {
          const { data } = response
          commit('ALL_PERMISSIONS', data.content)
          commit('LOADING', false)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },

  getters: {
    getRoleResponseList: state => state.responselist,
    getRoleObject: state => state.roleObject,
    isLoading: state => state.loader,
    getPerms: (state, actions, commit) => {
      if (state.permissions.length > 1) {
        return state.permissions
      } else {
        return undefined
      }
    }
  }
}
