import React, { useMemo, useState } from 'react'
import Card from '@/components/Card'
import PagingTable from '@/components/PagingTable'
import { Form, Table, Tag, Button } from 'antd'
import { useTable, useRequest } from '@dragon/hooks'
import { formatTime, formatMoney } from '@/utils'
import { fetchMineList, fetchSummary } from '@/services/carbon/mine'
import styles from './styles.less'
import { Link } from 'react-router-dom'

// const tabList = [
//   { key: '1', tab: '流水明细' },
//   { key: '2', tab: '兑换记录' }
// ]

const List = (props) => {
  // const [activeKey, setActiveKey] = useState('1')

  // 获取流水明细列表
  const { tableProps } = useTable(fetchMineList, {
    form: props.form
  })
  // 获取统计数据
  const { data: summary = {} } = useRequest(fetchSummary)

  //表头
  const columns1 = useMemo(() => {
    return [
      {
        title: '流水名',
        dataIndex: 'transferName',
        width: 200
      },
      {
        title: '类型',
        dataIndex: 'transferType',
        width: 120,
        render: (t) =>
          t === '兑换商品' ? (
            <Tag color="cyan">{t}</Tag>
          ) : t === '生成资产' ? (
            <Tag color="purple">{t}</Tag>
          ) : (
            <Tag color="geekblue">{t}</Tag>
          )
      },
      {
        title: '碳币额',
        dataIndex: 'amount',
        width: 120
      },
      {
        title: '交易时间',
        dataIndex: 'createTime',
        width: 120,
        render: (t) => formatTime(t)
      }
    ]
  }, [])

  //表头
  // const columns2 = useMemo(() => {
  //   return [
  //     {
  //       title: '订单号',
  //       dataIndex: 'id',
  //       width: 150
  //     },
  //     {
  //       title: '商品名称',
  //       dataIndex: 'name',
  //       width: 150
  //     },
  //     {
  //       title: '数量',
  //       dataIndex: 'count',
  //       width: 120
  //     },
  //     {
  //       title: '碳币额',
  //       dataIndex: 'amount',
  //       width: 120
  //     },
  //     {
  //       title: '兑换时间',
  //       dataIndex: 'date',
  //       width: 150,
  //       render: (t) => formatTime(t)
  //     }
  //   ]
  // }, [])

  // tab页
  // const tab = {
  //   '1': () => <PagingTable rowKey={(i) => i.id} columns={columns1} {...tableProps} />,
  //   '2': () => <PagingTable rowKey={(i) => i.id} columns={columns2} {...tableProps} />
  // }

  const renderCard = () => {
    return (
      <React.Fragment>
        <div className={styles.cardWrap}>
          <div className={styles.item}>
            <div>
              <span className={styles.span}>{'碳总资产(元)'}</span>
            </div>
            <div className={styles.word}>
              {formatMoney(summary.total)}
              <Button className={styles.btn}>
                <Link to={{ pathname: '/mine/list/trace' }}>查看轨迹</Link>
              </Button>
            </div>
          </div>
          <div className={styles.item}>
            <div>
              <span className={styles.span}>{'支出碳额(元)'}</span>
            </div>
            <div className={styles.word}>{formatMoney(summary.payment)}</div>
          </div>
          <div className={styles.item} style={{ marginRight: 0 }}>
            <div>
              <span className={styles.span}>{'收入碳额(元)'}</span>
            </div>
            <div className={styles.word}>{formatMoney(summary.income)}</div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  return (
    <Card transparent>
      {renderCard()}
      {/* <Card
        style={{ marginTop: 18 }}
        tabList={tabList}
        onTabChange={setActiveKey}
        defaultActiveTabKey="1"
      >
        {tab[activeKey]()}
      </Card> */}
      <Card title="流水明细" style={{ marginTop: 24 }}>
        <PagingTable rowKey={(i) => i.id} columns={columns1} {...tableProps} />
      </Card>
    </Card>
  )
}

export default Form.create()(List)
