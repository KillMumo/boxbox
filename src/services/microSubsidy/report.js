import request from '@/utils/request'
import { stringify } from 'qs'

// 获取贷后监控数据
export function fetchReportList(p) {
  return request.get(`/matrix/data/report/detail?${stringify(p)}`)
}

// 获取列表详情
export function fetchReportDetail(p) {
  return request.get(`/matrix/data/task/detail?${stringify(p)}`)
}

// 获取行业数据
export function fetchIndustry() {
  return request.get(`/matrix/data/report/orgTable`)
}

// 获取融资担保状态
export function fetchBizStatus(p) {
  return request.get(`/matrix/flow/guarantee/instance/bizStatus?${stringify(p)}`)
}
