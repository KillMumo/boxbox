import request from '@/utils/request'
import { stringify } from 'qs'

// 机构列表
export function checkList(params) {
  return request.get(`/matrix/orgRegister/check/list?${stringify(params)}`)
}

// 获取详情
export function getCompanyDetail(id) {
  return request.get(`/matrix/orgRegister/orgInfo/${id}`)
}

// 机构审核
export function checkOrg(params) {
  return request.post('/matrix/orgRegister/check', {
    body: params
  })
}

// 获取关联企业类型下拉列表
export function fetchRelationOption(params) {
  return request.get(`/matrix/scm/orgRelation/get/relationtype?${stringify(params)}`)
}

// 获取关联企业下拉列表
export function fetchRelationList(params) {
  return request.get(`/matrix/orgRegister/relationorgs?${stringify(params)}`)
}

// 设置关联企业
export function setRelation(params) {
  return request.post('/matrix/scm/orgRelation/set', { body: params })
}
