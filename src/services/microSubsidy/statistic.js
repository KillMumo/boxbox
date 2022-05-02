import request from '@/utils/request'
import { stringify } from 'qs'

// 获取列表
export function fetchList(params) {
  return request.get(`/matrix/flow/guarantee/instance/statistic?${stringify(params)}`)
}

// 导出excel
export function fetchExcel(params) {
  return request.get(`/matrix/flow/guarantee/instance/statistic/exportExcel?${stringify(params)}`)
}

// 获取企业详情
export function fetchDetail(id) {
  return request.get(`/matrix/scm/company/detail/${id}`)
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

// 获取融资担保状态
export function fetchBizStatus(p) {
  return request.get(`/matrix/flow/guarantee/instance/bizStatus?${stringify(p)}`)
}
