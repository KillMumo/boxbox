import React from 'react'
import {Form, Input, DatePicker, Radio, Select, InputNumber} from 'antd'
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
        <Form.Item label="碳配额(吨)">
          {getFieldDecorator('carbonConfigValue', {
            rules: [
              {
                required: true,
                message: '请输入！'
              }
            ]
          })(<InputNumber style={{ width: 300 }} placeholder="请输入" />)}
        </Form.Item>

      </Form>
    </ModalForm>
  )
}

export default Form.create()(AddForm)
