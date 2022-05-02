import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import ButtonGroup from '@/components/ButtonGroup'
// import { useRequest } from '@dragon/hooks'
import DescriptionList from '@/components/DescriptionList'
import Card from '@/components/Card'

const Description = DescriptionList.Description

const View = (props) => {
  /*const {
    params: { id }
  } = props.match*/

  const info = {
    posNameSet: ['管理员', '操作员'],
    userIdCard: '12345678965437654',
    userPhone: '12345678',
    userRealName: '测试'
  }

  // const { loading: getDetailLoading, data: info = {} } = useRequest(() => getParamDetail(id), [id])

  return (
    <Card>
      <DescriptionList>
        <Description label="用户姓名">{info.userRealName}</Description>
        <Description label="手机号">{info.userPhone}</Description>
        <Description label="身份证号">{info.userIdCard}</Description>
        <Description label="角色">{info.posNameSet.join(',')}</Description>
      </DescriptionList>
      <ButtonGroup align="center">
        <Button style={{ marginTop: 22 }}>
          <Link to={`/userCenter/enterpriseUsers`}>返回</Link>
        </Button>
      </ButtonGroup>
    </Card>
  )
}

export default View
