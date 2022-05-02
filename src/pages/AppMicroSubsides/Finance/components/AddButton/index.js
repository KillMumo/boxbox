import React from 'react'
import { Button, Row, Col } from 'antd'
import styles from './styles.less'

const AddButton = ({ children, extra, ...props }) => {
  return (
    // <Row>
    //   <Button icon="plus" {...props}>
    //     {children}
    //   </Button>
    //   <div className={styles.extra}>{extra}</div>
    // </Row>
    <Row className={styles.container}>
      <Col>
        <Button icon="plus" {...props}>
          {children}
        </Button>
        <div className={styles.extra}>{extra}</div>
      </Col>
    </Row>
  )
}

export default AddButton
