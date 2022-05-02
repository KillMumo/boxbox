import React from 'react'
import { Button } from 'antd'
import { getMenuDetail } from '@/services/menu'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import { Link } from 'react-router-dom'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'

const Description = DescriptionList.Description
const MenuView = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  const { loading: getDetailLoading, data: info = {} } = useRequest(() => getMenuDetail(id), [id])

  return (
    info && (
      <Card loading={getDetailLoading}>
        <DescriptionList>
          <Description label="菜单名称">{info.name}</Description>
          <Description label="路由地址">{info.path}</Description>
          <Description label="上级菜单">{info.parentName}</Description>
          <Description label="菜单图标">{info.source}</Description>
          <Description label="菜单编号">{info.code}</Description>
          <Description label="菜单类型">{info.categoryName}</Description>
          <Description label="菜单别名">{info.alias}</Description>
          <Description label="按钮功能">{info.actionName}</Description>
          <Description label="菜单排序">{info.sort}</Description>
          <Description label="新窗口打开">{info.isOpenName}</Description>
        </DescriptionList>
        <ButtonGroup align="center">
          <Button type="primary">
            <Link to={`/system/menu/edit/${info.id}`}>编辑</Link>
          </Button>
          <Button>
            <Link to={`/system/menu`}>返回</Link>
          </Button>
        </ButtonGroup>
      </Card>
    )
  )
}

export default MenuView
