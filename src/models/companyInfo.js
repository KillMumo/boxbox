import { getSelfCheckInfo } from '@/services/common'

const CompanyModel = {
  namespace: 'companyInfo',

  state: {
    companyInfo: {}
  },

  effects: {
    *fetchCompanyInfo(_, { call, put }) {
      const response = yield call(getSelfCheckInfo)
      if (response instanceof Error) return
      const { texts } = response
      yield put({
        type: 'saveCompany',
        payload: texts
      })
    }
  },

  reducers: {
    saveCompany(state, { payload: texts }) {
      return {
        ...state,
        companyInfo: {
          ...state.companyInfo,
          ...texts
        }
      }
    }
  }
}

export default CompanyModel
