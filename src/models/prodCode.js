export default {
  namespace: 'prodCode',

  state: fetchState('prodCode') || 'micro_subsidy',

  reducers: {
    changeProdCode: (_, { payload }) => {
      saveState(payload)
      return payload
    }
  }
}

export function saveState(state) {
  localStorage.setItem('prodCode', JSON.stringify(state))
}

export function fetchState() {
  const res = JSON.parse(localStorage.getItem('prodCode'))
  return res
}
