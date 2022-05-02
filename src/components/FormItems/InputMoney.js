import React, { useState, useCallback, useEffect } from 'react'
import { Input } from 'antd'
import { cn } from 'nzh'
import styles from './styles.less'

// 只能输入数字或者两位小数的正则
const reg = /^\d+(\.\d{0,2})?$/

// 负数两位小数的正则
const negReg = /^(-)?([1-9]\d{1,7}|[0-9])?(\.\d{0,2}?)?$/

const format = (n) => cn.toMoney(n, { outSymbol: false })

// 用于输入钱数的input
// neg:是否支持负数
// isBottom: 大写是否展示在输入框下方
const InputMoney = React.forwardRef(
  ({ neg = false, isBottom = false, value = '', onChange, ...restProps }, ref) => {
    // 用于展示在popover中
    const [content, setContent] = useState(value)

    useEffect(() => {
      setContent(format(value))
    }, [value])

    const handleChange = useCallback(
      (e) => {
        const {
          target: { value }
        } = e
        if (neg) {
          // 可以输入正负数、两位小数
          if (negReg.test(value) || value === '') {
            setContent(format(value))
            onChange(value)
          }
        } else {
          // 只能输入正数或者两位小数
          if (reg.test(value) || value === '') {
            setContent(format(value))
            onChange(value)
          }
        }
      },
      [neg, onChange]
    )

    return (
      // <Popover
      //   content={<span style={{ color: 'red' }}>{content}</span>}
      //   placement="top"
      //   trigger="focus"
      //   ref={ref}
      // >
      isBottom ? (
        <div>
          <Input ref={ref} value={value} onChange={handleChange} {...restProps} />
          <div style={{ marginTop: '5px', lineHeight: '5px' }}>{content}</div>
        </div>
      ) : (
        <div className={styles.inputWrap}>
          <Input ref={ref} value={value} onChange={handleChange} {...restProps} />
          <div className={styles.content}>{content}</div>
        </div>
      )

      // </Popover>
    )
  }
)

export default InputMoney
