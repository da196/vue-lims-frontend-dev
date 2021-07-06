import request from '@/utils/request'

// USER ROLE CONTROLLER

// ATTACHMENT TYPE CONTROLLER

export function getAllAttachmentsTypeList(pageNumber = 0, pageSize = 10, keyword = '', sort = 'id,DESC') {
  return request({
    url: `/v1/attachment-types/list?page=${pageNumber}&size=${pageSize}&sort=${sort}&keyword=${keyword}`,
    method: 'get'
  })
}
export function getAttachmentTypeById(id) {
  return request({
    url: `/v1/attachment-types/${id}`,
    method: 'get'
  })
}
export function createAttachmentType(data) {
  return request({
    url: `/v1/attachment-types/save`,
    method: 'post',
    data
  })
}
export function updateAttachmentType(data) {
  return request({
    url: `/v1/attachment-types/update/${data.id}`,
    method: 'put',
    data
  })
}
export function deleteAttachmentType(id) {
  return request({
    url: `/v1/attachment-types/${id}`,
    method: 'delete'
  })
}

// ENTITY CATEGORY CONTROLLER

export function getAllEntityCategoriesList() {
  return request({
    url: '/v1/entity-category/list',
    method: 'get'
  })
}
export function getEntityCategoryById(id) {
  return request({
    url: `/v1/entity-category/${id}`,
    method: 'get'
  })
}
export function createEntityCategory(data) {
  return request({
    url: `/v1/entity-category/save`,
    method: 'post',
    data
  })
}
export function updateEntityCategory(data) {
  return request({
    url: `/v1/entity-category/save/${data.id}`,
    method: 'put',
    data
  })
}
export function getEntityCategoryLicenceeById(id) {
  return request({
    url: `/v1/entity-category/licencee/${id}`,
    method: 'get'
  })
}
export function getEntityCategoryLicenceeList() {
  return request({
    url: `/v1/entity-category/licencee/list`,
    method: 'get'
  })
}

// GEO LOCATION API CALLS
// Get  list of Geo location
// export function getAllGeolocationList() {
//   return request({
//     url: '/v1/geo-locations/list',
//     method: 'get'
//   })
// }

export function getAllGeolocationList(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/geo-locations/list?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}

// Save Geo location
export function createGeoLocation(data) {
  return request({
    url: '/v1/geo-locations/save',
    method: 'post',
    data
  })
}

// Update Geo location
export function updateGeoLocation(data) {
  return request({
    url: `/v1/geo-locations/${data.id}`,
    method: 'put',
    data
  })
}

// Delete Geo location
export function deleteGeoLocation(id) {
  return request({
    url: `/v1/geo-locations/${id}`,
    method: 'delete'
  })
}

// LIST OF VALUES CONTROLLER
// export function getAllListOfValueList() {
//   return request({
//     url: '/v1/list-of-Value/list',
//     method: 'get'
//   })
// }

export function getAllListOfValueList(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/list-of-Value/list-pegeable?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}

export function createListOfValue(data) {
  return request({
    url: '/v1/list-of-Value/save',
    method: 'post',
    data
  })
}
export function updateListOfValue(data) {
  return request({
    url: `/v1/list-of-Value/${data.id}`,
    method: 'put',
    data
  })
}
export function deleteListOfValue(id) {
  return request({
    url: `/v1/list-of-Value/${id}`,
    method: 'delete'
  })
}
export function getListOfValueByType(type) {
  return request({
    url: `/v1/list-of-Value/getByType/${type}`,
    method: 'get'
  })
}
export function getListOfListOfValueByParent(id) {
  return request({
    url: `/v1/list-of-Value/getChildValues/${id}`,
    method: 'get'
  })
}
export function getListOfValueById(id) {
  return request({
    url: `/v1/list-of-Value/${id}`,
    method: 'get'
  })
}

// License Category Controller
export function getAllLicenceCategoryList() {
  return request({
    url: '/v1/license-categories',
    method: 'get'
  })
}
export function getLicenceCategoryById(id) {
  return request({
    url: `/v1/license-categories/${id}`,
    method: 'get'
  })
}
export function createLicenceCategory(data) {
  return request({
    url: `/v1/license-categories/save`,
    method: 'post',
    data
  })
}
export function updateLicenceCategory(data) {
  return request({
    url: `/v1/license-categories/update/${data.id}`,
    method: 'put',
    data
  })
}
export function deactivateLicenceCategory(id) {
  return request({
    url: `/v1/license-categories/de-activate/${id}`,
    method: 'put'
  })
}
export function getLicenceCategoryByParentId(parentId) {
  return request({
    url: `/v1/license-categories/${parentId}/sub-services`,
    method: 'get'
  })
}
export function getLicenceCategoryRoots() {
  return request({
    url: `/v1/license-categories/root/list`,
    method: 'get'
  })
}
export function getListOfLicenseCategories(flag, parentId) {
  return request({
    url: `/v1/license-categories/list-query?flag=${flag}&parent=${parentId}`,
    method: 'get'
  })
}

// Licence Services Details Controller
export function getAllLicenceDetailsList(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/license-service-detail/list?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'get'
  })
}

// LICENCE FEE STRUCTURE API CALLS
// Get  list of Licence fee structure
export function getAllLicenceFeeStructureList(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/license-fees/list?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'get'
  })
}

// LICENCE SERVICES/DETAILS CONTROLLER
export function getLicenceDetailsById(id) {
  return request({
    url: `/v1/license-service-detail/${id}`,
    method: 'get'
  })
}
export function createLicenceDetails(data) {
  return request({
    url: `/v1/license-service-detail/save`,
    method: 'post',
    data
  })
}
export function updateLicenceDetails(data, id) {
  return request({
    url: `/v1/license-service-detail/update/${id}`,
    method: 'put',
    data
  })
}
export function deleteLicenceDetails(id) {
  return request({
    url: `/v1/license-service-detail/delete/${id}`,
    method: 'delete'
  })
}

// Licence Application Controller

export function getAllLicenceRootList() {
  return request({
    url: '/v1/p/license/category-roots',
    method: 'get'
  })
}
export function createLicenceFeeStructure(data) {
  return request({
    url: `/v1/license-fees/save`,
    method: 'post',
    data
  })
}

export function updateLicenceFeeStructure(data) {
  return request({
    url: `/v1/license-fees/update/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteLicenceFeeStructure(id) {
  return request({
    url: `/v1/license-fees/de-activate/${id}`,
    method: 'put'
  })
}

// Licence Products Resources
export function getLicenceProductsList(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/licence-products/list?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}

export function createLicenceProducts(data) {
  return request({
    url: '/v1/licence-products/save',
    method: 'post',
    data
  })
}
export function updateLicenceProducts(data, id) {
  return request({
    url: `/v1/licence-products/update/${id}`,
    method: 'put',
    data
  })
}
export function deleteLicenceProduct(id) {
  return request({
    url: `/v1/licence-products/de-activate/${id}`,
    method: 'put'
  })
}
export function getLicenceProductById(id) {
  return request({
    url: `/v1/licence-products/${id}`,
    method: 'get'
  })
}
export function getAllLicenseProducts() {
  return request({
    url: `/v1/licence-products/all`,
    method: 'get'
  })
}

// Entity Products Controller

export function getEntityProductsList(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/entity-products/list?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}
export function createEntityProducts(data) {
  return request({
    url: '/v1/entity-products/save',
    method: 'post',
    data
  })
}
export function updateEntityProducts(data) {
  return request({
    url: `/v1/entity-products/update/${data.id}`,
    method: 'put',
    data
  })
}
export function deleteEntityProduct(id) {
  return request({
    url: `/v1/entity-products/de-activate/${id}`,
    method: 'put'
  })
}
export function getEntityProductById(id) {
  return request({
    url: `/v1/entity-products/${id}`,
    method: 'get'
  })
}
export function getAllEntityProducts() {
  return request({
    url: `/v1/entity-products/all`,
    method: 'get'
  })
}

// WORKFLOW CONTROLLER
// export function getWorkflows() {
//   return request({
//     url: '/v1/workflows/list-active',
//     method: 'get'
//   })
// }

export function getWorkflows(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/workflows/list?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}

// findWorkflowById
export function getWorkflowsBy(Id) {
  return request({
    url: `/v1/workflows/${Id}`,
    method: 'get'
  })
}

export function createWorkflow(data) {
  return request({
    url: '/v1/workflows/save',
    method: 'post',
    data
  })
}

export function editWorkflow(id, data) {
  return request({
    url: `/v1/workflows/update/${id}`,
    method: 'put',
    data
  })
}
export function updateWorkflow(data) {
  return request({
    url: `/v1/license/update/${data.id}`,
    method: 'put',
    data
  })
}
export function activationWorkflow(id) {
  return request({
    url: `/v1/workflows/de-activate/${id}`,
    method: 'put'
  })
}
export function findWorkflowById(id) {
  return request({
    url: `/v1/workflows/${id}`,
    method: 'get'
  })
}

//  WORKFLOW TYPES CONTROLLER
export function getListOfActiveWorkflowType() {
  return request({
    url: '/v1/workflow-types/list-active',
    method: 'get'
  })
}

// START EXCHANGE RATE
//  1. CREATE EXCHANGE RATE
export function createExchangeRate(data) {
  return request({
    url: '/v1/exchange-rate/save',
    method: 'post',
    data
  })
}

//  2. GET LIST OF EXCHANGE RATE
export function getListOfExchangeRate(pageNumber, pageSize) {
  return request({
    url: `v1/exchange-rate/get-rates-pageable?page=${pageNumber}&size=${pageSize}&sort=id,DESC`,
    method: 'get'
  })
}

//  3. UPDATE EXCHANGE RATE
export function updateExchangeRate(data) {
  return request({
    url: `/v1/exchange-rate/${data.id}`,
    method: 'put',
    data
  })
}

//  4. DELETE EXCHANGE RATE
export function deleteExchangeRate(id) {
  return request({
    url: `/v1/exchange-rate/${id}`,
    method: 'delete'
  })
}
// 5. CALCULATE EXCHANGE RATE
export function calcExchangeRate(data) {
  return request({
    url: '/v1/exchange-rate/exchange',
    method: 'post',
    data
  })
}

// END EXCHANGE RATE

// Licence FORMS
// 1. CREATE Licence Form
export function createLicenceForm(data) {
  return request({
    url: '/v1/forms/save',
    method: 'post',
    data
  })
}

//  2. GET LIST OF Licence Form
export function getListOfLicenceForms() {
  return request({
    url: '/v1/forms/list',
    method: 'get'
  })
}

// 2.1 CREATE LICENCE FORM ITEM
export function createLicenceFormItem(data, id) {
  return request({
    url: `/v1/forms/save-item/${id}`,
    method: 'post',
    data
  })
}

// 2.2 GET LIST OF ITEMS IN LICENCE FORM
export function getLicenceFormsItem(data) {
  return request({
    url: `/v1/forms/${data}`,
    method: 'get'
  })
}

// 3. DEACTIVATE Licence Form
export function deactivateLicenceForm(id) {
  return request({
    url: `/v1/forms/de-activate/${id}`,
    method: 'put'
  })
}

// UPDATE License Form
export function updateLicenceForm(data) {
  return request({
    url: `/v1/forms/update/${data.id}`,
    method: 'put',
    data
  })
}

// Get Licence Form Parent
export function getAllLicenceFormParents(id) {
  return request({
    url: `/v1/forms/list-items/${id}`,
    method: 'post'
  })
}

// 4. CALCULATE Licence Form
export function calcLicenceForm(data) {
  return request({
    url: '/v1/licence-forms/exchangeTo-USD',
    method: 'post',
    data
  })
}

// START NOTIFICATION
// 1. CREATE NOTIFICATION
export function createNotification(data) {
  return request({
    url: `/v1/notification-template/save`,
    method: 'post',
    data
  })
}

// 2. GET LIST OF NOTIFICATION
export function getActiveListOfNotification() {
  return request({
    url: `/v1/notification-template/list?size=100`,
    method: 'get'
  })
}

export function getListOfNotification(pageNumber, pageSize, keyword = '') {
  return request({
    url: `/v1/notification-template/all?page=${pageNumber}&size=${pageSize}&keyword=${keyword}&sort=id,DESC`,
    method: 'get'
  })
}

// UPDATE NOTIFICATION
export function updateNotification(data) {
  return request({
    url: `/v1/notification-template/update/${data.id}`,
    method: 'put',
    data
  })
}

// 4. DEACTIVATE NOTIFICATION
export function deactivateNotification(id) {
  return request({
    url: `/v1/notification-template/de-activate/${id}`,
    method: 'put'
  })
}
// END NOTIFICATION

// ----- START LICENCE STATUS -------
// 1. CREATE LICENCE STATUS
export function createLicenceStatus(data) {
  return request({
    url: `/v1/status/save`,
    method: 'post',
    data
  })
}

// 2. GET ALL LIST OF LICENCE STATUS
export function getListOfLicenceStatus(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `v1/status/all?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}

// UPDATE LICENCE STATUS
export function updateLicenceStatus(data) {
  return request({
    url: `/v1/status/update/${data.id}`,
    method: 'put',
    data
  })
}

// 4. DEACTIVATE LICENCE STATUS
export function deactivateLicenceStatus(id) {
  return request({
    url: `/v1/status/de-activate/${id}`,
    method: 'put'
  })
}
// ----- END LICENCE STATUS -------
