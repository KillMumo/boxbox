import request from '@/utils/request'
import { stringify } from 'qs'

// 获取企业列表
export function fetchEnterpriseList(params) {
  return request.get(`/matrix/scm/company/list?${stringify(params)}`)
}

// 平台企业导出excel
export function fetchEnterpriseExcel(params) {
  return request.get(`/matrix/scm/company/exportExcel?${stringify(params)}`, {
    type: 'FILE'
  })
}

// 获取企业详情
export function fetchDetail(id) {
  return request.get(`/matrix/scm/company/detail/${id}`)
}

// 审核机构列表
export function checkList(params) {
  return request.get(`/matrix/orgRegister/check/list?${stringify(params)}`)
}

// 审核机构详情
export function fetchAuthDetail(id) {
  return request.get(`/matrix/orgRegister/register/checkInfo/${id}`)
}

// 审核
export function auth(p) {
  return request.post('/matrix/orgRegister/check', {
    body: p
  })
}

//修改企业信息
export function updateEnterprise(params) {
  return request.post(`/matrix/flow/guarantee/instance/org/update`, {
    body: params
  })
}

// 获取融资列表
export function fetchFinanceList(params) {
  return request.get(`/matrix/flow/guarantee/instance/financingAllList?${stringify(params)}`)
}

// 添加企业
export function addCompany(params) {
  return request.post('/matrix/scm/company/create', {
    body: params
  })
}

// 更新企业
export function updateCompany(params) {
  return request.put('/matrix/scm/company/update', {
    body: params
  })
}

// 企业审核时间轴
export function fetchAuthTimeline(id) {
  return request.get(`/matrix/orgRegister/getChangeLog/${id}`)
}

// 企业详情时间轴
export function fetchCompanyTimeline(id) {
  return request.get(`/matrix/scm/company/getChangeLog/${id}`)
}

// 获取报告信息
export function fetchReport(p) {
  return request.get(`/matrix/data/report/query?${stringify(p)}`)
}

// 生成报告
export function generateReport(p) {
  return request.post('/matrix/data/report/generate', {
    body: p
  })
}

// 企业模糊搜索查详情
export function fetchClickedDetail(p) {
  return request.get(`/matrix/scm/company/detail?${stringify(p)}`)
}

//查询企业供销关系图
export function fetchSupplyDealerTopology(p) {
  return request(`/matrix/scm/company/supplyDealerTopology?${stringify(p)}`)
}

// 查询企业是否在平台注册
export function isRegistered(p) {
  return request(`/matrix/scm/company/registered?${stringify(p)}`)
}

// 获取第三方授权的数据
export function fetchOtherData(p) {
  return request.get(`/matrix/scm/company/supplierClient?${stringify(p)}`)
}
