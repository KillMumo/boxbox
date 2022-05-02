import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select, DatePicker, message, Modal } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import styles from './styles.less'
import PagingTable from '@/components/PagingTable'
import { useTable, useRequest } from '@dragon/hooks'
import {getProveWaterList,fetchCompanyname} from "@/services/carbonAccount/accountView";

const Home = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props



  const { refresh, searchBy, submit, tableProps } = useTable(
    getProveWaterList,
    {
      defaultFilters: { 'eq&certType': "减排证明"  ,companyName:fetchCompanyname()},
      form: props.form
    }
  )

  const columns = [
    {
      title: '减排证明(个)',
      dataIndex: 'jsonExtra.sinkSum',
      width: 200
    },
    // {
    //   title: '资产类型',
    //   width: 200,
    //   render(){
    //     return "减排证明"
    //   }
    // },
    {
      title: '核算周期',
      dataIndex: 'jsonExtra.certCycle',
      width: 200
    },
    {
      title: '兑换时间',
      width: 200,
      dataIndex: 'createTime',
    }]

  return (
    <Card transparent>
      <Card title="流水清单">
        <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
      </Card>
    </Card>
  )
}

export default Form.create()(Home)
