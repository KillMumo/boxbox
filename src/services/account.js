import request from '@/utils/request'
import { stringify } from 'qs'
// import { stringify } from 'qs'

//首次修改密码
export function updatePasswordFirst(params) {
  return request.post(
    `/matrix/user/update-password-phone?${stringify(params)}`
    // return request.post('/matrix/user/update-password-phone', {
    //   body: params,
    //   type: 'formData'
    // }
  )
}
//右上角修改密码
export function updatePassword(params) {
  return request.post(`/matrix/user/update-password?${stringify(params)}`)
}

// 忘记密码第一步&&修改手机号第一步
export function forgetPwdStep1(p) {
  return request.post(`/matrix/user/checkCode?${stringify(p)}`)
}

// 忘记密码第二步
export function forgetPwdStep2(p) {
  return request.post(`/matrix/user/forget-password?${stringify(p)}`)
}

//修改手机号第二步
export function updatePhone(p) {
  return request.post(`/matrix/user/update-phone?${stringify(p)}`)
}
