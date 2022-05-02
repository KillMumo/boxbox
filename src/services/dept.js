import request from '@/utils/request'
import { stringify } from 'qs'

// 树
export async function tree(params) {
  return request('/matrix/org/selectTree')
}

// dept 列表
export async function getDeptList(params) {
  return request(`/matrix/org/tree?${stringify(params)}`)
}



// 添加机构
export function addDept(params) {
  return request.post('/matrix/org/add', {
    body: params
  })
}

export async function updateDept(params) {
  return request.put('/matrix/org/update', {
    body: params
  })
}

// 机构详情
export function getDeptDetail(id) {
  return request(`/matrix/org/get/${id}`)
}

// 删除
export async function deleteDept(id) {
  return request.delete(`/matrix/org/remove/${id}`)
}
