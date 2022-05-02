import React from 'react'
import { Table } from 'antd'
// import { scrollToAnchor } from '@/utils'
import styles from '../styles.less'
const empty = '未查询到相关信息'

const ReportTable = ({ title, data, columns, size = 'small', id, summary }) => {
  const handleData = (data) => {
    data && data.map((item, index) => (item.index = index + 1))
    return data
  }

  const handleDefendantNum = (data) => {
    let defendantNum = 0
    data?.length > 0 &&
      data.map((item, index) => {
        if (item.IsDefendant === true) {
          defendantNum += 1
        }
        return void 0
      })
    return (
      <>
        <span className={styles.summary}>原告:{data?.length - defendantNum}</span>
        <span className={styles.summary}>被告:{defendantNum}</span>
      </>
    )
  }

  return (
    <div style={{ marginBottom: 24 }} id={id}>
      <div className={styles.tableTitle}>
        {title}
        {summary && handleDefendantNum(data)}
      </div>
      <Table
        className="reportTable"
        style={{ marginTop: 16 }}
        locale={{ emptyText: empty }}
        columns={columns}
        dataSource={handleData(data)}
        size={size}
        scroll={{ scrollToFirstRowOnChange: true }}
        pagination={{
          showTotal: (total, range) =>
            data.length >= 50 ? <div style={{ fontSize: 12 }}>当前只展示最新50条</div> : '',
          hideOnSinglePage: true
        }}
      />
    </div>
  )
}

export default ReportTable
