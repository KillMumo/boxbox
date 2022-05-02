import React, { useState, useCallback, useEffect } from 'react'
import { DatePicker as D } from 'antd'
import moment from 'moment'

const DatePicker = React.forwardRef(({ value, onChange, ...props }, ref) => {
  // 作用在DatePicker上的值（是一个moment对象）
  const [v, set] = useState(() => {
    if (!value) return void 0
    return moment(value)
  })

  useEffect(() => {
    if (!value) return void 0
    const m = moment(value)
    if (m.isValid()) {
      set(moment(value))
    }
  }, [value])

  // 改变时：moment对象作用到DatePicker上，ds则onchange到form里面去
  const handleChange = useCallback(
    (d, ds) => {
      set(d)
      onChange(ds)
    },
    [onChange]
  )

  return <D style={{ width: '100%' }} value={v} ref={ref} onChange={handleChange} {...props} />
})

export default DatePicker
