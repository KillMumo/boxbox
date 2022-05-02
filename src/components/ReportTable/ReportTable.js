import React from 'react'
import { Table } from 'antd'
import styles from './styles.less'

const ReportTable = ({ title, data, columns }) => {
  return (
    <div style={{ marginTop: 30 }}>
      <div className={styles.title}>{title}</div>
      <Table style={{ marginTop: 16 }} columns={columns} dataSource={data} />
    </div>
  )
}

export default ReportTable
