import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  session_expiry: false,
  GlobalIdleNotificationInstance: '',
  response_headers: ''

}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TOGGLE_SESSION_EXPIRY: (state, session_expiry) => {
    state.session_expiry = session_expiry
  },
  SET_GLOBAL_NOTIFICATION_INSTANCE: (state, notificationInstance) => {
    state.GlobalIdleNotificationInstance = notificationInstance
  },
  SET_GLOBAL_RESPONSE_HEADERS: (state, response_headers) => {
    state.response_headers = response_headers
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  toggleSessionExpiry({ commit }, expired) {
    commit('TOGGLE_SESSION_EXPIRY', expired)
  },
  setResponseHeaders({ commit }, response_headers) {
    commit('SET_GLOBAL_RESPONSE_HEADERS', response_headers)
  }
}
const getters = {
  session_expiry: state => state.session_expiry,
  current_notification_instance: state => state.GlobalIdleNotificationInstance,
  response_headers: state => state.response_headers
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions

}
