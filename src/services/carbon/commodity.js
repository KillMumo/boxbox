import request from '@/utils/request'
import { stringify } from 'qs'

// 获取列表
export function fetchCommodityList(params) {
  return request.get(`/matrix/goods/list?${stringify(params)}`)
}

// 获取详情
export function fetchCommodityDetail(params) {
  return request.get(`/matrix/goods/detail?${stringify(params)}`)
}

//添加商品
export function addCommodity(params) {
  return request.post(`/matrix/goods/add`, {
    body: params
  })
}

//编辑商品
export function updateCommodity(params) {
  return request.post(`/matrix/goods/edit`, {
    body: params
  })
}

//商品兑换
export function exchangeCommodity(params) {
  return request.post(`/matrix/goods/exchange`, {
    body: params
  })
}

// 获取兑换记录
export function fetchCommodityRecords(params) {
  return request.get(`/matrix/goods/exchangeRecords?${stringify(params)}`)
}
