import request from '@/utils/request'
import { stringify } from 'qs'

// 国投获取贷后管理列表
export function fetchPostLoanList(p) {
  return request.get(`/matrix/flow/guarantee/instance/loanSearchList?${stringify(p)}`)
}

// 导出excel
export function fetchExcel(p) {
  return request.get(`/matrix/flow/guarantee/instance/loanSearchList/exportExcel?${stringify(p)}`)
}

// 国投获取贷后监控列表
export function fetchMonitorList(p) {
  return request.get(`/matrix/data/warning/guarantee/list?${stringify(p)}`)
}

// 企业获取贷后管理列表
export function fetchCompanyPostLoanList(p) {
  return request.get(`/matrix/flow/guarantee/org/instance/loanSearchList?${stringify(p)}`)
}

// 企业导出excel
export function fetchCompanyExcel(p) {
  return request.get(
    `/matrix/flow/guarantee/org/instance/loanSearchList/exportExcel?${stringify(p)}`
  )
}

// 贷后监控导出Excel
export function fetchMonitorExcel(params) {
  return request.get(`/matrix/data/warning/guarantee/exportExcel?${stringify(params)}`)
}
