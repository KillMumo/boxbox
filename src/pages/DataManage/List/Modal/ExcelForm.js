import React from 'react'
import { Form, Input, DatePicker, Radio, Select } from 'antd'
import ModalForm from '@/components/ModalForm'
import {  fetchRow } from '@/services/carbonAccount/reduction'
import UploadNew from '@/components/UploadNew'
import { validateFiles } from '@/utils/fieldValidator'
import UploadButton from '../../components/uploadButton'
import useDict from '@/hooks/useDict'
import { getCacheDevice } from '@/services/carbonAccount/device'

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
  colon: false
}



// 通过、驳回 （业务员除外）
const AddForm = (props) => {
  const {
    form: { getFieldDecorator,getFieldValue },
    ...restProps
  } = props

  const excelType = useDict('parseType')

  console.log('pppp',getFieldValue('parseType'))

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
              {Object.keys(excelType).map((key,value) => (
                <Select.Option key={key} value={key}>
                  {excelType[key]}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        {(getFieldValue('parseType')==='XianJu_Standard')&&(<Form.Item label="选择年份">
          {getFieldDecorator('year',{
            rules: [
              {
                required: true,
                message: '请选择年份！'
              }
            ]
          })(
            <Select placeholder="请选择">
                    <Select.Option value="2021" key="">
                      2021
                    </Select.Option>
                    <Select.Option value="2020" key="">
                      2020
                    </Select.Option>
                    <Select.Option value="2019" key="">
                      2019
                    </Select.Option>
                    <Select.Option value="2018" key="">
                      2018
                    </Select.Option>
                  </Select>
                )}
        </Form.Item>)}

        {(getFieldValue('parseType')==='XianJu_Standard')&&(<Form.Item label="选择月份">
          {getFieldDecorator('month',{
            rules: [
              {
                required: true,
                message: '请选择月份！'
              }
            ]
          })(
            <Select placeholder="请选择">
                    <Select.Option value="01" key="">
                      一月
                    </Select.Option>
                    <Select.Option value="02" key="">
                      二月
                    </Select.Option>
                    <Select.Option value="03" key="">
                      三月
                    </Select.Option>
                    <Select.Option value="04" key="">
                      四月
                    </Select.Option>
                    <Select.Option value="05" key="">
                      五月
                    </Select.Option>
                    <Select.Option value="06" key="">
                      六月
                    </Select.Option>
                    <Select.Option value="07" key="">
                      七月
                    </Select.Option>
                    <Select.Option value="08" key="">
                      八月
                    </Select.Option>
                    <Select.Option value="09" key="">
                      九月
                    </Select.Option>
                    <Select.Option value="10" key="">
                      十月
                    </Select.Option>
                    <Select.Option value="11" key="">
                      十一月
                    </Select.Option>
                    <Select.Option value="12" key="">
                      十二月
                    </Select.Option>

                  </Select>
                )}
        </Form.Item>)}


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
