import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select, DatePicker, Steps } from 'antd'
import PagingTable from '@/components/PagingTable'
import DescriptionList from '@/components/DescriptionList'
import { useTable, useRequest } from '@dragon/hooks'

import {detailsDevice} from '@/services/carbonAccount/device'
import {waterList} from '@/services/carbonAccount/device'
import { getInterfaceList } from '@/services/interface'

const View = (props) => {
  const {
    form: { getFieldDecorator, validateFields },
    match: {
      params: { id }
    }
  } = props

  const [data, setdata] = useState([])
  // const [list, setlist] = useState([])

  const { refresh, searchBy, submit, tableProps } = useTable(
    // waterList({ 'eq&deviceId': id.split("-")[1] }),
    // (params) => getInterfaceList({ ...params, menuId }),
    waterList,
    {
      defaultFilters: { 'eq&deviceId': id.split("-")[1] },
      form: props.form
    }
  )



  const detailsDevice1 = () => {
    detailsDevice({ uid: id.split("-")[0] }).then((res) => {
      setdata(res.jsonExtra)

    })
  }

  // const requestList = () => {
  //   waterList({ 'eq&deviceId': id.split("-")[1] }).then((res) => {
  //     setlist(res.records)
  //   })
  // }

  useEffect(() => {
    detailsDevice1()
    // requestList()
  }, [])

  const columns = [
    {
      title: '设备id',
      dataIndex: 'jsonExtra.deviceId',
      fixed: 'left',
    },
    {
      title: '数据',
      dataIndex: 'jsonExtra.energyValue',
    },
    {
      title: '单位',
      dataIndex: 'jsonExtra.energyUnit',
    },
    {
      title: '时间',
      render(r,t){
       return  `${t.jsonExtra.year}-${t.jsonExtra.month}-${t.jsonExtra.date}`
      }
    }
  ]
  return (
    <Card transparent>
      <Card title="基本信息">
        <DescriptionList style={{ marginBottom: 24, width: '100%' }} column={3} bordered>

          <DescriptionList.Description label="设备名称:">
            {data?.deviceName}</DescriptionList.Description>

          <DescriptionList.Description label="设备类型:">
            {data?.deviceType}</DescriptionList.Description>

          <DescriptionList.Description label="设备ID:">
            {data?.deviceId}
          </DescriptionList.Description>
          <DescriptionList.Description label="描述:">
            {data?.description}
          </DescriptionList.Description>
          <DescriptionList.Description label="能源类型:">
            {data?.countModel}
          </DescriptionList.Description>
          {/*<DescriptionList.Description label="操作时间:">*/}
          {/*  {data?.optTime}*/}
          {/*</DescriptionList.Description>*/}
        </DescriptionList>
      </Card>
      <Card title="流水清单">
        {/*<PagingTable rowKey={(i) => i.id} columns={columns} {...listdata} />*/}
        <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
        {/*<PagingTable columns={columns} dataSource={listdata} />*/}
      </Card>
    </Card>
  )
}

export default Form.create()(View)
