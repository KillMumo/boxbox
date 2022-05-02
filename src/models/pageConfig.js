import { fetchConfig } from '@/services/common'

export default {
  namespace: 'pageConfig',

  state: {},

  effects: {
    *fetchConfig(_, { call, put }) {
      // 获取hostname
      // const hostname = window.location.hostname
      const hostname = 'p2.induschain.cn'
      // domain参数：线上环境用hostname，本地用静态域名字符串，如：'p1.induschain.cn'
      const res = yield call(() => fetchConfig({ domain: hostname }))
      if (res instanceof Error) return
      yield put({
        type: 'saveConfig',
        payload: res
      })
    }
  },

  reducers: {
    saveConfig(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  }
}
