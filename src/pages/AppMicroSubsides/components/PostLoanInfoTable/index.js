import React from 'react'
import { Table, Icon, Modal, Tabs as AntdTab, Empty } from 'antd'
// import Tabs from '../Tabs'
// import JumpCompany from '../JumpCompany'
// import { formatMoney } from '@/utils'
// import TabNum from '../Tabs/TabNum'
import { useBool } from '@dragon/hooks'
import { useState } from 'react'
import DownloadItem from '@/components/DownloadItem'

// const { TabPane } = Tabs

const List = ({ list = [] }) => {
  const [activeId, setActiveId] = useState('')
  const [activeKey, setActiveKey] = useState('资产证明')
  const [visible, { toggle }] = useBool(false)
  const [files, setFiles] = useState([])

  const renderFiles = (key, files, record) => {
    const openModal = () => {
      setActiveId(record.createTime)
      toggle(true)
      setActiveKey(key)
      setFiles(files)
    }

    return files?.length > 0 ? (
      <React.Fragment>
        <Icon style={{ marginRight: 8 }} type="folder" />
        <a onClick={() => openModal()}>附件（{files?.length || 0}）</a>
      </React.Fragment>
    ) : (
      '-'
    )
  }

  const column = [
    {
      title: '保后报告',
      dataIndex: 'postLoanFiles',
      width: 202,
      render: (t, r) => renderFiles('postLoanFiles', t, r)
    },
    {
      title: '其他材料',
      dataIndex: 'extraFiles',
      width: 185,
      render: (t, r) => renderFiles('extraFiles', t, r)
    },
    {
      title: '操作人',
      width: 129,
      dataIndex: 'opUserName'
    },
    {
      title: '操作时间',
      width: 182,
      dataIndex: 'createTime'
    },
    {
      title: '备注',
      width: 182,
      dataIndex: 'remark',
      render: (t, r) => t || '-'
    }
  ]

  const handleChange = (activeKey) => {
    const files = list.find((i) => i.createTime === activeId)[activeKey] || []
    setFiles(files)
  }

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        destroyOnClose
        title="查看附件"
        onCancel={() => toggle(false)}
        footer={null}
      >
        {/* <div className={styles.orgName}>
          <div className={styles.key}>企业全称</div>
          <div className={styles.value}>{orgName}</div>
        </div> */}
        <AntdTab
          //   className={styles.tab}
          onChange={handleChange}
          style={{ minHeight: 350 }}
          type="card"
          defaultActiveKey={activeKey}
        >
          <AntdTab.TabPane tab="保后报告" key="postLoanFiles">
            {files?.length > 0 ? (
              <DownloadItem list={files || []} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </AntdTab.TabPane>
          <AntdTab.TabPane tab="其他材料" key="extraFiles">
            {files?.length > 0 ? (
              <DownloadItem list={files || []} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </AntdTab.TabPane>
        </AntdTab>
      </Modal>
      <Table
        rowKey="createTime"
        columns={column}
        dataSource={list}
        pagination={false}
        style={{ marginBottom: 18 }}
      />
    </React.Fragment>
  )
}

// 保后报告
const PostLoanInfo = ({ data = {} }) => {
  return <List list={data} />
}

export default PostLoanInfo
