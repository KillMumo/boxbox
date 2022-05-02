import React, { useCallback } from 'react'
import Card from '@/components/Card'
import { Form, Button, Input, message, Select, DatePicker, Row, Col } from 'antd'
import Upload from '@/components/Upload'
import UploadNew from '@/components/UploadNew'
import { validateFiles } from '@/utils/fieldValidator'
import { useRequest } from '@dragon/hooks'
import router from 'umi/router'
import { TextArea } from '@/components/FormItems'
import useDict from '@/hooks/useDict'
// import styles from './styles.less'
import {
  getList,
  addDevice,
  updateDevice,
  deleteDevice,
  detailsDevice, getCacheDevice
} from '@/services/carbonAccount/device'
import moment from 'moment'

const Hist = (props) => {
  const formLayout = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 15 },
    colon: false
  }

  // 申请添加
  const { loading: submitLoading, start: submitReq } = useRequest(addDevice, {
    manual: true,
    onSuccess: () => {
      router.push('/Device/list')
      message.success('添加成功')
    }
  })

  const carbonModle = useDict('carbon_modle')

  // 添加/修改商品
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          values.optTime = moment(values.optTime).format('YYYY-MM-DD HH:mm:ss')
          const params = {
            ...values
          }
          submitReq(params)
        }
      })
    },
    [validateFields, submitReq]
  )

  const {
    form: { getFieldDecorator, validateFields }
  } = props

  return (
    <Card style={{ paddingLeft: '15vw' }}>
      <Form {...formLayout} >

        <Form.Item label="设备类型">

          {getFieldDecorator('deviceType',{
            rules: [
              {
                required: true,
                message: '请选择模板类型！'
              }
            ]
          })(
            <Select placeholder="请选择" style={{ width: 300 }}>

              <Select.Option key='减排设备' value='减排设备' >
                减排设备
              </Select.Option>
              <Select.Option key='碳排设备' value='碳排设备' >
                碳排设备
              </Select.Option>

            </Select>
          )}

        </Form.Item>

        <Form.Item label="设备名称">
          {getFieldDecorator('deviceName', {
            rules: [
              {
                required: true,
                message: '请输入设备名称！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入"/>)}
        </Form.Item>

        <Form.Item label="设备ID">
          {getFieldDecorator('deviceId', {
            rules: [
              {
                required: true,
                message: '请输入设备ID！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入"/>)}
        </Form.Item>

        <Form.Item label="设备描述">
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: '请输入设备描述！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入"/>)}
        </Form.Item>

        <Form.Item label="能源类型">

          {getFieldDecorator('countModel', {
            rules: [
              {
                required: true,
                message: '能源类型！'
              }
            ]
          })(
            <Select placeholder="请选择" style={{ width: 400 }}>
              {Object.keys(carbonModle).map((key) => (
                <Select.Option key={key} value={carbonModle[key]}>
                  {carbonModle[key]}
                </Select.Option>
              ))}
            </Select>
          )}

        </Form.Item>

        {/*<Form.Item label="操作时间">*/}
        {/*  {getFieldDecorator('optTime', {*/}
        {/*    rules: [*/}
        {/*      {*/}
        {/*        required: true,*/}
        {/*        message: '请输入操作时间！'*/}
        {/*      }*/}
        {/*    ]*/}
        {/*  })(*/}
        {/*    <DatePicker*/}
        {/*      format="YYYY-MM-DD HH:mm:ss"*/}
        {/*      showTime*/}
        {/*      style={{ width: 400 }}*/}
        {/*      placeholder="请输入"*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</Form.Item>*/}

        <Form.Item label=" ">
          <Button loading={submitLoading} type="primary" htmlType="submit" onClick={handleSubmit}>
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

export default Form.create()(Hist)
