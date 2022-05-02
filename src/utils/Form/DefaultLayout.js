import React from 'react'
import { Form } from 'antd'

const DefaultLayout = (props) => {
  const { children, ...config } = props

  return <Form.Item {...config.itemProps}>{children}</Form.Item>
}

export default DefaultLayout
