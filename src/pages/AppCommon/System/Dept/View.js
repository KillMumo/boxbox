import React from 'react'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import { getDeptDetail } from '@/services/dept'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'

const Description = DescriptionList.Description
const View = (props) => {
  const {
    params: { id }
  } = props.match

  const { loading: getDetailLoading, data: info = {} } = useRequest(() => getDeptDetail(id))

  return (
    <Card loading={getDetailLoading}>
      <DescriptionList>
        <Description label="机构名称">{info.orgName}</Description>
        <Description label="联系人">{info.legalPersonName}</Description>
        <Description label="手机号">{info.legalPersonPhone}</Description>
        <Description label="上级机构">{info.parentName}</Description>
        <Description label="其他信息" span={2}>
          {info.remark}
        </Description>
      </DescriptionList>
      <ButtonGroup align="center">
        <Button type="primary">
          <Link to={`/system/org`}>返回</Link>
        </Button>
        <Button>
          <Link to={`/system/org/edit/${info.id}`}>编辑</Link>
        </Button>
      </ButtonGroup>
    </Card>
  )
}

export default View
