import request from '@/utils/request'
import { stringify } from 'qs'

// 获取状态
export function fetchStatus() {
  return request.get('/matrix/status')
}

export function fetchParams(p) {
  return request.get(`/matrix/system/param/value?${stringify(p)}`)
}

// 获取oss token
export function getOssToken(params) {
  return request.get('/matrix/oss/sts')
}

// 获取机构类型
export function getOrgType(params) {
  return request.get(`/matrix/orgRegister/orgType?${stringify(params)}`)
}

// 获取省
export function fetchProvince() {
  return request.get('/matrix/bank/provinces')
}

// 获取市
export function fetchCity(params) {
  return request.get(`/matrix/bank/cities?${stringify(params)}`)
}

// 获取银行
export function fetchBankList(params) {
  return request.get(`/matrix/bank/list?${stringify(params)}`)
}

// 获取支行
export function fetchBranchBank(params) {
  return request.get(`/matrix/bank/branches?${stringify(params)}`)
}

// 获取企业自身信息
export function getSelfCheckInfo() {
  return request.get(`/matrix/organization/register/info`)
}

// 获取图片验证码
export function fetchGraph(params) {
  return request.get(`/matrix/code/graph?${stringify(params)}`)
}

// 企业模糊搜索的选中查详情
export function fetchCompanyMixInfo(params) {
  return request.get(`/matrix/flow/guarantee/instance/org/detail?${stringify(params)}`)
}

// 获取产品信息入产品名称、logo等
export function fetchProductInfo(p) {
  return request.get(`/matrix/product?${stringify(p)}`)
}

// 获取进度接口
export function fetchTimeline(p) {
  return request.get(`/matrix/flow/guarantee/instance/processList?${stringify(p)}`)
}

// 流程外的表单提交
export function submitFormOutFlow(p) {
  return request.post('/matrix/flow/guarantee/instance/submit', {
    body: p
  })
}

// 查询流程外的表单提交
export function fetchFormOutFlow(p) {
  return request.get(`/matrix/form/formList?${stringify(p)}`)
}

// 获取配置项
export function fetchConfig(params) {
  return request.get(`/matrix/v2/loginInfo?${stringify(params)}`)
}
