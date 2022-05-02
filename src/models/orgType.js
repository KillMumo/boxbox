import { getOrgType } from '@/services/common'

export default {
  namespace: 'orgType',

  state: {
    list: [],
    map: {},
    enum: {}
  },

  effects: {
    *fetchOrgType({ payload }, { call, put }) {
      const res = yield call(() => getOrgType({ prodCode: payload }))
      if (res instanceof Error) return
      yield put({
        type: 'saveOrgType',
        payload: res
      })
    }
  },

  reducers: {
    saveOrgType(state, { payload }) {
      const formatted = format(payload)
      state.list = payload
      state.map = formatted.map
      state.enum = formatted.enum
    }
  }
}

function format(list) {
  const res = {
    map: {},
    enum: {}
  }
  list.forEach((i) => {
    res.map[i.dictKey] = i.dictValue
    res.enum[i.dictValue] = i.dictKey
  })
  return res
}
