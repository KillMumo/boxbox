import request from '@/utils/request'
import { stringify } from 'qs'

export function fetchHome(p) {
  return request.get(`/matrix/homepage/list?${stringify(p)}`)
}
