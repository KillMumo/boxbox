const PAGE_CONFIG_KEY = 'page_config_key'

export function savePageConfig(state, key = PAGE_CONFIG_KEY) {
  localStorage.setItem(key, JSON.stringify(state))
}

export function fetchPageConfig(key = PAGE_CONFIG_KEY) {
  const res = JSON.parse(localStorage.getItem(key) || '{}')
  return res
}

export function removePageConfig(key = PAGE_CONFIG_KEY) {
  localStorage.removeItem(key)
}
