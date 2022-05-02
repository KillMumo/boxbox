import React, { useCallback, useState } from 'react'
import { isNaN as isNan } from 'lodash'
import { Row, Col, Input, Select, Popover } from 'antd'
import types from './type'
import { cn } from 'nzh'

// 注册资本
// value 必须是 { coin: '', type: '' }
const InputPrice = React.forwardRef(({ value = {}, onChange, disabled }, ref) => {
  const { coin = '', type = '' } = value || {}

  // popover里面的内容
  const [content, setContent] = useState(coin)

  const triggerChange = useCallback(
    (changed) => {
      const result = {
        ...value,
        ...changed
      }
      onChange(result)
    },
    [onChange, value]
  )

  const handleInputChange = useCallback(
    (e) => {
      const regex = /^\d{0,4}$/
      const coin = e.target.value
      if (!isNan(+coin)) {
        const formatted = (coin * 10000).toFixed()
        console.log(formatted)
        setContent(cn.toMoney(formatted, { outSymbol: false }))
        if (regex.test(coin.split('.')[1] || '')) {
          triggerChange({ coin })
        }
        // triggerChange({ coin })
      }
    },
    [triggerChange]
  )

  const handleSelectChange = useCallback(
    (type) => {
      triggerChange({ type })
    },
    [triggerChange]
  )

  return (
    <Row ref={ref} gutter={18}>
      <Col span={14}>
        <Popover
          placement="top"
          trigger="focus"
          content={<span style={{ color: 'red' }}>{content}</span>}
        >
          <Input value={coin} onChange={handleInputChange} disabled={disabled} />
        </Popover>
      </Col>
      <Col span={10}>
        <Select value={type} onChange={handleSelectChange} disabled={disabled}>
          {types.map((i) => (
            <Select.Option key={i} value={i}>
              {i}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  )
})

export default InputPrice
