export default {
  namespace: 'modifyPhone',

  state: {
    info: {}
  },

  reducers: {
    save: (state, { payload }) => {
      state.info = { ...state.info, ...payload }
    }
  }
}
