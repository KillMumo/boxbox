import React,{ useEffect, useState} from 'react'
import Card from '@/components/Card'
//import ButtonGroup from '@/components/ButtonGroup'
import DescriptionList from '@/components/DescriptionList'
//import { Button } from 'antd'
import {getOrgById,getshujudata} from '@/services/carbon/dataManage'
import { useSelector } from 'react-redux'
import Link from 'umi/link'

const Description = DescriptionList.Description
const Info = () => {
  const { user } = useSelector(({ user }) => ({
    user: user.user
  }))

  const [data,setdata]=useState([])

  const requestdata=()=>{
    getOrgById({orgId:user.orgId}).then((res)=>{
      setdata(res)
    })
  }

  useEffect(() => {
    requestdata()
  },[])

  return (
    <Card>
      <DescriptionList>
        <Description label="用户姓名">{user.userName}</Description>
        <Description label="手机号">
          {user.account}
          <span style={{ marginLeft: 10 }}>
            {/*<ButtonGroup type="action">
              <Button>
                修改
              </Button>
            </ButtonGroup>*/}
            <Link to="/account/modifyPhone">修改</Link>
          </span>
        </Description>
        <Description label="职位">{user.position}</Description>
        <Description label="所属企业">{user.orgName}</Description> 
        <Description label="组织机构代码:"> {data?.orgCode||'--'}</Description>
        <Description label="法人姓名:"> {data?.legalPersonName||'--'}</Description>
        <Description label="统一社会信用代码:"> {data?.socialCreditCode||'--'}</Description>
        <Description label="公司工商注册号码:"> {data?.licenseNumber||'--'}</Description>
        <Description label="主要业务:"> {data?.scope||'--'}</Description>
        <Description label="经营行业:"> {data?.orgType||'--'}</Description>
      </DescriptionList>
    </Card>
  )
}

export default Info
