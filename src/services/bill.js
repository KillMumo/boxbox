import request from '@/utils/request'

// 企业申请授信额度及融资费率
export function fetchBillFinance(params) {
  return request.get('/matrix/scm/token/apply/limitList')
}
