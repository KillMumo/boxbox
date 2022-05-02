import React from 'react'
import { isEmpty } from '@/utils'

export default React.forwardRef((props, ref) => {
  const { value, formatter = (v) => v } = props

  return <span ref={ref}>{formatter(isEmpty(value) ? '-' : value)}</span>
})
