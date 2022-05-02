import React from 'react'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import { getRoleDetail } from '@/services/role'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'

const View = (props) => {
  const {
    params: { id }
  } = props.match

  const { loading, data: info = {} } = useRequest(() => getRoleDetail(id))

  return (
    <Card title="角色详情" loading={loading}>
      <DescriptionList>
        <DescriptionList.Description label="角色名称">{info.roleName}</DescriptionList.Description>
        <DescriptionList.Description label="角色别名">{info.roleAlias}</DescriptionList.Description>
        <DescriptionList.Description label="上级角色">
          {info.parentName}
        </DescriptionList.Description>
        <DescriptionList.Description label="角色排序">{info.sort}</DescriptionList.Description>
        <DescriptionList.Description label="角色备注">{info.remark}</DescriptionList.Description>
      </DescriptionList>
      <ButtonGroup align="center">
        <Button type="primary">
          <Link to={`/authority/role`}>返回</Link>
        </Button>
        {info.isInited !== 1 && (
          <Button>
            <Link to={`/authority/role/edit/${info.id}`}>编辑</Link>
          </Button>
        )}
      </ButtonGroup>
    </Card>
  )
}

export default View
