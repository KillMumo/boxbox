import request from '@/utils/request'
import { stringify } from 'qs'

// 字典列表
export function getDictList(params) {
  return request(`/matrix/dict/list-tree?${stringify(params)}`)
}

// 删除
export async function deleteDict(id) {
  return request.delete(`/matrix/dict/delete/${id}`)
}

// 查询详情
export function getDictDetail(id) {
  return request.get(`/matrix/dict/get/${id}`)
}

// 获取tree
export async function tree() {
  return request('/matrix/dict/tree')
}

// 添加字典
export async function addDict(params) {
  return request.post('/matrix/dict/create', {
    body: params
  })
}

// 更新字典
export async function updateDict(params) {
  return request.put('/matrix/dict/update', {
    body: params
  })
}

//  获取所有字典
export function fetchAllDict() {
  return request.get('/matrix/dict/global/list')
}

// 获取字典
export function fetchDict(params) {
  return request.get(`/matrix/dict?${stringify(params)}`)
}
// 根据id获得字典码
export function getDictCodeById(params) {
  return request.get(`/matrix/dict/getDictCode/?${stringify(params)}`)
}
