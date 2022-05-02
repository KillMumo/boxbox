import React from 'react'
import { Tabs as T } from 'antd'
import styles from './styles.less'

const { TabPane } = T

const Tabs = (props) => {
  const { children, ...restProps } = props

  return (
    <div className={styles.tab}>
      <T {...restProps}>{children}</T>
    </div>
  )
}

Tabs.TabPane = TabPane

export default Tabs
