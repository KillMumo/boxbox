import React from 'react'
import classnames from 'classnames'
import { Col, Row } from 'antd'
import styles from './styles.less'
import { isEmpty } from '@/utils'

const columnMap = {
  1: { span: 24 },
  2: { span: 12 },
  3: { span: 8 },
  4: { span: 6 },
  6: { span: 4 }
}

//label：标签名称； whole：是否单独占据一行
const Description = ({ label, children, layout, column, whole, hideLabel }) => {
  const isVertical = layout === 'vertical'

  const rowClassName = classnames({
    [styles.rowContainer]: true,
    [styles.vertical]: isVertical
  })

  const labelClassName = classnames({
    [styles.label]: true,
    [styles.vertical]: isVertical
  })

  const col = whole
    ? {
        span: 24
      }
    : {}

  return (
    <Col {...columnMap[column]} {...col}>
      <Row type="flex" className={rowClassName}>
        {!hideLabel && <Col className={labelClassName}>{label}</Col>}
        <Col className={styles.value}>{isEmpty(children) ? '无' : children}</Col>
      </Row>
    </Col>
  )
}

export default Description
