import request from '@/utils/request'
import { stringify } from 'qs'

export function getInterfaceMenuList(params) {
  return request.get(`/matrix/menu/list-tree?${stringify(params)}`)
}

export function getInterfaceList(params) {
  return request.get(`/matrix/interface/list?${stringify(params)}`)
}

export function deleteInterface(id) {
  return request.delete(`/matrix/interface/delete/${id}`)
}

export function addInterface(params) {
  return request.post('/matrix/interface/create', {
    body: params
  })
}

export function updateInterface(params) {
  return request.put('/matrix/interface/update', {
    body: params
  })
}

// 查询详情
export function getInterfaceDetail(id) {
  return request.get(`/matrix/dict/get/${id}`)
}
