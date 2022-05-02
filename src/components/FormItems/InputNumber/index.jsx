import React from 'react'
import { Input } from 'antd'
import './styles.less'
import { useCallback } from 'react'

// 只能输入数字或者两位小数的正则
const reg = /^\d+$/

const InputNumber = (props, ref) => {
  const { onChange, onBlur, addonAfter, noAddonAfter = false, ...restProps } = props

  const handleBlur = useCallback(
    (e) => {
      if (onBlur) {
        onBlur(e)
      }
    },
    [onBlur]
  )

  const handleChange = useCallback(
    (e) => {
      const {
        target: { value }
      } = e
      // 只能输入正数
      if (reg.test(value) || value === '') {
        onChange(value)
      }
    },
    [onChange]
  )

  return (
    <div className="d-input-number">
      <Input ref={ref} onChange={handleChange} onBlur={handleBlur} {...restProps} />
      <span className={noAddonAfter ? 'no-addon-after' : 'd-addon-after'}>{addonAfter}</span>
    </div>
  )
}

export default React.forwardRef(InputNumber)
