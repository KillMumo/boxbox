import React from 'react'
import { Table } from 'antd'
import IconFont from '@/components/IconFont'
import styles from '../styles.less'
const empty =
  '根据国内相关公开平台检索及产链区块链云服务平台数据自检索，未查询到相关信息。 不排除存在时间相对滞后未公示的情况，仅供参考。'

const ModalTable = ({ title, data, columns, size = 'small', id, companyName }) => {
  const handleData = (data) => {
    data && data.map((item, index) => (item.index = index + 1))
    return data
  }

  // 弹框信息公司名称标题
  const renderCompany = () => {
    return (
      <div style={{ display: 'flex', marginBottom: 10 }}>
        <IconFont type="iconqiyegailan" className={styles.icon} />
        <div className={styles.company}>{companyName}</div>
      </div>
    )
  }

  return (
    <div id={id}>
      {companyName && renderCompany()}
      <div className={styles.modalWrap}>
        <Table
          className="reportTable"
          locale={{ emptyText: empty }}
          columns={columns}
          dataSource={handleData(data)}
          size={size}
          scroll={{ y: 400 }}
          pagination={{
            showTotal: (total, range) =>
              data.length >= 50 ? <div style={{ fontSize: 12 }}>当前只展示最新50条</div> : '',
            hideOnSinglePage: true
          }}
        />
      </div>
    </div>
  )
}

export default ModalTable
