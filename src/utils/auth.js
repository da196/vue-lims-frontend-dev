import Cookies from 'js-cookie'
import { ACCESS_TOKEN, BROWSER_PERMITS, USER_EMAIL, LICENCE_CATEGORIES } from '@/store/mutation-types'
const engine = require('store/src/store-engine')
const storages = [
  require('store/storages/localStorage'),
  require('store/storages/cookieStorage')
]
const plugins = [
  require('store/plugins/defaults'),
  require('store/plugins/expire')
]

const store2 = engine.createStore(storages, plugins)

import store from '@/store/index'

const MINUTE_IN_MS = 60 * 1000
const tokenDuration = parseInt(process.env['VUE_APP_SESSION_EXPIRY_DURATION']) // in minutes
// eslint-disable-next-line no-unused-vars
const expireTime = new Date(new Date().getTime() + tokenDuration * 60 * 1000)

export function getToken() {
  return Cookies.get(ACCESS_TOKEN)
}

export function setToken(token) {
  return Cookies.set(ACCESS_TOKEN, token)
}

export function getEmail() {
  return store2.get(USER_EMAIL)
}

export function setEmail(email) {
  return store2.set(USER_EMAIL, email)
}

export function getLicenceCategories() {
  return store2.get(LICENCE_CATEGORIES)
}

export function setLicenceCategories(data) {
  return store2.set(LICENCE_CATEGORIES, data)
}

export function setPermissions(perms) {
  return store2.set(BROWSER_PERMITS, perms)
}

export function getPermissionsV2() {
  return store2.get(BROWSER_PERMITS)
}

export function removeAll() {
  store2.clearAll()
  Cookies.remove(ACCESS_TOKEN)
  // this.$store.dispatch('user/resetToken').then()
}

export async function setRefreshInterval() {
  const interval = parseInt(process.env['VUE_APP_REFRESH_INTERVAL'] ?? '50')

  let intervalRefreshData = await store.getters.intervalRef

  if (interval && !intervalRefreshData) {
    intervalRefreshData = setInterval(() => {
      store.dispatch('user/refreshToken')
      store.commit('user/SET_INTERVAL_REF', intervalRefreshData)
    }, interval * MINUTE_IN_MS)
  }
  return true
}
