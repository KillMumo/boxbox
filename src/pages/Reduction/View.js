import React, { useEffect, useMemo, useState} from 'react'
import Card from '@/components/Card'
import {getDataList, uploadFile, deleteData,dynamicExcel,getOrgById,getshujudata} from '@/services/carbon/dataManage'
import DescriptionList from '@/components/DescriptionList'
import { formatTime } from '@/utils'
import { Table, Tag,Button} from 'antd'

const { Description } = DescriptionList

const View = (props) => {
  const {
    match: {
      params: {  }
    }
  } = props
  const r=[]
  const [data,setdata]=useState([])

  const requestdata=()=>{
    getOrgById({orgId:getshujudata().orgId}).then((res)=>{
      setdata(res)
    })
  }

  const handleSubmit=()=>{

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
          <Description label="成品长度(mm):"> {data?.orgCode||'--'}</Description>
          <Description label="成品宽度(mm):"> {data?.legalPersonName||'--'}</Description>
          <Description label="成品高度(mm):"> {data?.socialCreditCode||'--'}</Description>
          <Description label="盒型种类:"> {data?.licenseNumber||'--'}</Description>
          <Description label="最新编辑日期:"> {data?.scope||'--'}</Description>
          <Description label="数字文件:"> {data?.orgType||'--'}</Description>
          {/* <Description label="能源类型:"> {getshujudata()?.energyFrom}</Description>
          <Description label="碳排放量(吨):"> {getshujudata()?.total}</Description> */}
        </DescriptionList>
        <div style={{marginLeft:"500px"}}>
          <Button
            // loading={updateLoading || submitLoading}
            // loading={submitLoading}
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
          >
            通过
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => props.history.goBack()}>
            驳回
          </Button>
          </div>
      </Card>

    </Card>
  )
}

export default View
