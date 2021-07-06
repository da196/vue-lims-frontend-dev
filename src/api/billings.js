import request from '@/utils/request'

// start
export function getAllBillings(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/billing/getAllRevenue-pageable?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}
// end

export function getAllCharges() {
  return request({
    url: '/v1/bills/1/charges',
    method: 'get'
  })
}

export function createNewBilling(data) {
  return request({
    url: '/v1/billing/initiate-bill',
    method: 'post',
    data
  })
}

