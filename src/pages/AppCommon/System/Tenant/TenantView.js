import React from 'react'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import { getTenantDetail } from '@/services/tenant'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'

const Description = DescriptionList.Description
const TenantView = (props) => {
  const {
    params: { id }
  } = props.match

  const { loading: getDetailLoading, data: info = {} } = useRequest(() => getTenantDetail(id), [id])

  return (
    <Card loading={getDetailLoading}>
      <DescriptionList>
        <Description label="租户ID">{info.id}</Description>
        <Description label="租户名称">{info.tenantName}</Description>
        <Description label="联系人">{info.linkMan}</Description>
        <Description label="联系电话">{info.contactNumber}</Description>
        <Description label="联系地址">{info.address}</Description>
      </DescriptionList>
      <ButtonGroup align="center">
        <Button type="primary">
          <Link to={`/system/tenant/edit/${info.id}`}>编辑</Link>
        </Button>
        <Button>
          <Link to={`/system/tenant`}>返回</Link>
        </Button>
      </ButtonGroup>
    </Card>
  )
}

export default TenantView
