import request from '@/utils/request'
import { stringify } from 'qs'

// 获取企业融资列表
export function fetchFinanceList(params) {
  return request.get(`/matrix/flow/guarantee/org/instance/financingSearchList?${stringify(params)}`)
}

// 导出excel
export function fetchFinanceExcel(params) {
  return request.get(
    `/matrix/flow/guarantee/org/instance/financingSearchList/exportExcel?${stringify(params)}`
  )
}

// 企业发起融资
export function startFinance(p) {
  return request.post('/matrix/flow/guarantee/org/instance/start', {
    body: p
  })
}

// 企业暂存
export function saveFinance(p) {
  return request.post('/matrix/flow/guarantee/org/instance/save', {
    body: p
  })
}

// 获取详情
export function fetchDetail(p) {
  return request.get(`/matrix/flow/guarantee/instance/detail?${stringify(p)}`)
}

// 删除
export function deleteOne(p) {
  return request.post(`/matrix/flow/guarantee/instance/delete`, {
    body: p
  })
}

// 企业名称模糊搜索-非企查查
export function fuzzySearch(p) {
  return request(`/matrix/scm/company/fuzzy?${stringify(p)}`)
}

// 获取企业对应的银行账号列表
export function getAccount(p) {
  return request(`/matrix/bankAccount/getAccount?${stringify(p)}`)
}

// 获取企业信息必填是否完整
export function isComplete(p) {
  return request(`/matrix/scm/company/getCompanyInfoLoan?${stringify(p)}`)
}

// 获取融资列表状态下拉框
export function bizStatusOption() {
  return request('/matrix/flow/guarantee/instance/search/bizStatusOption')
}
