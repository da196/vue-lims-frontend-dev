import request from '@/utils/request'

// TASK CONTROLLER

export function getAllTasks(pageNumber = 0, pageSize = 15, keyword = '') {
  return request({
    url: `v1/tasks/all?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}
export function getTasksById(id) {
  return request({
    url: `/v1/tasks/details/${id}`,
    method: 'get'
  })
}
export function getMyTasks(pageNumber = 0, pageSize = 15, keyword = '') {
  return request({
    url: `v1/tasks/my?page=${pageNumber}&size=${pageSize}&sort=id,DESC&keyword=${keyword}`,
    method: 'GET'
  })
}
export function saveActivity(data) {
  return request({
    url: `/v1/tasks/save-activity`,
    method: 'post',
    data
  })
}
export function saveActivityAttachment(data) {
  return request({
    url: `/v1/tasks/save-activity-attachment`,
    method: 'post',
    data
  })
}

