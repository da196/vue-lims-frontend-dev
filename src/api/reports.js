import request from '@/utils/request'

// List all Applications
export function getLicenceApplications(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/license-reports/applications?page=${pageNumber}&size=${pageSize}&keyword=${keyword}`,
    method: 'GET'
  })
}

// List all Applications
export function getLicenceReports(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/license-reports/licences?page=${pageNumber}&size=${pageSize}&keyword=${keyword}`,
    method: 'GET'
  })
}

// export function getLicenceReports(keyword = null, offset = null, pageNumber = null, pageSize = 10) {
//   return request({
//     url: 'v1/license-reports',
//     method: 'get',
//     params: {
//       keyword,
//       offset,
//       pageNumber,
//       pageSize
//     }
//   })
// }

export function getAllCharges() {
  return request({
    url: '/v1/bills/1/charges',
    method: 'get'
  })
}

export function getAllLicenceByLicenceStateAndKeyWord(pageNumber = 0, pageSize = 10, licenceState = 'All', keyword = 'All') {
  return request({
    url: 'v1/license-reports/licences/pageable',
    method: 'get',
    params: {
      keyword,
      licenceState,
      // offset,
      pageNumber,
      pageSize
    }
  })
}

export function exportApplicationsToExcel(fileName = 'LIMSApplications') {
  return request({
    url: `/v1/license-reports/export/applications-xlsx?fileName=${fileName}`,
    method: 'get',
    responseType: 'blob',
    headers: {
      'Content-Disposition': `attachment; filename=${fileName}.xlsx`,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  })
}

export function exportLicencesToExcel(fileName = 'LIMSLicences') {
  return request({
    url: `/v1/license-reports/export/licences-xlsx?fileName=${fileName}`,
    method: 'get',
    responseType: 'blob',
    headers: {
      'Content-Disposition': `attachment; filename=${fileName}.xlsx`,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  })
}

export function getLicenceMainReport(pageNumber = 0, pageSize = 10) {
  return request({
    url: `/v1/license-reports/main/licences?page=${pageNumber}&size=${pageSize}`,
    method: 'get'
  })
}

export function getLicenceApplicationMainReport(pageNumber = 0, pageSize = 10) {
  return request({
    url: `/v1/license-reports/main/applications?page=${pageNumber}&size=${pageSize}`,
    method: 'get'
  })
}
