import request from '@/utils/request'
import { stringify } from 'qs'

// 获取user列表
export function getUserList(params) {
  return request.get(`/matrix/user/manage/list?${stringify(params)}`)
}

// 添加user
export function addUser(params) {
  return request.post('/matrix/user/add', {
    body: params
  })
}

// 删除user
export function deleteUser(id) {
  return request.delete(`/matrix/user/delete/${id}`)
}

// 批量删除
export function deleteMultiUser(params) {
  return request.delete(`/matrix/user/remove?${stringify(params)}`)
}

// 根据id获取数据
export function getOneUser(id) {
  return request.get(`/matrix/user/get/${id}`)
}

// 更新数据
export function updateUser(params) {
  return request.put(
    `/matrix/user/modify?${stringify({
      roleIds: params.roleIds,
      position: params.position
    })}`,
    {
      body: params
    }
  )
}

// 用户授权
export async function grantUser(params) {
  return request(`/matrix/user/grant`, {
    method: 'POST',
    body: params,
    type: 'formData'
  })
}

export async function resetPassword(params) {
  return request.post('/matrix/user/reset-password', {
    body: {
      userIds: params.userIds.join(',')
    },
    type: 'formData'
  })
}

// 获取导入用户列表
export function getOrgUserList(params) {
  return request.get(`/matrix/user/orgUserList?${stringify(params)}`)
}

// 用户导入提交
export function importUser(params) {
  return request.post('/matrix/user/importUser', {
    body: params
  })
}
