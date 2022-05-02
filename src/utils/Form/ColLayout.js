import React from 'react'
import { Col } from 'antd'
import DefaultLayout from './BlankLayout'

const ColLayout = (props) => {
  const { children, ...config } = props
  return (
    <Col span={12}>
      <DefaultLayout {...config}>{children}</DefaultLayout>
    </Col>
  )
}

export default ColLayout
