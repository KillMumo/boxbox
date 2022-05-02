import React from 'react'
// import { SupplyRelationInfo as SupplyRelation } from '../Detail'
import { Table, Icon, Modal, Tabs as AntdTab, Empty as E } from 'antd'
import Tabs from '../Tabs'
import JumpCompany from '../JumpCompany'
import { formatMoney, isEmpty } from '@/utils'
import TabNum from '../Tabs/TabNum'
import { useBool } from '@dragon/hooks'
import { useState } from 'react'
import styles from './styles.less'
import DownloadItem from '@/components/DownloadItem'

const Empty = ({ files = [] }) => {
  if (!files?.length) {
    return <E image={E.PRESENTED_IMAGE_SIMPLE} />
  }

  return <DownloadItem list={files} />
}

const { TabPane } = Tabs

const List = ({ list = [], isSelf, orgName }) => {
  const [activeId, setActiveId] = useState('')
  const [activeKey, setActiveKey] = useState('购销合同')
  const [visible, { toggle }] = useBool(false)
  const [files, setFiles] = useState([])

  const renderFiles = (key, files, record) => {
    const openModal = () => {
      setActiveId(record.companyName)
      toggle(true)
      setActiveKey(key)
      setFiles(files)
    }

    if (!files?.length) {
      return '-'
    }

    return (
      <React.Fragment>
        <Icon style={{ marginRight: 8 }} type="folder" />
        <a onClick={() => openModal()}>附件（{files?.length || 0}）</a>
      </React.Fragment>
    )
  }

  const selfColumn = [
    {
      title: '企业全称',
      dataIndex: 'companyName',
      width: 202,
      render: (t) => <JumpCompany data={t} type="company" />
    },
    {
      title: '近一年交易金额(元)',
      dataIndex: 'lastTotalTrade',
      width: 185,
      align: 'right',
      render: (t) => formatMoney(t)
    },
    {
      title: '合作时长(月)',
      width: 129,
      dataIndex: 'cooperationTime',
      render: (text) => (isEmpty(text) ? '-' : text)
    },
    {
      title: '购销合同',
      width: 182,
      dataIndex: 'contractUrl',
      render: (t, r) => renderFiles('contractUrl', t, r)
    },
    {
      title: '发票',
      width: 182,
      dataIndex: 'invoice',
      render: (t, r) => renderFiles('invoice', t, r)
    },
    {
      title: '其他交易材料',
      width: 182,
      dataIndex: 'tradeMaterials',
      render: (t, r) => renderFiles('tradeMaterials', t, r)
    }
  ]

  const otherColumn = [
    {
      title: '企业全称',
      dataIndex: 'companyName',
      width: 480,
      render: (t) => <JumpCompany data={t} type="company" />
    },
    {
      title: '近一年交易金额(元)',
      dataIndex: 'lastTotalTrade',
      align: 'right',
      width: 282,
      render: (t) => formatMoney(t)
    },
    {
      title: ' ',
      key: 'blank',
      width: 200,
      render: () => ' '
    },
    {
      title: '占比',
      width: 283,
      dataIndex: 'proportion',
      render: (t) => (isEmpty(t) ? '-' : t)
    }
  ]

  const handleChange = (activeKey) => {
    const files = list.find((i) => i.companyName === activeId)[activeKey] || []
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
        <div className={styles.orgName}>
          <div className={styles.key}>企业全称</div>
          <div className={styles.value}>{orgName}</div>
        </div>
        <AntdTab
          className={styles.tab}
          onChange={handleChange}
          style={{ minHeight: 350 }}
          type="card"
          defaultActiveKey={activeKey}
        >
          <AntdTab.TabPane tab="购销合同" key="contractUrl">
            <Empty files={files || []} />
          </AntdTab.TabPane>
          <AntdTab.TabPane tab="发票" key="invoice">
            <Empty files={files || []} />
          </AntdTab.TabPane>
          <AntdTab.TabPane tab="其他交易材料" key="tradeMaterials">
            <Empty files={files || []} />
          </AntdTab.TabPane>
        </AntdTab>
      </Modal>
      <Table
        rowKey="companyName"
        columns={isSelf ? selfColumn : otherColumn}
        dataSource={list}
        pagination={false}
      />
    </React.Fragment>
  )
}

// 供销关系
const SupplyRelationInfo = ({ data = {}, topology, extra, orgName }) => {
  // 获取数据
  const {
    dataSource = 0,
    supplierSelf = [],
    clientSelf = [],
    supplierOther = [],
    clientOther = [],
    updateTimeOther,
    updateTimeSelf
  } = data

  const isSelf = dataSource === 0

  const renderTime = (time) => {
    return time || '暂无'
  }

  const supplierList = isSelf ? supplierSelf || [] : supplierOther || []
  const clientList = isSelf ? clientSelf || [] : clientOther || []

  return (
    <React.Fragment>
      <Tabs
        animated={false}
        tabBarExtraContent={
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,.65)' }}>
            <span>
              数据来源：
              <span style={{ marginRight: 24 }}>{isSelf ? '手动填报' : '授权导入'}</span>
              <span>{isSelf ? '更新时间' : '获取时间'}</span>：
              {isSelf ? renderTime(updateTimeSelf) : renderTime(updateTimeOther)}
            </span>
          </span>
        }
      >
        <TabPane tab={<TabNum num={supplierList.length}>供应商</TabNum>} key="供应商">
          <List isSelf={isSelf} list={supplierList} orgName={orgName} />
        </TabPane>
        <TabPane tab={<TabNum num={clientList.length}>客户</TabNum>} key="客户">
          <List isSelf={isSelf} list={clientList} orgName={orgName} />
        </TabPane>
      </Tabs>
      {topology && topology}
      {extra && extra}
    </React.Fragment>
  )
}

export default SupplyRelationInfo
