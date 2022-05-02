import request from '@/utils/request'
import { stringify } from 'qs'

// 参数列表
export async function getParamList(params) {
  return request(`/matrix/system/param/list?${stringify(params)}`)
}

// 添加参数
export function addParam(params) {
  return request.post('/matrix/system/param/create', {
    body: params
  })
}

//修改参数
export async function updateParam(params) {
  return request.put('/matrix/system/param/update', {
    body: params
  })
}

// 参数详情
export function getParamDetail(id) {
  return request(`/matrix/system/param/get/${id}`)
}

// 删除参数
export async function deleteParam(id) {
  return request.delete(`/matrix/system/param/delete/${id}`)
}
