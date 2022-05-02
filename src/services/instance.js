import request from '@/utils/request'
import { stringify } from 'qs'

// 代办列表
export function fetchTodoList(params) {
  return request.get(`/matrix/flow/instance/todoList?${stringify(params)}`)
}

// 已办列表
export function fetchDoneList(params) {
  return request.get(`/matrix/flow/instance/doneList?${stringify(params)}`)
}
