import React, {useCallback, useEffect, useMemo, useState} from 'react'
import Card from '@/components/Card'
import {Form, Row, Col, Input, Button, Select, DatePicker, message, InputNumber, Divider, Radio, Tag} from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import router from 'umi/router'
import ModifyStatus from '@/pages/CarbonAccount/Cert/Modal/ModifyStatus'
import PagingTable from '@/components/PagingTable'
import {updateReduction} from '@/services/carbonAccount/reduction'
import useModalForm from '@/hooks/useModalForm'
import {getcertList, saveduihuan} from '@/services/carbonAccount/carbonsink'
import {exchange} from '@/services/carbonAccount/cert'
import {useRequest, useTable} from '@dragon/hooks'

const Add = (props) => {

  const {refresh, searchBy, submit, tableProps} = useTable(getcertList, {
    form: props.form
  })
  const [certType, setCertType] = useState("")

  const columns = [
    {
      title: '碳汇周期',
      dataIndex: 'extra.certCycle',
      width: 145
    },
    {
      title: '碳汇名称',
      dataIndex: 'extra.sinkName',
      width: 100
    },
    {
      title: '项目名称',
      dataIndex: 'extra.projectName',
      width: 145
    },
    {
      title: '数据集成',
      dataIndex: 'extra.inType',
      width: 100
    },
    {
      title: '碳汇类型',
      dataIndex: 'extra.carbonType',
      width: 145
    },
    {
      title: '碳减排量合计(kg)',
      dataIndex: 'extra.sinkSum',
      width: 100,
      render:(t,r)=>{
        return (t*1000).toFixed("1")
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (t, r) => {
        return (
          <ButtonGroup type="action">
            <Button onClick={() => {
              // saveshujudata(r)
              saveduihuan(r)
              openFormModify()
            }}>兑换
            </Button>
          </ButtonGroup>
        )
      }
    },
  ]

  const dataSource = [
    {
      zhouqi: '2020-9',
      name: 'tradcode21',
      xmname: '光伏碳汇',
      jicheng: '自主申报',
      leixin: '光伏碳汇',
      heji: '222'
    }
  ]

  const {loading: rejectLoading, start: rejectReq} = useRequest(exchange, {manual: true})
  const {open: openFormModify, props: modifyFormProps} = useModalForm({
    title: '兑换确认',
    confirmLoading: rejectLoading,
    afterValidate: async (v, close) => {
      const res = await rejectReq({
        certType: localStorage.getItem("certType"),
        ...v
      })
      if (res instanceof Error) return
      message.success('兑换成功')
      router.push('/cert/add')
      close()

    }
  })

  const renderForms = () => {
    return (
      <React.Fragment>
        {/* 新建表单 */}
        <ModifyStatus {...modifyFormProps} />
      </React.Fragment>
    )
  }

  return (
    <Card transparent>
      {renderForms()}
      <Card>
        <div>
          <h1>{localStorage.getItem("certType")}兑换</h1>
          <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps}/>
        </div>
      </Card></Card>
  )
}

export default Form.create()(Add)
