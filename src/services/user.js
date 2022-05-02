import request from '@/utils/request'
import { stringify } from 'qs'

// 预登陆
export function preLogin(p) {
  return request.post('/matrix/preLogin', {
    body: p
  })
}

// 用户登录
export function login(params) {
  return request.post('/matrix/login', {
    body: params,
    type: 'JSON'
  })
}

// 用户注销
export function logout() {
  return request.get('/matrix/logout')
}

// token获取用户信息
export function fetchUser() {
  return request('/matrix/user/info')
}

// 获取权限
export function fetchAuthorities() {
  return request('/matrix/menu/authorities')
}

// token获取用户菜单
export function fetchMenu() {
  return request('/matrix/menu/routes')
}

// token获取按钮数据
export function fetchButtons() {
  return request('/matrix/menu/buttons')
}

// 获取机构当前状态
export function fetchOrgStatus(params) {
  return request.get('/matrix')
}

// 小微的登录接口
export function msLogin(params) {
  return request.post('/matrix/v2/login', {
    body: params,
    type: 'JSON'
  })
}
