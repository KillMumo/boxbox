import request from '@/utils/request'
import { stringify } from 'qs'

//菜单列表
export function getMenuList(params) {
  return request.get(`/matrix/menu/list-tree?${stringify(params)}`)
}

//删除菜单
export async function deleteMenu(ids) {
  return request.delete(`/matrix/menu/remove?${stringify(ids)}`)
}

// 批量删除菜单
export function deleteMultiMenu(params) {
  return request.delete(`/matrix/menu/remove?${stringify(params)}`)
}

//菜单详情
export async function getMenuDetail(id) {
  return request.get(`/matrix/menu/get/${id}`)
}

//菜单树
export async function getMenuTree(params) {
  return request.get(`/matrix/menu/grant-tree?${stringify(params)}`)
}

//添加菜单
export function addMenu(params) {
  return request.post(`/matrix/menu/create`, {
    body: params
  })
}

//修改菜单
export function updateMenu(params) {
  return request.put(`/matrix/menu/update`, {
    body: params
  })
}
