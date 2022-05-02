import request from '@/utils/request'
import { stringify } from 'qs'

// 租户列表
export async function getTenantList(params) {
  return request(`/matrix/system/tenant/list?${stringify(params)}`)
}

// 添加租户
export function addTenant(params) {
  return request.post('/matrix/system/tenant/create', {
    body: params
  })
}

//修改租户
export async function updateTenant(params) {
  return request.put('/matrix/system/tenant/update', {
    body: params
  })
}

// 租户详情
export function getTenantDetail(id) {
  return request(`/matrix/system/tenant/get/${id}`)
}

// 删除租户
export async function deleteTenant(id) {
  return request.delete(`/matrix/system/tenant/delete/${id}`)
}
