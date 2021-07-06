import { login, getInfo, requestRefreshToken } from '@/api/user'
import {
  getToken,
  removeAll,
  setEmail,
  setLicenceCategories,
  setPermissions,
  setRefreshInterval,
  setToken
} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    email: '',
    routesConfigured: false,
    intervalRef: ''

  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  CONFIGURE_ROUTES: (state, routesConfigured) => {
    state.routesConfigured = routesConfigured
  },
  SET_INTERVAL_REF: (state, intervalRef) => {
    state.intervalRef = intervalRef
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        setEmail(data.email)
        setToken(data.token.split(' ')[1])
        setPermissions(data.permissions)
        setLicenceCategories(data.categories)
        commit('SET_TOKEN', data.token)
        commit('SET_EMAIL', data.email)
        commit('SET_AVATAR', data.email)
        commit('SET_NAME', data.email)
        commit('CONFIGURE_ROUTES', false)
        // setRefreshInterval()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  configureRoutes({ commit, state }, routeConfiguration) {
    return new Promise((resolve, reject) => {
      commit('CONFIGURE_ROUTES', routeConfiguration)
      resolve(routeConfiguration)
    }).catch(_ => {
    })
  },

  configureRefresh({ commit, state }) {
    return new Promise(resolve => {
      if (!state.intervalRef && state.token !== undefined) {
        setRefreshInterval()
      }
      resolve(true)
    })
  },

  refreshToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.token !== undefined) {
        requestRefreshToken({}).then(response => {
          const { data } = response

          setToken(data.split(' ')[1])

          console.log(response)
        })
      }
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, _) => {
      removeAll() // must remove  token  first
      commit('RESET_STATE')
      window.clearInterval(state.intervalRef)
      resetRouter()
      resolve()
    }).catch(error => {
      removeAll() // must remove  token  first
      commit('RESET_STATE')
      resetRouter()
      window.clearInterval(state.intervalRef)
      // eslint-disable-next-line no-undef
      reject(error)
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeAll() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

