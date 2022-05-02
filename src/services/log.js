import request from '@/utils/request'
import { stringify } from 'qs'

export function getLogApiList(params) {
  return request.get(`/matrix/log/api/list?${stringify(params)}`)
}

export function getLogErrorList(params) {
  return request.get(`/matrix/log/error/list?${stringify(params)}`)
}

export function getLogApiDetail(id) {
  return request.get(`/matrix/log/api/get/${id}`)
}

export function getLogErrorDetail(id) {
  return request.get(`/matrix/log/error/get/${id}`)
}
