import request from '@/utils/request'

export function getCountriesList() {
  return request({
    url: '/country/codes/all',
    method: 'get'
  })
}
export function getCountryById(param) {
  return request({
    url: `/country/get/${param}`,
    method: 'get'
  })
}
