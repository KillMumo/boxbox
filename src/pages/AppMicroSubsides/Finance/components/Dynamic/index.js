import React from 'react'
// import styles from './styles.less'
import { Icon } from 'antd'
import Card from '@/components/Card'

const Dynamic = (props) => {
  const {
    children,
    title,
    // length,
    deleteItem
  } = props
  return (
    <Card.SubCard
      title={
        <>
          {title}
          {deleteItem && <Icon onClick={deleteItem} type="delete" />}
        </>
      }
    >
      {children}
    </Card.SubCard>
  )
}

export default Dynamic
