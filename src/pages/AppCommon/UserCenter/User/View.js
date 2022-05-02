import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import Card from '@/components/Card'
import { getOneUser } from '@/services/userManagement'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'
import DescriptionList from '@/components/DescriptionList'

const View = (props) => {
  const {
    params: { id }
  } = props.match

  const { loading: getUserLoading, data: detail = {} } = useRequest(() => getOneUser(id), [id])

  return (
    <Card loading={getUserLoading}>
      <DescriptionList style={{ marginBottom: 24 }} bordered>
        <DescriptionList.Description label="登录账号">
          {detail?.account}
        </DescriptionList.Description>
        <DescriptionList.Description label="用户姓名">
          {detail?.userName}
        </DescriptionList.Description>
        <DescriptionList.Description label="所属角色">
          {detail?.roleName}
        </DescriptionList.Description>
        <DescriptionList.Description label="用户职位">
          {detail?.position}
        </DescriptionList.Description>
        <DescriptionList.Description label="所属机构">
          {detail?.orgName}
        </DescriptionList.Description>
      </DescriptionList>
      <ButtonGroup align="center">
        <Button>
          <Link to={`/userCenter/user`}>返回</Link>
        </Button>
        {detail.isShowDeleteButton && (
          <Button type="primary">
            <Link to={`/userCenter/user/edit/${id}`}>编辑</Link>
          </Button>
        )}
      </ButtonGroup>
    </Card>
  )
}

export default View
