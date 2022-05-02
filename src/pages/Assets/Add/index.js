import React from 'react'
import Card from '@/components/Card'
import { withProvider, usePageContext } from './store'
import { Form, Button, Input, Select } from 'antd'
import { TextArea } from '@/components/FormItems'

const formLayout = {
  labelAlign: 'left',
  labelCol: { span: 4 },
  wrapperCol: { span: 7 },
  colon: false
}

const AddAndEdit = (props) => {
  const {
    form: { getFieldDecorator }
    // isEdit,
    // apply: { loading: applyLoading, handleSubmit: handleApply },
    // edit: { loading, submitting: editLoading, handleSubmit: handleEdit }
  } = usePageContext()

  return (
    <Card
      title="基本信息"
      // loading={loading}
    >
      <Form
        {...formLayout}
        // onSubmit={isEdit ? handleEdit : handleApply}
      >
        <Form.Item label="设备名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入设备名称！'
              }
            ]
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="设备类型">
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请选择设备类型！'
              }
            ]
          })(
            <Select placeholder="请选择">
              <Select.Option key={0}>设备</Select.Option>
              <Select.Option key={1}>无形</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="设备状态">
          {getFieldDecorator('status', {
            rules: [
              {
                required: true,
                message: '请选择设备状态！'
              }
            ]
          })(
            <Select placeholder="请选择">
              <Select.Option key={0}>未激活</Select.Option>
              <Select.Option key={1}>已激活</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="设备描述">
          {getFieldDecorator('desc', {
            rules: [
              {
                message: '请输入设备描述！'
              }
            ]
          })(<TextArea max={100} placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label=" ">
          <Button
            // loading={applyLoading || editLoading}
            type="primary"
            htmlType="submit"
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

const mapPropsToProvider = (props) => {
  const { form } = props

  return {
    form
  }
}

const Page = withProvider(mapPropsToProvider)(AddAndEdit)

export default Form.create()(Page)
