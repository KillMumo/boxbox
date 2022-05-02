import React, { useEffect, useState} from 'react'
import Card from '@/components/Card'
import { getOrgById,getshujudata} from '@/services/carbon/dataManage'
import DescriptionList from '@/components/DescriptionList'

const { Description } = DescriptionList

const View = (props) => {
  const {
    match: {
      params: {  }
    }
  } = props
  // const r=[]

  const [data,setdata]=useState([])

  const requestdata=()=>{
    getOrgById({orgId:getshujudata().orgId}).then((res)=>{
      setdata(res)
    })
  }

  useEffect(() => {
    requestdata()
  },[])

  return (
    <Card transparent>
      <Card title="基本信息">
        <DescriptionList>
          <Description label="企业名称:"> {getshujudata()?.year}</Description>
          <Description label="企业地址:"> {getshujudata()?.month}</Description>
          <Description label="联系人姓名:"> {getshujudata()?.date||'--'}</Description>
          <Description label="联系人电话:"> {getshujudata()?.companyName}</Description>
          <Description label="成品盒长(mm):"> {data?.orgCode||'--'}</Description>
          <Description label="成品盒宽(mm):"> {data?.legalPersonName||'--'}</Description>
          <Description label="成品盒高(mm):"> {data?.socialCreditCode||'--'}</Description>
          <Description label="盒型种类:"> {data?.licenseNumber||'--'}</Description>
          <Description label="最新编辑日期:"> {data?.scope||'--'}</Description>
          <Description label="数字文件:"> {data?.orgType||'--'}</Description>
          {/* <Description label="能源类型:"> {getshujudata()?.energyFrom}</Description>
          <Description label="碳排放量(吨):"> {getshujudata()?.total}</Description> */}
        </DescriptionList>
      </Card>
    </Card>
  )
}

export default View
