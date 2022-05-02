import React from 'react'
import styles from './styles.less'

const Panel = ({ children, title }) => {
  return (
    <div className={styles.container}>
      {title && (
        <div className={styles.title}>
          <span>{title}</span>
          <div />
        </div>
      )}
      {children}
    </div>
  )
}

export default Panel
