import React from 'react'
import styles from './styles.less'

const TabNum = (props) => {
  const { num, children } = props
  return (
    <span>
      {children}
      <span className={styles.tabNum}>{num}</span>
    </span>
  )
}

export default TabNum
