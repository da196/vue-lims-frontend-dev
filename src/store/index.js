import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import client from './modules/clients'
import country from './modules/country'
import roles from '@/store/modules/configurations/roles'
import permissions from '@/store/modules/permissions'
import licences from '@/store/modules/configurations/licences'
import licenceApplications from '@/store/modules/applications/licenceApplications'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    client,
    country,
    roles,
    licenceApplications,
    permissions,
    licences
  },
  getters
})

export default store
