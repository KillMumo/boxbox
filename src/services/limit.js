import request from '@/utils/request'
import { stringify } from 'qs'

// 额度待审核列表
export function getLimitVerifyList(params) {
  return request.get(`/matrix/scm/creditLimit/verifyList?${stringify(params)}`)
}

// 额度复刻-同意
export function agreeLimit(params) {
  return request.post('/matrix/scm/creditLimit/agree', {
    body: params,
    type: 'formData'
  })
}

// 额度复刻-驳回
export function rejectLimit(params) {
  return request.post('/matrix/scm/creditLimit/reject', {
    body: params,
    type: 'formData'
  })
}

// 额度查询列表
export function getLimitQueryList(params) {
  return request.get(`/matrix/scm/creditLimit/queryList?${stringify(params)}`)
}

// 额度设置
export function getLimitSetList(params) {
  return request.get(`/matrix/scm/creditLimit/setList?${stringify(params)}`)
}

// 查询详情
export function fetchDetail(uid) {
  return request.get(`/matrix/scm/creditLimit/getDetail/${uid}`)
}

// 设置核心企业额度
export function setCoreLimit(params) {
  return request.post('/matrix/scm/creditLimit/setCoreLimit', {
    body: params,
    type: 'formData'
  })
}

// 设置成员/供应链企业额度
export function setSubLimit(params) {
  return request.post('/matrix/scm/creditLimit/setLimit', {
    body: params,
    type: 'formData'
  })
}
