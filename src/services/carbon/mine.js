import request from '@/utils/request'
import { stringify } from 'qs'

// 获取总览数据
export function fetchSummary(params) {
  return request.get(`/matrix/assetToken/summary?${stringify(params)}`)
}

// 获取列表
export function fetchMineList(params) {
  return request.get(`/matrix/assetToken/flowList?${stringify(params)}`)
}

// 获取详情
export function fetchTraceDetail(params) {
  return request.get(`/matrix/assetToken/traceDetail?${stringify(params)}`)
}

// 获取碳资产轨迹
export function fetchTraceData(params) {
  return request.get(`/matrix/assetToken/traceList?${stringify(params)}`)
}
