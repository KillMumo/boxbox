import React from 'react'
import styles from './styles.less'
import useScrollToTop from '../BasicLayout/hooks/useScrollToTop'

const BlankLayout = (props) => {
  useScrollToTop(props.location)

  return <div className={styles.container}>{props.children}</div>
}

export default BlankLayout
