import React from 'react'
import { Form, Row, Col } from 'antd'

export const RowLayout = (props) => {
  const { children, ...config } = props

  return (
    <Form.Item {...config.itemProps} style={{ marginBottom: 0 }}>
      <Row gutter={18}>{children}</Row>
    </Form.Item>
  )
}

export const ColLayout = (props) => {
  const { children } = props
  return <Col span={12}>{children}</Col>
}
