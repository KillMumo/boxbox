import React from 'react'
import { Form, Input, DatePicker, Radio, Select } from 'antd'
import ModalForm from '@/components/ModalForm'
import { fetchduihuan } from '@/services/carbonAccount/carbonsink'

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
  colon: false
}

// 通过、驳回 （业务员除外）
const AddForm = (props) => {
  const {
    form: { getFieldDecorator },
    ...restProps
  } = props

  return (
    <ModalForm form={props.form} {...restProps}>
      <Form {...formLayout} novalidate>
        <Form.Item label="碳汇名称">
          {getFieldDecorator('sinkName', {
            initialValue: fetchduihuan().extra?.sinkName,
            rules: [{ required: false, message: '请输入' }]
          })(<div>{fetchduihuan().extra?.sinkName}</div>)}
        </Form.Item>
        <Form.Item label="核算周期">
          {getFieldDecorator('certCycle', {
            initialValue: fetchduihuan().extra?.certCycle,
            rules: [{ required: false, message: '请输入' }]
          })(<div>{fetchduihuan().extra?.certCycle}</div>)}
        </Form.Item>
        <Form.Item label="减排量">
          {getFieldDecorator('sinkSum', {
            initialValue: fetchduihuan().extra?.sinkSum,
            rules: [{ required: false, message: '请输入' }]
          })(<div>{fetchduihuan().extra?.sinkSum}kg</div>)}
        </Form.Item>
        <Form.Item label="可兑换证明">
          {getFieldDecorator('num', {
            initialValue: fetchduihuan().extra?.sinkSum,
            rules: [{ required: false, message: '请输入' }]
          })(<div>{fetchduihuan().extra?.sinkSum}个</div>)}
        </Form.Item>
      </Form>
    </ModalForm>
  )
}

export default Form.create()(AddForm)
