import request from '@/utils/request'
import { stringify } from 'qs'

// 发送验证码
export function sendVerifyCode(params) {
  return request.get(`/matrix/code/phone?${stringify(params)}`)
}

// 企业信息模糊搜索
export function fetchCompanyInfo(params) {
  return request.get(`/matrix/org/getNameByName?${stringify(params)}`)
}
// export function fetchCompanyInfo(params) {
//   return request.get(`/matrix/orgRegister/fuzzy?${stringify(params)}`)
// }

// 模糊搜索查详情
export function fetchCompanyDetail(params) {
  return request.get(`/matrix/org/getAllByName?${stringify(params)}`)
}

export function fetchCompanyDetail2(params) {
  return request.post('/matrix/common/biz/handle', {
    body: {
      ...params,
      scenario: 'auth_query_asset'
    }
  })
}

// export function fetchCompanyDetail(params) {
//   return request.get(`/matrix/orgRegister/detail?${stringify(params)}`)
// }

// 第一步提交
export function submitStep1(params) {
  return request.post('/matrix/orgRegister/register/validate', {
    body: params
  })
}

// 第二步提交
export function submitStep2(params) {
  return request.post('/matrix/orgRegister/register/submit', {
    body: params
  })
}

// 上传认证资料
export function authUpload(params) {
  return request.post('/matrix/orgRegister/register/upload', {
    body: params
  })
}

// 获取注册信息
export function fetchRegisterInfo(params) {
  return request.get('/matrix/orgRegister/register/info')
}

// 获取注册状态信息
export function fetchAuthInfo(params) {
  return request.get('/matrix/orgRegister/checkStatus')
}

// 注册提交
export function submit(params) {
  return request.post('/matrix/orgRegister/v2/register/submit', {
    body: {
    ...params,
    isEdit:false
  }
  })
}

// 获取注册信息用于认证回显
export function fetchRegisterInfoForAuth() {
  return request.get('/matrix/orgRegister/getCheckInfo')
}
