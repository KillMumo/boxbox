import request from '@/utils/request'
import { stringify } from 'qs'

// 流程列表
export async function getFlowList(params) {
  return request(`/matrix/flow/list?${stringify(params)}`)
}

// 添加流程
export function addFlow(params) {
  return request.post('/matrix/flow/create', {
    body: params
  })
}

//修改流程
export async function updateFlow(params) {
  return request.put('/matrix/flow/update', {
    body: params
  })
}

// 流程详情
export function getFlowDetail(id) {
  return request(`/matrix/flow/get/${id}`)
}

// 删除流程
export async function deleteFlow(id) {
  return request.delete(`/matrix/flow/delete/${id}`)
}

// 部署流程
export async function deployFlow(id) {
  return request.post(`/matrix/flow/deploy/${id}`)
}

// 获取租户列表
export async function fetchTenant() {
  return request('/matrix/system/tenant/select')
}

// 激活流程
export async function activeFlow(id) {
  return request.post(`/matrix/flow/activate/${id}`)
}

// 挂起流程
export async function suspendFlow(id) {
  return request.post(`/matrix/flow/suspend/${id}`)
}

// 流程图
export async function fetchDiagram(id) {
  return request.get(`/matrix/flow/diagram/${id}`)
}
