const INVITECODE_KEY = 'inviteCode_key'

export function saveInviteCode(state, key = INVITECODE_KEY) {
  localStorage.setItem(key, state)
}

export function fetchInviteCode(key = INVITECODE_KEY) {
  const res = localStorage.getItem(key) || ''
  return res
}

export function removeInviteCode(key = INVITECODE_KEY) {
  localStorage.removeItem(key)
}
