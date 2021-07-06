import request from '@/utils/request'

// LICENCE CONTROLLER
export function getLicenceById(id) {
  return request({
    url: `/v1/license/${id}`,
    method: 'get'
  })
}

export function getLicencePageable(pageNumber = 0, pageSize = 15, licenceCategory = 0) {
  return request({
    url: `v1/license/list-non-draft?page=${pageNumber}&productid=0&rootid=${licenceCategory}&size=${pageSize}&sort=id,DESC`,
    method: 'GET'
  })
}

export function getLicencePageableWithDraft(pageNumber = 0, pageSize = 15) {
  return request({
    url: `v1/license/all?page=${pageNumber}&productid=0&size=${pageSize}&sort=id,DESC`,
    method: 'GET'
  })
}

// LICENCE TASK CONTROLLER
export function getMYLicenceTasks(pageNumber = 0, pageSize = 15, keyword = '') {
  return request({
    url: `v1/licence-tasks/my?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}
export function getNextActorsInTask(stepId, stepNumber) {
  return request({
    url: `v1/licence-tasks/next-actors?stepId=${stepId}&stepNumber=${stepNumber}"`,
    method: 'GET'
  })
}
export function getLicenceAndTasksById(id) {
  return request({
    url: `/v1/licence-tasks/details/${id}`,
    method: 'get'
  })
}

export function saveLicenceActivity(data) {
  return request({
    url: `/v1/licence-tasks/save-activity`,
    method: 'post',
    data
  })
}

export function saveActivityAttachment(data) {
  return request({
    url: `/v1/licence-tasks/save-activity-attachment`,
    method: 'post',
    data
  })
}

export function initiateCancellationOfLicence(data) {
  return request({
    url: `/v1/license/initiate-cancellation`,
    method: 'post',
    data
  })
}

export function getAllLicence(pageNumber = 0, pageSize = 15, keyword = '') {
  return request({
    url: `/v1/license/all?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}

export function getAllLicenceFees() {
  return request({
    url: `/v1/license-fees/list`,
    method: 'GET'
  })
}

export function getLicenceFeeStructure(id) {
  return request({
    url: `/v1/license-fees/${id}`,
    method: 'GET'
  })
}

export function getFeesByLicenceProduct(id) {
  return request({
    url: `/v1/license/${id}`,
    method: 'GET'
  })
}

export function getListOfPresentations(pageNumber = 0, pageSize = 15, keyword = '') {
  return request({
    url: `/v1/license/presentations?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}

export function getPresentationAttachmentById(id) {
  return request({
    url: `/v1/license/presentation-attachment/${id}`,
    method: 'GET'
  })
}

// Get All Active Entity
export function getActiveEntityPageable(pageNumber = 0, pageSize = 15, keyword = '') {
  return request({
    url: `/v1/licencee-entities/list-active?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}

export function getEntityDetailsById(entity_id) {
  return request({
    url: `/v1/licencee-entities/${entity_id}`,
    method: 'GET'
  })
}

export function getEntityNotificationsPageable(pageNumber = 0, pageSize = 15, keyword = '') {
  return request({
    url: `/v1/licencee-entities/notifications?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}
export function getEntityNotificationsById(entity_id) {
  return request({
    url: `/v1/licencee-entities/notifications/${entity_id}`,
    method: 'GET'
  })
}

// Get Licence Fees with FeeAbleType
export function getListFeeswithFeeableType(feeableType) {
  return request({
    url: `/v1/license-fees/list-by-feable-type?feeableType=${feeableType}`,
    method: 'GET'
  })
}

