import request from '@/utils/request'

// Get values from Dashboard report for (Card part)
export function getDashboardReport() {
  return request({
    url: '/v1/dashboard-report/getSummary',
    method: 'get'
  })
}

// GET ALL LICENCES STATUS
export function getLicencesDashboardReport() {
  return request({
    url: '/v1/license-reports/licence-stats',
    method: 'get'
  })
}

// GET ALL APPLICATIONS STATUS
export function getApplicationsDashboardReport() {
  return request({
    url: '/v1/license-reports/appls-stats',
    method: 'get'
  })
}

// LIST OF APPLICATIONS WITH STATUS
export function getListApplicationswithStatus(stage) {
  return request({
    url: `/v1/license-reports/npg/applications?stage=${stage}`,
    method: 'get'
  })
}

// LIST OF ALL LICENCES
export function getAllLicencesDashboardReport() {
  return request({
    url: '/v1/license-reports/licences',
    method: 'get'
  })
}

// LIST PAGINATION LICENSES
export function getAllLicencesPagination(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/license-reports/licences?page=${pageNumber}&size=${pageSize}&keyword=${keyword}`,
    method: 'get'
  })
}

// GET LICENCE BY STATE
export function getListLicenceswithStatus(stage) {
  return request({
    url: `/v1/license-reports/npg/licences?state=${stage}`,
    method: 'get'
  })
}

// GET LIST OF ALL APPLICATIONS AND STAGES
export function getListApplicationsDashboardReport(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/license-reports/main/applications?page=${pageNumber}&size=${pageSize}&keyword=${keyword}`,
    method: 'get'
  })
}

// GET LIST OF ALL LICENSES AND STAGES
export function getListLicensesDashboardReport(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/license-reports/main/licences?page=${pageNumber}&size=${pageSize}&keyword=${keyword}`,
    method: 'get'
  })
}
