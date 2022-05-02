import React from 'react'
import styles from './styles.less'

const SubCard = (props) => {
  const { children, title, style } = props
  return (
    <div className={styles.subCard} style={style}>
      <div className={styles.subtitle}>
        <span>{title}</span>
      </div>
      {children}
    </div>
  )
}

export default SubCard
