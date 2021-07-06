import { getEntityProductById, getLicenceProductById, getListOfLicenseCategories } from '@/api/configurations'
import { setLicenceCategories } from '@/utils/auth'

export default {
  namespaced: true,

  state: {
    licenceCategoryList: [],
    licenceProductId: '',
    licenceProduct: {},
    responseFound: false
  },

  mutations: {
    // RESET_STATE: (state) => {
    //   Object.assign(state, getDefaultState())
    // },
    SET_LICENCE_CATEGORIES: (state, licenceCategoryList) => {
      state.licenceCategoryList = licenceCategoryList
    },
    SET_LICENCE_PRODUCT_ID: (state, licenceProductId) => {
      state.licenceProductId = licenceProductId
    },
    SET_LICENCE_PRODUCT: (state, licenceProduct) => {
      state.licenceProduct = licenceProduct
    },
    RESET_LICENCE_PRODUCT: (state) => {
      state.licenceProduct = {}
      state.licenceProductId = ''
      state.responseFound = false
    },
    SET_LICENCE_PRODUCT_FOUND: (state, responseFound) => {
      state.responseFound = responseFound
    }
  },

  actions: {
    getLicenceCategoryRoots({ commit }) {
      return new Promise((resolve, reject) => {
        getListOfLicenseCategories('root', 0).then(response => {
          const { data } = response
          commit('SET_LICENCE_CATEGORIES', data)
          setLicenceCategories(data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getLicenceProductByLicenceProductId({ commit }, data_raw) {
      commit('SET_LICENCE_PRODUCT_FOUND', false)
      return new Promise((resolve, reject) => {
        getLicenceProductById(data_raw.id).then(response => {
          const { data } = response

          data.categoryID = data.category.id
          data.feeStructure = data.feeStructures
          data.feeStructure.forEach((item, index) => {
            item.feeCurrency = item.currency.id
            item.feeType = item.feeType.id
          })
          const temp = data.workflows
          data.workflows = temp.map(e => e.id)
          commit('SET_LICENCE_PRODUCT', data)
          commit('SET_LICENCE_PRODUCT_FOUND', true)

          resolve(data)
        }).catch(error => {
          commit('SET_LICENCE_PRODUCT_FOUND', true)
          reject(error)
        })
      })
    },
    getEntityProductByEntityProductId({ commit }, data_raw) {
      commit('SET_LICENCE_PRODUCT_FOUND', false)
      return new Promise((resolve, reject) => {
        getEntityProductById(data_raw.id).then(response => {
          const { data } = response
          data.feeStructure = data.feeStructures
          data.feeStructure.forEach((item, index) => {
            item.feeCurrency = item.currency.id
            item.feeType = item.feeType.id
          })
          const temp = data.workflows
          data.workflows = temp.map(e => e.id)
          commit('SET_LICENCE_PRODUCT', data)
          commit('SET_LICENCE_PRODUCT_FOUND', true)
          resolve(data)
        }).catch(error => {
          commit('SET_LICENCE_PRODUCT_FOUND', true)
          reject(error)
        })
      })
    }

  },

  getters: {
    getLicenceCategoryRootList: state => state.licenceCategoryList,
    LicenceCategoryRootConfigured: state => state.licenceCategoryList.length > 0,
    getLicenceProductId: state => state.licenceProductId,
    getLicenceProduct: state => state.licenceProduct,
    getResponseFound: state => state.responseFound
  }
}
