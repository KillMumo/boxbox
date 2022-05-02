import request from '@/utils/request'
import { stringify } from 'qs'

// 获取已申请列表
export function fetchHistoryList(params) {
  return request.get(`/matrix/flow/instance/startList?${stringify(params)}`)
}

// 获取可申请列表
export function fetchTodoList(params) {
  return request.get(`/matrix/flow/applyList?${stringify(params)}`)
}
