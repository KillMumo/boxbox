import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Tabs } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import styles from './styles.less'
import PagingTable from '@/components/PagingTable'
import useModalForm from '@/hooks/useModalForm'
import useDict from '@/hooks/useDict'
import {
  getLoglist,
} from '@/services/carbonAccount/device'
import { useSelector } from 'react-redux'
import { useTable, useRequest } from '@dragon/hooks'
import router from 'umi/router'
import moment from 'moment'
import {Link} from "react-router-dom";

const Home = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props

  const { TabPane } = Tabs;

  const carbonModle = useDict('carbon_modle')

  //查询表单样式设置
  const searchFormLayout = {
    colon: true,
    labelAlign: 'right',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const { refresh, searchBy, submit, tableProps } = useTable(
    getLoglist,
    {
      // defaultFilters: { status: type },
      form: props.form
    }
  )

  const role = useSelector(({ user }) => user.role)

  const columns2 = [
    {
      title: '文件名称',
      dataIndex: 'extra.fileName',
      // fixed: 'left',
      ellipsis: true,
      width: 250
    },
    {
      title: '导入结果',
      dataIndex: 'extra.importStatus',
      // fixed: 'left',
      ellipsis: true,
      width: 150
    },
    {
      title: '提交时间',
      dataIndex: 'extra.submitTime',
      ellipsis: true,
      // fixed: 'left',
      width: 200
    },
    // {
    //   title: '耗时(秒)',
    //   dataIndex: 'extra.submitTime',
    //   ellipsis: true,
    //   // fixed: 'left',
    //   width: 200,
    //   render:(r,v)=>{
    //     // console.log(r,v)
    //     return (moment(v.extra.finishTime)-moment(v.extra.submitTime))/1000
    //   }
    // },
    {
      title: '失败建议',
      dataIndex: 'extra.errorCause',
      ellipsis: true,
      width: 200
    },
  ]

  const columns1 = [
    {
      title: '文件名称',
      dataIndex: 'extra.fileName',
      // fixed: 'left',
      ellipsis: true,
      width: 250
    },
    {
      title: '导入结果',
      dataIndex: 'extra.importStatus',
      // fixed: 'left',
      ellipsis: true,
      width: 150
    },
    {
      title: '提交时间',
      dataIndex: 'extra.submitTime',
      ellipsis: true,
      // fixed: 'left',
      width: 200
    },
    {
      title: '完成时间',
      dataIndex: 'extra.finishTime',
      ellipsis: true,
      // fixed: 'left',
      width: 200
    },
    {
      title: '耗时(秒)',
      dataIndex: 'extra.submitTime',
      ellipsis: true,
      // fixed: 'left',
      width: 200,
      render:(r,v)=>{
        // console.log(r,v)
        return (moment(v.extra.finishTime)-moment(v.extra.submitTime))/1000
      }
    },
  ]

  const columns3 = [
    {
      title: '文件名称',
      dataIndex: 'extra.fileName',
      // fixed: 'left',
      ellipsis: true,
      width: 250
    },
    {
      title: '导入结果',
      dataIndex: 'extra.importStatus',
      // fixed: 'left',
      ellipsis: true,
      width: 150
    },
    {
      title: '提交时间',
      dataIndex: 'extra.submitTime',
      ellipsis: true,
      // fixed: 'left',
      width: 200
    },
    {
      title: '完成时间',
      dataIndex: 'extra.finishTime',
      ellipsis: true,
      // fixed: 'left',
      width: 200
    },
  ]

  function callback(key) {
    console.log(key);
    if(key==='1') searchBy({'eq&importStatus':'导入失败'})
    if(key==='2') searchBy({'eq&importStatus':'导入成功'})
    if(key==='3') searchBy({'eq&importStatus':'正在导入'})
  }

  useEffect(()=>{
    searchBy({'eq&importStatus':'导入失败'})
  },[])

  return (
    <Card transparent>
      <Card style={{ marginTop: 0 }}>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="导入失败日志" key="1">
            <PagingTable rowKey={(i) => i.id} columns={columns2} {...tableProps}/>
          </TabPane>
          <TabPane tab="导入成功日志" key="2">
            <PagingTable rowKey={(i) => i.id} columns={columns1} {...tableProps}/>
          </TabPane>
          <TabPane tab="正在导入日志" key="3">
            <PagingTable rowKey={(i) => i.id} columns={columns3} {...tableProps}/>
          </TabPane>
        </Tabs>
        {/* <PagingTable rowKey={(i) => i.id} columns={columns2} {...tableProps}/> */}
      </Card>
    </Card>
  )
}

export default Form.create()(Home)
