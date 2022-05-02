import React, { useEffect, useMemo, useState} from 'react'
import Card from '@/components/Card'
import { useRequest } from '@dragon/hooks'
import {getDataList, uploadFile, deleteData,dynamicExcel,getOrgById,getshujudata} from '@/services/carbon/dataManage'
import DescriptionList from '@/components/DescriptionList'
import { formatTime } from '@/utils'
import { Table, Tag } from 'antd'

const { Description } = DescriptionList

const View = (props) => {
  const {
    match: {
      params: {  }
    }
  } = props
// const realR=decodeURI(r);
//   console.log("realR---------")
//   console.log(realR)

//   const { data: data = {}, loading: fetching } = useRequest(() => getOrgById({ orgId: r.split("-")[0] }))
  const r=[]
  const [data,setdata]=useState([])

  const requestdata=()=>{
    getOrgById({orgId:getshujudata().orgId}).then((res)=>{
      setdata(res)
      // console.log("ssss",res)
      // console.log('ssssssss',getshujudata())
    })
  }

  useEffect(() => {
    requestdata()
  },[])

  return (
    <Card transparent>
      <Card  title="基本信息">
        <DescriptionList>
          <Description label="年份:"> {getshujudata()?.year}</Description>
          <Description label="月份:"> {getshujudata()?.month}</Description>
          <Description label="日期:"> {getshujudata()?.date||'--'}</Description>
          <Description label="企业名称:"> {getshujudata()?.companyName}</Description>
          <Description label="组织机构代码:"> {data?.orgCode||'--'}</Description>
          <Description label="法人姓名:"> {data?.legalPersonName||'--'}</Description>
          <Description label="统一社会信用代码:"> {data?.socialCreditCode||'--'}</Description>
          <Description label="公司工商注册号码:"> {data?.licenseNumber||'--'}</Description>
          <Description label="主要业务:"> {data?.scope||'--'}</Description>
          <Description label="经营行业:"> {data?.orgType||'--'}</Description>
          <Description label="能源类型:"> {getshujudata()?.energyFrom}</Description>
          <Description label="碳排放量(吨):"> {getshujudata()?.total}</Description>
        </DescriptionList>
      </Card>
    </Card>
  )
}

export default View
