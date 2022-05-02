import request from '@/utils/request'
import { stringify } from 'qs'

// 第一步提交
export function submitStep1(params) {
  return request.post('/matrix/orgRegister/validateCheckInfo', {
    body: params
  })
}

//第二步提交
export function submitStep2(params) {
  return request.post('/matrix/orgRegister/submitCheckInfo', {
    body: params
  })
}

// 获取第二步银行信息
export function getBankInfo() {
  return request.get('/matrix/orgRegister/getBankInfo')
}
