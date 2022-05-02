import React, { useEffect, useMemo, useState} from 'react'
import Card from '@/components/Card'
import { useRequest } from '@dragon/hooks'
import {getDataList, uploadFile, deleteData,dynamicExcel,getOrgById,getshujudata,getmethoddata} from '@/services/carbon/dataManage'
import {getMethodList} from '@/services/carbon/dataManage'
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

  const requestdetail=()=>{
    getMethodList({'eq&methodScene':JSON.parse(localStorage.getItem('methoddetail')),current:1,size:10}).then((res)=>{
      console.log('lsjhwui',res.records[0])
      setdata(res.records[0])
    })
  }

  useEffect(()=>{
    requestdetail()
  },[])

  return (
    <Card transparent>
      <Card title="基本信息">
        <DescriptionList>
          <Description label="方法学名称:"> {data?.extra?.methodName}</Description>
          <Description label="适用场景:"> {data?.extra?.methodScene}</Description>
          <Description label="描述:"> {data?.extra?.methodDesc}</Description>
          <Description label="方法学版本:" whole>
            <DownloadItem list={data?.extra?.methodFile||[]} />
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
