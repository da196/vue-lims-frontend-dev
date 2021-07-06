import request from '@/utils/request'

// *** temporary for mock ***
export function getInfo(token) {
  return request({
    url: '/v1/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/v1/user/logout',
    method: 'post'
  })
}

export function login(data) {
  return request({
    url: '/v1/authenticate',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },
    data
  })
}

export function requestRefreshToken() {
  return request({
    url: `/v1/refresh-token`,
    method: 'get'
  })
}

export function getList(pageNumber = 0, pageSize = 10) {
  return request({
    url: `/v1/user/list?page=${pageNumber}&size=${pageSize}&sort=id,DESC`,
    method: 'get'
  })
}

export function getApplicantList(pageNumber = 0, pageSize = 10, keyword = '') {
  return request({
    url: `/v1/user/applicants-list?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}

export function getUserById(id) {
  return request({
    url: `/v1/user/${id}`,
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: `/v1/user/save`,
    method: 'post',
    data

  })
}

export function updateRolePermissions(data) {
  return request({
    url: `/v1/role/save-permissions`,
    method: 'post',
    data

  })
}

export function assignUserRole(userId, data) {
  return request({
    url: `v1/user/assign-role/${userId}`,
    method: 'put',
    data
  })
}

export function getAllRolesList() {
  return request({
    url: '/v1/role/list',
    method: 'get'
  })
}

export function getRoleById(id) {
  return request({
    url: `/v1/role/single/${id}`,
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: `/v1/role/save`,
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/v1/role/save/${data.id}`,
    method: 'put',
    data
  })
}

// PERMISSION LIST CONTROLLER
export function getPermissionListByGroup(groupName) {
  return request({
    url: `/v1/permission/list-group?group=${groupName}`,
    method: 'get'
  })
}

export function getAllPermissionList() {
  return request({
    url: `/v1/permission/list?page=0&size=2000&sort=id,DESC`,
    method: 'get'
  })
}

export function getPermissionById(id) {
  return request({
    url: `/v1/permission/${id}`,
    method: 'get'
  })
}
