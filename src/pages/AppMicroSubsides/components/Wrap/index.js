import React from 'react'
import styles from './styles.less'

const Wrap = (props) => {
  const { title, children, hidden } = props

  if (hidden) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  )
}

export default Wrap
