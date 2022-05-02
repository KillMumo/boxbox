import React from 'react'
import DescriptionList from '@/components/DescriptionList'
import Card from '@/components/Card'
import { getDictDetail } from '@/services/dict'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'

const Description = DescriptionList.Description
const View = (props) => {
  const {
    params: { id }
  } = props.match

  const { loading, data: info = {} } = useRequest(() => getDictDetail(id))

  return (
    <Card loading={loading}>
      <DescriptionList>
        <Description label="字典编号">{info.code}</Description>
        <Description label="上级字典">{info.parentName}</Description>
        <Description label="字典排序">{info.sort}</Description>
        <Description label="字典名称">{info.dictValue}</Description>
        <Description label="字典键值" whole>
          {info.dictKey}
        </Description>
        <Description label="字典备注" whole>
          {info.remark}
        </Description>
      </DescriptionList>
      <ButtonGroup align="center">
        <Button type="primary">
          <Link to={`/system/dict`}>返回</Link>
        </Button>
        <Button>
          <Link to={`/system/dict/edit/${info.id}`}>编辑</Link>
        </Button>
      </ButtonGroup>
    </Card>
  )
}

export default View
