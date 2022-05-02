import request from '@/utils/request'
import { stringify } from 'qs'

// 获取列表
export function fetchDeviceList(params) {
  return request.get(`/matrix/asset/list?${stringify(params)}`)
}

export function fetchCmyList(params) {}

export function fetchTypeList(params) {}

// 获取详情
export function fetchDeviceDetail(params) {
  return request.get(`/matrix/asset/detail?${stringify(params)}`)
}

//修改设备状态
export function updateStatus(params) {
  return request.post(`/matrix/device/change`, {
    body: params
  })
}

// 获取设备流水
export function fetchDeviceData(params) {
  return request.get(`/matrix/asset/dataList?${stringify(params)}`)
}

export function importExcel(params) {
  return request.post(`/matrix/common/form/excel`, {
    body: params,
    type: 'FILE'
  })
}
