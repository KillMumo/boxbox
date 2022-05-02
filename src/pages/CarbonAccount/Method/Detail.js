import React, { useEffect, useMemo, useState} from 'react'
import Card from '@/components/Card'
import { useRequest } from '@dragon/hooks'
import {getDataList, uploadFile, deleteData,dynamicExcel,getOrgById,getshujudata,getmethoddata} from '@/services/carbon/dataManage'
import DescriptionList from '@/components/DescriptionList'
import { formatTime } from '@/utils'
import DownloadItem from '@/components/DownloadItem'
import { Table, Tag } from 'antd'

const { Description } = DescriptionList

const View = (props) => {
  const {
    match: {
      params: {  }
    }
  } = props
  const r=[]
  const [data,setdata]=useState([])

  // const requestdata=()=>{
  //   getOrgById({orgId:getshujudata().orgId}).then((res)=>{
  //     setdata(res)
  //   })
  // }

  // useEffect(() => {
  //   requestdata()
  // },[])

  return (
    <Card transparent>
      <Card title="基本信息">
        <DescriptionList>
          <Description label="方法学名称:"> {getmethoddata()?.extra?.methodName}</Description>
          <Description label="适用场景:"> {getmethoddata()?.extra?.methodScene}</Description>
          <Description label="描述:"> {getmethoddata()?.extra?.methodDesc}</Description>
          <Description label="方法学版本:" whole>
            <DownloadItem list={getmethoddata()?.extra?.methodFile||[]} />
          </Description> 
          {/* <Description label="公司名称:"> {getshujudata()?.companyName}</Description>
          <Description label="公司代码:"> {data?.companyCode||'-'}</Description>
          <Description label="主要业务:"> {data?.business||'-'}</Description>
          <Description label="一级行业:"> {data?.industry||'-'}</Description>
          <Description label="二级行业:"> {data?.secIndustry||'-'}</Description>
          <Description label="行业代码:"> {data?.industryCode||'-'}</Description>
          <Description label="碳排来源:"> {getshujudata()?.energyFrom}</Description>
          <Description label="碳排数值(吨):"> {getshujudata()?.total}</Description> */}
        </DescriptionList>
      </Card>
    </Card>
  )
}

export default View
