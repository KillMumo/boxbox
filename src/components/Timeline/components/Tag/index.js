import React from 'react'
import className from 'classnames'
import styles from './styles.less'

// type: primary || error
const Tag = ({ children, type }) => {
  const classNames = className({
    [styles.container]: true,
    [styles.error]: type === 'error'
  })
  return <span className={classNames}>{children}</span>
}

export default Tag
