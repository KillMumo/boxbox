import request from '@/utils/request'
import { stringify } from 'qs'

// 获取平台列表
export function getTpList() {
  return request.get('/matrix/tp/list')
}

// 平台切换
export function changeTp(params) {
  return request.post('/matrix/tp/change', {
    body: params
  })
}

// 添加平台
export function addTp(params) {
  return request.post('/matrix/tp/add', {
    body: params
  })
}

// 删除平台
export function deleteTp(params) {
  return request.post('/matrix/tp/remove', {
    body: params
  })
}

// 平台详情
export function tpDetail(params) {
  return request.get(`/matrix/tp/detail?${stringify(params)}`)
}
