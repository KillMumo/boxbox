import React from 'react'
import { Tag } from 'antd'
import styles from './styles.less'

const Header = ({ children, color, name, extra }) => {
  return (
    <div className={styles.header}>
      {children}
      {name && <Tag color={color}>{name}</Tag>}
      {extra && <div className={styles.extra}>{extra}</div>}
    </div>
  )
}

export default Header
