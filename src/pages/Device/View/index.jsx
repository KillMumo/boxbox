import React, { useEffect, useMemo } from 'react'
import Card from '@/components/Card'
import { useRequest } from '@dragon/hooks'
import { fetchDeviceDetail, fetchDeviceData } from '@/services/carbon/device'
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

  // 获取设备详情
  const { detailLoading, data: deviceDetail = {}, start: fetchDetail } = useRequest(
    fetchDeviceDetail,
    {
      manual: true
    }
  )

  // 获取设备流水
  const { loading, data: deviceData = {}, start: fetchData } = useRequest(fetchDeviceData, {
    manual: true
  })

  useEffect(() => {
    if (!!uid) {
      fetchDetail({ uid: uid })
      fetchData({ uid: uid })
    }
  }, [fetchDetail, fetchData, uid])

  const columns = useMemo(() => {
    return [
      {
        title: '链上哈希',
        dataIndex: 'uid',
        width: 80,
        ellipsis: true
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 80,
        ellipsis: true,
        render: (t) => formatTime(t)
      },
      {
        title: '数据信息',
        dataIndex: 'extra',
        width: 200,
        ellipsis: true
      }
    ]
  }, [])

  return (
    <Card transparent>
      <Card loading={detailLoading} title="基本信息">
        <DescriptionList>
          <Description label="设备ID">{deviceDetail?.uid}</Description>
          <Description label="设备名称">{deviceDetail?.assetName}</Description>
          <Description label="设备类型">{deviceDetail?.assetType}</Description>
          <Description label="设备状态">
            {deviceDetail?.status === '未激活' ? (
              <Tag color="orange">{deviceDetail?.status}</Tag>
            ) : (
              <Tag color="green">{deviceDetail?.status}</Tag>
            )}
          </Description>
          <Description label="创建时间">{formatTime(deviceDetail?.createTime, 'ymd')}</Description>
          {/* <Description label="激活时间">{formatTime(deviceDetail?.enableDate, 'ymd')}</Description> */}
          <Description label="更新时间">{formatTime(deviceDetail?.updateTime, 'ymd')}</Description>
          {/* <Description label="设备描述" whole>
            {deviceDetail?.desc}
          </Description> */}
        </DescriptionList>
      </Card>
      <Card style={{ marginTop: '18px' }} title="设备流水" loading={loading}>
        <Table dataSource={deviceData?.records} columns={columns} />
      </Card>
    </Card>
  )
}

export default View
