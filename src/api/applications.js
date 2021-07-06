import request from '@/utils/request'

export function getAllApplications(pageNumber, pageSize, licenseType) {
  return request({
    url: '/v1/licences/all',
    method: 'get',
    headers: {
      'content-type': 'application/json'
    }
  })
}

export function getApplicationById(data_id) {
  return request({
    url: `/v1/licences/get/${data_id}`,
    method: 'get'
  })
}

export function updateApplicationById(data, data_id) {
  return request({
    url: `/v1/licences/get/${data_id}`,
    method: 'get'
  })
}

