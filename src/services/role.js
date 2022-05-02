import request from '@/utils/request'
import { stringify } from 'qs'

export function tree(params) {
  return request('/matrix/authority/role/tree')
}

export function getRoleList(params) {
  return request.get(`/matrix/authority/role/list-tree?${stringify(params)}`)
}

// 菜单授权所有值
export async function getMenuGrantTree(params) {
  return request(`/matrix/menu/grant-tree?${stringify(params)}`)
}

// 获取已有的菜单权限
export async function getCheckedMenuTreeKeys(params) {
  return request(`/matrix/menu/role-tree-keys?${stringify(params)}`)
}

// 进行授权
export async function roleGrant(params) {
  return request.post('/matrix/authority/role/grant', {
    body: params,
    type: 'formData'
  })
}

export function deleteRole(id) {
  return request.delete(`/matrix/authority/role/delete/${id}`)
}

export function getRoleDetail(id) {
  return request.get(`/matrix/authority/role/get/${id}`)
}

export function addRole(params) {
  return request.post('/matrix/authority/role/create', {
    body: params
  })
}

export async function updateRole(params) {
  return request.put('/matrix/authority/role/update', {
    body: params
  })
}
