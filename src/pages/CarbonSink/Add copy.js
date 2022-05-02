import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select, DatePicker, message, InputNumber, Divider, Radio, Tag } from 'antd'
import { useRequest, useTable } from '@dragon/hooks'
import useDict from '@/hooks/useDict'
import PagingTable from '@/components/PagingTable'
import {
  addJob,
  fetchDetail,
  fetchProList,
  getDeviceList,
  getOrgId, getParam,
  save,
  setParam
} from '@/services/carbonAccount/carbonsink'
import router from 'umi/router'
import Log from '../../../config/routers/Common/routers/Log'
import moment from 'moment'


const Add = (props) => {
  const names = useDict('dict_method')

  const formLayout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    colon: true
  }
  const itemlayout = {
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    colon: true
  }
  const buttonlayout = {
    labelAlign: 'right',
    labelCol: { span: 11 },
    wrapperCol: { span: 13 },
    colon: false
  }

  const {
    form: { getFieldDecorator, validateFields },
    match: {
      params: { id }
    }
  } = props


  const { loading: submitLoading, start: submitReq } = useRequest(save, {
    manual: true
  })


  const { loading: getWasteLoading, data: info = {}, start } = useRequest(fetchDetail, {
    manual: true
  })

  const { start: myJob } = useRequest(addJob, {
    manual: true
  })
let {  data: orgId = {}, start:fetchOrgId } = useRequest(getOrgId, {
  manual: true
})

  useEffect(()=>{
    fetchOrgId().then(res=>{
      orgId=res.orgId
    })
  },[])

  useEffect(() => {
    if (id) {
      start({ uid: id })
    }
  }, [id, start])

  //获取项目列表
  const { loading: getRepoLoading, data: proLists = [], start: getRepoLists } = useRequest(
    fetchProList,
    {
      enhanceResponse: (data) => {
        console.log(data)
      }
    }
  )

  const { refresh, searchBy, submit, tableProps } = useTable(getDeviceList, {
    form: props.form
  })
  const columns = useMemo(() => {
    return [

      {
        title: '设备名称',
        dataIndex: 'jsonExtra.deviceName',
        width: 120
      },
      {
        title: '设备ID',
        dataIndex: 'jsonExtra.deviceId',
        width: 120
      }


    ]
  }, [])

  //  提交按钮事件
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields((err, values) => {
        if (!err) {

          let deviceList = JSON.parse(localStorage.getItem('deviceList'))
          values = {
            ...values,
            fileTime:moment(values.fileTime).format('YYYY-MM-DD'),
            startTime:moment(values.startTime).format('YYYY-MM-DD'),
            deviceList: deviceList
          }
          console.log(values)
          let deviceIds = ''
          if (deviceList.length === 1) {
            deviceIds += deviceList[0].jsonExtra.deviceId
          } else {
            deviceIds += deviceList[0].jsonExtra.deviceId + ','
            for (let i = 1; i < deviceList.length; i++) {
              if (i !== deviceList.length - 1) {
                deviceIds += deviceList[i].uid + ','
              } else {
                deviceIds += deviceList[i].uid
              }
            }
          }
          deviceIds += ',' + values.project.bizNo
          deviceIds += ',' + orgId
          console.log(deviceIds)


          //调取定时定时任务接口
       /*   addJob({
            param:deviceIds
          }).then(res=>{
            if (res instanceof Error) return

          }).finally(()=>{
            //定时任务调取成功   向数据库中添加数据
            submitReq({
              ...values,
              type:'分布式光伏',
              param:deviceIds
            }).then((res) => {
              if (res instanceof Error) return
              setParam(res)
              message.success(`添加成功`)
              router.push('/cs/list')
            })
          })*/


          submitReq({
            ...values,
            type:'分布式光伏',
            param:deviceIds
          }).then((res) => {
            if (res instanceof Error) return
            setParam(res)

          }).finally(()=>{
            //调取定时定时任务接口
            addJob({
              param:getParam()
            }).then(res=>{
              if (res instanceof Error) return
              message.success(`添加成功`)
              router.push('/cs/list')
            })
          })

          console.log(values)



        }
      })
    },
    [id, submitReq, validateFields]
  )


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setDeviceList(() => {
        return selectedRows
      })
      localStorage.setItem('deviceList', JSON.stringify(selectedRows))
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
  }

  const [deviceList, setDeviceList] = useState([])
  useEffect(() => {
    console.log('effect')
    console.log(deviceList)
  }, [deviceList])

  const [selectionType, setSelectionType] = useState('checkbox')
  return (
    <Card loading={getWasteLoading}>
      <Form {...formLayout}>
        <h1>碳汇资产</h1>
        <Form.Item {...itemlayout} label='碳汇名称'>
          {getFieldDecorator('cname', {
            rules: [
              {
                required: true,
                message: '请输入碳汇名称！'
              }
            ],
            initialValue: info?.extra?.cname
          })(<Input style={{ width: 600 }} placeholder='请输入' />)}
        </Form.Item>

        {/* <Form.Item {...itemlayout} label='方法学名称及版本'>
          {getFieldDecorator('mname', {
            rules: [
              {
                required: true,
                message: '请选择方法学名称及版本！'
              }
            ],
            initialValue: info?.extra?.mname
          })(<Select placeholder='请输入'>
            {Object.keys(names).map((key) => (
              <Select.Option key={key} value={names[key]}>
                {names[key]}
              </Select.Option>
            ))}
          </Select>)}
        </Form.Item> */}

        <h1>减排项目</h1>

        <Form.Item {...itemlayout} label='项目名称'>
          {getFieldDecorator('project', {
            initialValue: info?.extra?.project
          })(
            <Select style={{ width: 600 }} placeholder={'请选择'}>
              {
                proLists.map((item, index) => (
                  <Select.Option key={{ index }} value={item.extra.projectName}>{item.extra?.projectName}</Select.Option>
                ))
              }
            </Select>)}
        </Form.Item>

        <Form.Item label=''>
          <div>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <Radio.Group
              onChange={({ target: { value } }) => {
                setSelectionType(value)

              }}
              value={selectionType}
            >
              <Radio value='checkbox'>Checkbox</Radio>
              <Radio value='radio'>radio</Radio>
            </Radio.Group>

            <Divider />

            <PagingTable
              rowKey={(i) => i.bizNo}
              rowSelection={{
                type: selectionType,
                ...rowSelection
              }}
              columns={columns}
              {...tableProps}
            />
          </div>

        </Form.Item>

        <Form.Item {...buttonlayout} label=' '>
          <Button
            // loading={updateLoading || submitLoading}
            loading={submitLoading}
            type='primary'
            htmlType='submit'
            onClick={handleSubmit}
          >
            提交
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => props.history.goBack()}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Form.create()(Add)
