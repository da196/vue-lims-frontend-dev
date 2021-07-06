import Vue from 'vue'
/* import vue-idle */
import IdleVue from 'idle-vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
// import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/custom-description.scss'

import App from './App'
import store from './store'
import router from './router'
import * as filters from './filters' // global filters

import '@/icons' // icon
import '@/permission' // permission control
import permission from '@/directives/permissions/permission'
import apolloProvider from '@/utils/apollo'
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Idle session manager ..
const eventsHub = new Vue()
Vue.use(IdleVue, {
  eventEmitter: eventsHub, store,
  idleTime: 60_000 * 60, // 1 hour  = 60*60 seconds active session 60 *1000
  startAtIdle: false
})

Vue.config.productionTip = false
Vue.directive('permission', permission)
new Vue({
  el: '#app',
  router,
  store,
  apolloProvider,
  render: h => h(App),
  onIdle() {
    this.$store.dispatch('user/logout').then(r => {
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$store.dispatch('user/resetToken').then(() => {
        //       location.reload()
      })
      // location.reload()

      const notification = this.$notify({
        title: 'Session Expiry',
        message: 'You have been logged out. Login to continue.',
        type: 'warning',
        duration: 0
      })
      this.$store.commit('app/SET_GLOBAL_NOTIFICATION_INSTANCE', notification)
    })
  },
  onActive() {
    const notificationInstance = this.$store.getters['app/current_notification_instance']
    setTimeout(function() {
      notificationInstance.close()
    }, 5000) // close the dialog after 5 seconds on click
  }
}).$mount('#app')

