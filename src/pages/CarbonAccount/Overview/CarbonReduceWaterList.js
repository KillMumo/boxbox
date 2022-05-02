import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select, DatePicker, message, Modal } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import styles from './styles.less'
import PagingTable from '@/components/PagingTable'
import { useTable, useRequest } from '@dragon/hooks'
import {getCReduceWaterList,getCReduceWaterList2,fetchCompanyname} from "@/services/carbonAccount/accountView";
import moment from 'moment'

const Home = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props



  const { refresh, searchBy, submit, tableProps } = useTable(
    getCReduceWaterList2,
    {
      defaultFilters: {  companyName:fetchCompanyname()},
      form: props.form
    }
  )

  const columns = [
    {
      title: '碳减排量(吨)',
      dataIndex: 'total',
      width: 200
    },
    // {
    //   title: '资产类型',
    //   width: 200,
    //   render(){
    //     return "碳减排量"
    //   }
    // },
    {
      title: '能源类型',
      dataIndex: 'energyFrom',
      width: 200
    },
    {
      title: '核算周期',
      width: 200,
      render(t,r) {
        if (t.date==="--"||t.date===null||t.date===undefined){
          return t.year+"-"+t.month;
        }
        return t.year+"-"+t.month+"-"+t.date;
      }
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      width: 200,
      render: (t) => moment(t).format('YYYY-MM-DD HH:mm:ss'),
    }
  ]


  return (
    <Card transparent>
      <Card title="流水清单">
      <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
      </Card>
      </Card>
  )
    }

export default Form.create()(Home)
