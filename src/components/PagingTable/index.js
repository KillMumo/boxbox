import React from 'react'
import { Table } from 'antd'
import TableFooter from './TableFooter'
import styles from './styles.less'

export default (props) => {
  const {
    setting, // 作用于table footer的数据
    ...restProps
  } = props

  return (
    <Table
      scroll={{ x: 1200 }}
      {...restProps}
      size="middle"
      className={styles.table}
      footer={() => (setting?.total ? <TableFooter setting={setting} /> : null)}
      pagination={false} // 自定义的pagination可扩展程度更高
    />
  )
}
