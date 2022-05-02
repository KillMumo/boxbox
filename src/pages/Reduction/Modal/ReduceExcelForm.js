import React from 'react'
import { Form, Input, DatePicker, Radio, Select } from 'antd'
import ModalForm from '@/components/ModalForm'
import {  fetchRow } from '@/services/carbonAccount/reduction'
import {  getSceneList } from '@/services/carbonAccount/reduction'
import UploadNew from '@/components/UploadNew'
import { validateFiles } from '@/utils/fieldValidator'
import UploadButton from '../../../components/UploadButton'
import useDict from '@/hooks/useDict'
import { useRequest } from '@dragon/hooks'

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



  const {  data: sceneLists = [] } = useRequest(
    getSceneList,
    {
      enhanceResponse: (data) => {
        console.log(data)
      }
    }
  )

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

                <Select.Option key='光伏减排项目' value='reduce_project' >
                  光伏减排项目
                </Select.Option>

            </Select>
          )}

        </Form.Item>


        <Form.Item label="碳汇场景">

          {getFieldDecorator('projectScene',{
            rules: [
              {
                required: true,
                message: '请选场景类型！'
              }
            ]
          })(
            <Select placeholder="请选择" style={{ width: 300 }}>

              {/*<Select placeholder="请输入">*/}
              {/*  {sceneLists.map((key) => (*/}
              {/*    <Select.Option key={key} value={key}>*/}
              {/*      {key}*/}
              {/*    </Select.Option>*/}
              {/*  ))}*/}
              {/*</Select>*/}

              <Select.Option key='分布式光伏' value='分布式光伏' >
                分布式光伏
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
