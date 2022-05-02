import request from '@/utils/request'
import { stringify } from 'qs'

// 查询关联企业信息
export function getOrgRelation(params) {
  return request.get(`/matrix/scm/orgRelation/get?${stringify(params)}`)
}
