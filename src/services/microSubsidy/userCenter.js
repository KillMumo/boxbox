import request from '@/utils/request'

// 获取管理员企业信息
export function fetchDetailAdmin() {
  return request.get('/matrix/scm/company/adminInfo')
}

// 获取企业信息
export function fetchDetail(id) {
  return request.get(`/matrix/scm/company/detail/${id}`)
}

// 获取时间轴
export function fetchDetailTimeline(id) {
  return request.get(`/matrix/scm/company/getChangeLog/${id}`)
}
