import localStorage from 'store'
import { COUNTRY_LIST } from '@/store/mutation-types'
import { getCountriesList } from '@/api/countries'

export default {
  namespaced: true,
  state: {
    countries: {}
  },
  mutations: {
    SET_COUNTRIES: (state, countries) => {
      state.countries = countries
      localStorage.set(COUNTRY_LIST, countries)
    }
  },
  actions: {
    getCountries({ commit }) {
      if (localStorage.get(COUNTRY_LIST) !== []) {
        return null
      }
      return new Promise((resolve, reject) => {
        getCountriesList().then(response => {
          commit('SET_COUNTRIES', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters: {
    GetCountriesList: (state, actions) => {
      if (localStorage.get(COUNTRY_LIST) !== []) {
        return localStorage.get(COUNTRY_LIST)
      } else {
        actions.getCountries().then(() => {
          return this.state.countries
        })
      }
    }
  }
}
