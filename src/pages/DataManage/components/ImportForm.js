import React, { useState } from 'react'
import { Form, Upload, Button, Icon, Input } from 'antd'
import ModalForm from '@/components/ModalForm'
import { checkFileName, fileNameReg } from '@/utils'

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13 },
  colon: false
}

const ImportForm = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    ...restProps
  } = props

  // 保存企业表
  const [excel1, setExcel1] = useState([])
  // 保存土地表
  const [excel2, setExcel2] = useState([])

  // 上传企业表
  const uploadExcel1 = {
    name: 'excel1',
    fileList: excel1,
    beforeUpload: (file) => {
      const pointIndex = file.name.lastIndexOf('.')
      const fileName = file.name.substring(0, pointIndex)
      const fileType = file.name.substring(pointIndex)
      if (fileType === '.xls') {
        if (file.size / 1024 / 1024 <= 10 && fileNameReg.test(fileName)) {
          setExcel1([file])
        }
      } else {
        setExcel1([])
      }
      return false
    },
    onRemove: () => {
      setExcel1([])
      resetFields(['file'])
    }
  }

  // 上传土地表
  const uploadExcel2 = {
    name: 'excel2',
    fileList: excel2,
    beforeUpload: (file) => {
      const pointIndex = file.name.lastIndexOf('.')
      const fileName = file.name.substring(0, pointIndex)
      const fileType = file.name.substring(pointIndex)
      if (fileType === '.xls') {
        if (file.size / 1024 / 1024 <= 10 && fileNameReg.test(fileName)) {
          setExcel2([file])
        }
      } else {
        setExcel2([])
      }
      return false
    },
    onRemove: () => {
      setExcel2([])
      resetFields(['file'])
    }
  }

  const checkFile = (rule, e, callback) => {
    if (e !== undefined) {
      const pointIndex = e.file.name.lastIndexOf('.')
      const fileType = e.file.name.substring(pointIndex)
      if (!(fileType === '.xls')) {
        callback('仅允许上传类型为xls的Excel表格！')
      } else if (e.file.size / 1024 / 1024 > 10) {
        callback('文件不能超过10M！')
      } else {
        checkFileName(rule, e.file.name.substring(0, pointIndex), callback)
      }
    } else {
      callback()
    }
  }

  //校验年份格式：四位数字
  const checkYear = (rule, value, callback) => {
    let reg = /^\d{4}$/
    if (!reg.test(value)) {
      callback('请输入正确的年份！')
    } else {
      callback()
    }
  }

  return (
    <ModalForm form={props.form} {...restProps}>
      <Form {...formLayout}>
        <Form.Item label="年份">
          {getFieldDecorator('year', {
            rules: [
              {
                required: true,
                message: '请输入年份！'
              },
              { validator: checkYear }
            ]
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="企业表">
          {getFieldDecorator('file', {
            rules: [{ required: true, message: '请上传文件！' }, { validator: checkFile }]
          })(
            <Upload {...uploadExcel1} size="large">
              <Button style={{ width: '100%', textAlign: 'left' }} size="large">
                <Icon type="paper-clip" />
                点击上传表格(.xls)
              </Button>
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="土地表">
          {getFieldDecorator('landFile', {
            rules: [{ required: true, message: '请上传文件！' }, { validator: checkFile }]
          })(
            <Upload {...uploadExcel2} size="large">
              <Button style={{ width: '100%', textAlign: 'left' }} size="large">
                <Icon type="paper-clip" />
                点击上传表格(.xls)
              </Button>
            </Upload>
          )}
        </Form.Item>
      </Form>
    </ModalForm>
  )
}

export default Form.create()(ImportForm)
