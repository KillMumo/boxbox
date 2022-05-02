const TOKEN_KEY = 'token_key'
const ORG_ID = 'orgId'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

export function saveOrgId(id) {
  localStorage.setItem(ORG_ID, JSON.stringify(id))
}

export function getOrgId() {
  return JSON.parse(localStorage.getItem(ORG_ID) || '""')
}

export function fetchToken() {
  return JSON.parse(localStorage.getItem(TOKEN_KEY) || '""')
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}
