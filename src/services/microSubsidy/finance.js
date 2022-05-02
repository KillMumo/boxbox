import request from '@/utils/request'
import { stringify } from 'qs'

// 获取融资列表
export function fetchFinanceList(params) {
  return request.get(`/matrix/flow/guarantee/instance/financingSearchList?${stringify(params)}`)
}

// 融资列表excel
export function fetchFinanceExcel(params) {
  return request.get(
    `/matrix/flow/guarantee/instance/financingSearchList/exportExcel?${stringify(params)}`
  )
}

// 业务员发起融资
export function startFinance(p) {
  return request.post('/matrix/flow/guarantee/instance/start', {
    body: p
  })
}

// 业务员暂存
export function saveFinance(p) {
  return request.post('/matrix/flow/guarantee/instance/save', {
    body: p
  })
}

// 获取详情
export function fetchDetail(p) {
  return request.get(`/matrix/flow/guarantee/instance/detail?${stringify(p)}`)
}

// 通过
export function agree(p) {
  return request.post('/matrix/flow/guarantee/instance/agree', {
    body: p
  })
}

// 通过
export function reject(p) {
  return request.post('/matrix/flow/guarantee/instance/reject', {
    body: p
  })
}

// 删除
export function deleteOne(p) {
  return request.post(`/matrix/flow/guarantee/instance/delete`, {
    body: p
  })
}

// 企业名称模糊搜索
export function fuzzySearch(p) {
  return request(`/matrix/scm/company/fuzzy?${stringify(p)}`)
}

// 获取企业银行账号
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

// 财务计算
export function calculate(params) {
  return request.post('/matrix/flow/guarantee/instance/uploadFinancingInfo', {
    body: params
  })
}

// 根据银行账号获取银行账号详情
export function getBankAccountDetail(params) {
  return request(`/matrix/bankAccount/getOneAccount?${stringify(params)}`)
}

// 融资详情获取企业信息
export function getCompanyDetail(params) {
  return request(`/matrix/flow/guarantee/instance/orgInfo?${stringify(params)}`)
}

// 业务评估提交信息
export function startBusiness(params) {
  return request.post('/matrix/flow/guarantee/instance/updateExtra', {
    body: params
  })
}

// 业务评估保存信息
export function saveBusiness(params) {
  return request.post('/matrix/flow/guarantee/instance/submit', {
    body: params
  })
}

// 表单回显获取业务评估信息
export function fetchBusinessInfo(params) {
  return request(`/matrix/flow/guarantee/instance/formDetail?${stringify(params)}`)
}

// 获取业务评估信息
export function fetchBusiness(params) {
  return request(`/matrix/flow/guarantee/instance/bizEstimate?${stringify(params)}`)
}
