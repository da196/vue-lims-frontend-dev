import request from '@/utils/request'

export function getListOfAllEntityApplications(pageNumber = 0, pageSize = 15, licenceCategory = 0) {
  return request({
    url: `v1/entity-applications/all?page=${pageNumber}&productid=0&rootid=${licenceCategory}&size=${pageSize}&sort=id,DESC`,
    method: 'GET'
  })
}
export function findEntityApplicationById(id) {
  return request({
    url: `/v1/entity-applications/${id}`,
    method: 'get'
  })
}
