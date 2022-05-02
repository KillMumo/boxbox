import { fetchStatus } from '@/services/common'
import router from 'umi/router'

const statusMap = {
  '0': '', // 禁用
  '1': '', // 审核通过
  '2': '/auth/upload', // 注册未认证
  '3': '/auth/result', // 认证未审核
  '4': '/auth/result', // 待修改
  '5': '/auth/result' // 待修改
}

// 是否需要重置密码的map
const replaceMap = {
  first: {
    path: '/user/resetPassword'
  },
  reset: {
    path: '/user/resetPassword'
  }
}

export default {
  namespace: 'status',

  state: {
    reset: false,
    first: false,
    orgStatus: ''
  },

  effects: {
    *fetchStatus(_, { call, put }) {
      const res = yield call(fetchStatus)
      if (res instanceof Error) return
      yield put({
        type: 'saveStatus',
        payload: res
      })
      const statusTo = statusMap[res.orgStatus]

      if (statusTo) {
        router.replace(statusTo)
        return
      }
      const to = Object.keys(replaceMap).reduce((to, key) => {
        // if (!to && res[key] === true) {
        //   return replaceMap[key].path
        // }
        return to
      }, '')

      to && router.replace(to)
    },

    *fetchStatusReport(_, { call, put }) {
      const res = yield call(fetchStatus)
      if (res instanceof Error) return
      yield put({
        type: 'saveStatus',
        payload: res
      })
    }
  },

  reducers: {
    saveStatus: (_, { payload }) => {
      return payload
    }
  }
}
