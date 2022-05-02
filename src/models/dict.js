import { fetchAllDict } from '@/services/dict'

export default {
  namespace: 'dict',

  state: {},

  effects: {
    *fetchDict(_, { call, put }) {
      const r = yield call(fetchAllDict)
      if (r instanceof Error) return
      const res = format(r)
      yield put({
        type: 'save',
        payload: res
      })
    }
  },

  reducers: {
    save: (_, { payload }) => {
      // 打印出字典，方便查询
      console.log(payload)
      return payload
    }
  }
}

// 转换字典
function format(arr) {
  const formatChildren = (cs) => {
    const parse = (v) => {
      let value
      try {
        value = JSON.parse(v)
      } catch (e) {
        value = v
      }
      return value
    }

    return cs.reduce((res, i) => {
      return {
        ...res,
        [i.dictKey]: parse(i.dictValue)
      }
    }, {})
  }

  return arr.reduce((res, item) => {
    return {
      ...res,
      [item.code]: item.children && formatChildren(item.children)
    }
  }, {})
}
