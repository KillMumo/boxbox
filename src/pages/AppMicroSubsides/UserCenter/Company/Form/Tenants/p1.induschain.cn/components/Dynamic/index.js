import React from 'react'
import Card from '@/components/Card'
import { Icon } from 'antd'

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
