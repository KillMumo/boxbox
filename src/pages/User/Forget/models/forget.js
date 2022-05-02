export default {
  namespace: 'forget',

  state: {
    info: {}
  },

  reducers: {
    save: (state, { payload }) => {
      state.info = { ...state.info, ...payload }
    }
  }
}
