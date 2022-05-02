const TEMP_STATE_KEY = 'temp_state_key'

export function saveState(state, key = TEMP_STATE_KEY) {
  sessionStorage.setItem(key, JSON.stringify(state))
}

export function fetchState(key = TEMP_STATE_KEY) {
  const res = JSON.parse(sessionStorage.getItem(key) || '{}')
  return res
}

export function removeState(key = TEMP_STATE_KEY) {
  sessionStorage.removeItem(key)
}
