import request from '@/utils/request'

export function getAllClients() {
  return request({
    url: '/client/all',
    method: 'get'
  })
}

export function createClient(params) {
  return request({
    url: '/client/create',
    method: 'post',
    data: params
  })
}
export function getClientByRef(referenceNumber) {
  return request({
    url: `/client/get/${referenceNumber}`,
    method: 'get'
  })
}
export function getClientByParcelRef(referenceNumber) {
  return request({
    url: `/client/parcel/get/${referenceNumber}`,
    method: 'get'
  })
}
