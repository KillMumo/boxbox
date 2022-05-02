import React, { useEffect, useMemo } from 'react'
import Card from '@/components/Card'
import { useRequest } from '@dragon/hooks'
// import { fetchDeviceDetail } from '@/services/carbon/carbonAccount'
import { fetchTraceDetail } from '@/services/carbon/mine'
import DescriptionList from '@/components/DescriptionList'
import { formatTime } from '@/utils'
import { Table, Tag } from 'antd'

const { Description } = DescriptionList

const View = (props) => {
  const {
    match: {
      params: { uid }
    }
  } = props

  // 获取碳币详情
  const { detailLoading, data: detail = {}, start: fetchDetail } = useRequest(fetchTraceDetail, {
    manual: true
  })

  // // 获取设备详情
  // const { detailLoading, data: deviceDetail = {}, start: fetchDetail } = useRequest(
  //   fetchDeviceDetail,
  //   {
  //     manual: true
  //   }
  // )

  // 获取设备流水
  // const { loading, data: traceList = {}, start: fetchData } = useRequest(fetchTraceList, {
  //   manual: true
  // })

  useEffect(() => {
    if (!!uid) {
      fetchDetail({ uid: uid })
      // fetchData({ traceId: uid })
    }
  }, [fetchDetail, uid])

  // const columns = useMemo(() => {
  //   return [
  //     {
  //       title: '描述',
  //       dataIndex: 'traceDesc',
  //       width: 120,
  //       ellipsis: true
  //     },
  //     {
  //       title: '碳币',
  //       dataIndex: 'assetToken',
  //       width: 120,
  //       ellipsis: true
  //     },
  //     {
  //       title: '链上哈希',
  //       dataIndex: 'hashCode',
  //       width: 120,
  //       ellipsis: true
  //     },
  //     {
  //       title: '创建时间',
  //       dataIndex: 'createTime',
  //       width: 120,
  //       ellipsis: true,
  //       render: (t) => formatTime(t)
  //     }
  //   ]
  // }, [])

  return (
    <Card transparent>
      <Card loading={detailLoading} title="溯源信息">
        <DescriptionList>
          <Description label="溯源ID">{detail?.uid}</Description>
          <Description label="资产名称">{detail?.assetName}</Description>
          <Description label="资产类型">{detail?.assetType}</Description>
          {/* <Description label="设备状态">
            {detail?.status === '未激活' ? (
              <Tag color="orange">{detail?.status}</Tag>
            ) : (
              <Tag color="green">{detail?.status}</Tag>
            )}
          </Description> */}
          <Description label="创建时间">{formatTime(detail?.createTime, 'ymd')}</Description>
          <Description label="更新时间">{formatTime(detail?.updateTime, 'ymd')}</Description>
          <Description label="链上哈希">{detail?.hashCode}</Description>
          <Description label="碳币">{detail?.assetToken}</Description>
          <Description label="扩展信息" whole>
            {detail?.extra}
          </Description>
        </DescriptionList>
      </Card>
      {/* <Card style={{ marginTop: '18px' }} title="设备流水" loading={loading}>
        <Table dataSource={traceList?.records} columns={columns} />
      </Card> */}
    </Card>
  )
}

export default View
