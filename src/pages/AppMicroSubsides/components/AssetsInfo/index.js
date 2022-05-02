import React from 'react'
import { Table, Icon, Modal, Tabs as AntdTab, Empty } from 'antd'
import Tabs from '../Tabs'
// import JumpCompany from '../JumpCompany'
// import { formatMoney } from '@/utils'
import TabNum from '../Tabs/TabNum'
import { useBool } from '@dragon/hooks'
import { useState } from 'react'
// import styles from './styles.less'
import DownloadItem from '@/components/DownloadItem'

const { TabPane } = Tabs

const List = ({ list = [] }) => {
  const [activeId, setActiveId] = useState('')
  const [activeKey, setActiveKey] = useState('资产证明')
  const [visible, { toggle }] = useBool(false)
  const [files, setFiles] = useState([])

  const renderFiles = (key, files, record) => {
    const openModal = () => {
      setActiveId(record.id)
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
      title: '资产类型',
      dataIndex: 'propertyType',
      width: 202
      //   render: (t) => <JumpCompany data={t} type="company" />
    },
    {
      title: '资产证明',
      dataIndex: 'propertyCertificateFiles',
      width: 185,
      render: (t, r) => renderFiles('propertyCertificateFiles', t, r)
    },
    {
      title: '是否抵押',
      width: 129,
      dataIndex: 'isMortgaged'
    },
    {
      title: '抵押证明',
      width: 182,
      dataIndex: 'mortgageFiles',
      render: (t, r) => renderFiles('mortgageFiles', t, r)
    }
  ]

  const handleChange = (activeKey) => {
    const files = list.find((i) => i.id === activeId)[activeKey] || []
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
          <AntdTab.TabPane tab="资产证明" key="propertyCertificateFiles">
            {files?.length > 0 ? (
              <DownloadItem list={files || []} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </AntdTab.TabPane>
          <AntdTab.TabPane tab="抵押证明" key="mortgageFiles">
            {files?.length > 0 ? (
              <DownloadItem list={files || []} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </AntdTab.TabPane>
        </AntdTab>
      </Modal>
      <Table
        rowKey="id"
        columns={column}
        dataSource={list}
        pagination={false}
        style={{ marginBottom: 18 }}
      />
    </React.Fragment>
  )
}

// 资产信息
const AssetsInfo = ({ data = {} }) => {
  // 获取数据
  const { orgAssets = [], personAssets = [] } = data

  //   const supplierList = isSelf ? supplierSelf || [] : supplierOther || []
  //   const clientList = isSelf ? clientSelf || [] : clientOther || []

  return (
    <React.Fragment>
      <Tabs animated={false}>
        <TabPane tab={<TabNum num={orgAssets.length}>企业资产</TabNum>} key="企业资产">
          <List list={orgAssets} />
        </TabPane>
        <TabPane tab={<TabNum num={personAssets.length}>个人资产</TabNum>} key="个人资产">
          <List list={personAssets} />
        </TabPane>
      </Tabs>
    </React.Fragment>
  )
}

export default AssetsInfo
