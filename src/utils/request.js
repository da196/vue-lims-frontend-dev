import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'
import { statusCodes } from '@/utils/status-codes'
import { getKeyByValue } from '@/utils/index'

/* axios default headers for the below initiated instances */
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
//
axios.defaults.headers['Access-Control-Allow-Methods'] = 'POST, PUT, GET, OPTIONS, DELETE'
// axios.defaults.headers['Access-Control-Allow-Credentials'] = true
// axios.defaults.headers['Cache-Control'] = 'no-cache'
axios.defaults.headers['Access-Control-Max-Age'] = 3600
axios.defaults.headers['Access-Control-Allow-Headers'] = 'access-control-allow-credentials, access-control-allow-methods, authorization, cache-control, content-disposition'

// create an axios instance
const service = axios.create({
  'X-Requested-With': 'XMLHttpRequest',
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 120 * 1000, // request timeout
  crossDomain: true,
  validateStatus: () => true,
  headers: {
    'Content-Type': 'application/json'
  }

})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      if (getToken()) {
        config.headers['Authorization'] = 'Bearer ' + getToken()
      }
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

  /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
  response => {
    const res = response.data
    store.dispatch('app/setResponseHeaders', response.headers)

    // if the custom code is not 2000, it is judged as an error.
    if (response.status !== 200) {
      Message({
        message: res.message || getKeyByValue(statusCodes, res.code) || 'Error: ' + res.error,
        type: 'error',
        duration: 5 * 1000,
        showClose: true
      })

      if ((response.status || res.code) === 403 || res.code === statusCodes.RESTRICTED_ACCESS) {
        router.push({ name: '403' })
      }

      if ((response.status || res.code) === 401 || res.status === 401 || res.code === statusCodes.UNAUTHORIZED) {
        if (router.currentRoute.name !== 'login') {
          // to re-login
          store.dispatch('user/resetToken').then(() => {
            location.reload()
            this.$notify({
              title: 'Re-login',
              message: 'You have been logged out, login again to continue',
              duration: 0
            })
          })
          // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          //   confirmButtonText: 'Re-Login',
          //   cancelButtonText: 'Cancel',
          //   type: 'warning'
          // }).then(() => {
          //   store.dispatch('user/resetToken').then(() => {
          //     location.reload()
          //   })
          // }).catch(() => {
          //   store.dispatch('user/resetToken').then(() => {
          //     location.reload()
          //   })
          // })
        }
      }
      return Promise.reject(new Error('Error ' + res.error || res.message))
    } else {
      return res
    }
  },
  error => {
    // console.log(JSON.stringify(error))
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

