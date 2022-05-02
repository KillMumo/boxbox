import React from 'react'
import { Form, Input, DatePicker, Radio, Select } from 'antd'
import ModalForm from '@/components/ModalForm'
import {  fetchRow } from '@/services/carbonAccount/reduction'

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

  let item =fetchRow()
  console.log(item)
  return (
    <ModalForm form={props.form} {...restProps}>
      <Form {...formLayout} novalidate>
        <Form.Item label="状态">
          {getFieldDecorator('status', {
            initialValue: fetchRow().extra?.status,
            rules: [{ required: false, message: '请输入' }]
          })(
            <Select>
              <Select.Option key={0} value={"在建"}>在建</Select.Option>
              <Select.Option key={1} value={"已完成"}>已完成</Select.Option>
            </Select>
            // <span>{fetchRow().extra?.batchNumber}</span>

          )}
        </Form.Item>

      </Form>
    </ModalForm>
  )
}

export default Form.create()(AddForm)
