import React from 'react'
import { Form, Input, DatePicker, Radio, Select } from 'antd'
import ModalForm from '@/components/ModalForm'
import {  fetchRow } from '@/services/carbonAccount/reduction'
import UploadNew from '@/components/UploadNew'
import { validateFiles } from '@/utils/fieldValidator'
import UploadButton from '../../../components/UploadButton/index'
import useDict from '@/hooks/useDict'

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

  const excelType = useDict('parseType')

  let item =fetchRow()
  return (
    <ModalForm form={props.form} {...restProps}>
      <Form {...formLayout} novalidate>
        <Form.Item label="模板类型">

          {getFieldDecorator('parseType',{
            rules: [
              {
                required: true,
                message: '请选择模板类型！'
              }
            ]
          })(
            <Select placeholder="请选择" style={{ width: 300 }}>

                <Select.Option key='光伏碳汇' value='XianJu_Power' >
                  光伏碳汇
                </Select.Option>

            </Select>
          )}

        </Form.Item>


        <Form.Item label="数据文件">
          {getFieldDecorator('dataFile', {
            rules: [{ required: true, validator: validateFiles }]
          })(
            <UploadNew
              length={10}
              size={20}
              extra="请上传表格文件"
              accept=".csv,.xls,.xlsx"
              listType="picture"
            >
              <UploadButton/>
            </UploadNew>
          )}
        </Form.Item>
      </Form>
    </ModalForm>
  )
}

export default Form.create()(AddForm)
