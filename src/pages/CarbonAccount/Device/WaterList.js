import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select, DatePicker, message, Modal } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import styles from './styles.less'
import PagingTable from '@/components/PagingTable'
import useModalForm from '@/hooks/useModalForm'
import useDict from '@/hooks/useDict'

import {
  getList,
 waterList,
  saveDevice
} from '@/services/carbonAccount/device'

import { useTable, useRequest } from '@dragon/hooks'

import router from 'umi/router'
import {Link} from "react-router-dom";

const Home = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props



  const { refresh, searchBy, submit, tableProps } = useTable(

    waterList,
    {
      form: props.form
    }
  )


  const columns = [
    {
      title: '设备ID',
      dataIndex: 'jsonExtra.deviceId',
      fixed: 'left',
    },
    {
      title: '设备名称',
      dataIndex: 'jsonExtra.data',
    },
    {
      title: '设备ID',
      dataIndex: 'jsonExtra.unit',

    },
    {
      title: '描述',
      dataIndex: 'jsonExtra.energyFrom',
    }
  ]


  return (
    <Card transparent>
      <Card style={{ marginTop: 0 }}>
        <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
      </Card>
    </Card>
  )
}

export default Form.create()(Home)
