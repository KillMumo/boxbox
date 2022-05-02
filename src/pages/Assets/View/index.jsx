import React, { useEffect, useMemo } from 'react'
import Card from '@/components/Card'
import { useRequest } from '@dragon/hooks'
import { getDetail } from '@/services/microSubsidy/assets'
import { usePageContext, withProvider } from './store'
import DescriptionList from '@/components/DescriptionList'
import { formatTime } from '@/utils'
import { Table } from 'antd'

const { Description } = DescriptionList

const View = () => {
  const { id } = usePageContext()

  // 获取设备详情
  const { loading, data: deviceDetail = {}, start: fetchDetail } = useRequest(getDetail, {
    manual: true
  })

  useEffect(() => {
    if (!!id) {
      fetchDetail(id)
    }
  }, [fetchDetail, id])

  const columns = useMemo(() => {
    return [
      {
        title: '数据ID',
        dataIndex: '',
        width: 120,
        ellipsis: true
      },
      {
        title: '数据信息',
        dataIndex: '',
        width: 120,
        ellipsis: true
      },
      {
        title: '上传时间',
        dataIndex: '',
        width: 120,
        ellipsis: true
      },
      {
        title: '链上标识',
        dataIndex: '',
        width: 120,
        ellipsis: true
      }
    ]
  }, [])

  return (
    <Card loading={loading} transparent>
      <Card title="设备基本信息">
        <DescriptionList>
          <Description label="设备ID">{id}</Description>
          <Description label="设备名称">{}</Description>
          <Description label="设备唯一码">{}</Description>
          <Description label="设备状态">{}</Description>
          <Description label="创建时间">{formatTime()}</Description>
          <Description label="激活时间">{formatTime()}</Description>
          <Description label="更新时间">{formatTime()}</Description>
          <Description label="设备描述" whole>
            {}
          </Description>
        </DescriptionList>
      </Card>
      <Card title="设备流水">
        <Table dataSource={deviceDetail?.device} columns={columns} />
      </Card>
    </Card>
  )
}

const Page = withProvider((props) => {
  return {
    id: props.match.params.id
  }
})(View)
export default Page
