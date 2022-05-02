import request from '@/utils/request'
import { stringify } from 'qs'

// 企业查询所有的银行账户
export function getAllBankList(params) {
  return request(`/matrix/bankAccount/list?${stringify(params)}`)
}

// 企业增加银行账户
export function addBankAccount(params) {
  return request.post('/matrix/bankAccount/create', {
    body: params
  })
}

// 修改默认银行账号
export function modifyBankNo(id) {
  return request.post(`/matrix/bankAccount/setDefault/${id}`, {
    body: id
  })
}
