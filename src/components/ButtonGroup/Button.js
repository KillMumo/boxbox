import { useRequest } from '@dragon/hooks'
import { useEffect } from 'react'

const Button = ({ children, dynamic }) => {

  const { data: auth = false, start: fetchAuthReq } = useRequest(fetchAuth, {
    manual: true
  })

  useEffect(() => {
    if (dynamic) {
      fetchAuthReq(dynamic)
    }
  }, [dynamic, fetchAuthReq])

  if (!dynamic) return children
  return auth && children
}

export default Button

function fetchAuth() {
  return new Promise((r) => {
    setTimeout(() => {
      r(true)
    }, 1000)
  })
}
