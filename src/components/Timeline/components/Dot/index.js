import React from 'react'
import classnames from 'classnames'
import styles from './styles.less'

// type: primary || error
const Dot = ({ processing, type }) => {
  const className = classnames({
    [styles.container]: true,
    [styles.error]: !!processing && type === 'error',
    [styles.processing]: !!processing
  })

  return <span className={className} />
}

export default Dot
