import React, { useCallback } from 'react'
import Card from '@/components/Card'
import { Form, Button, Input, message, Select, DatePicker, Row, Col } from 'antd'
import Upload from '@/components/Upload'
import UploadNew from '@/components/UploadNew'
import { validateFiles } from '@/utils/fieldValidator'
import { useRequest } from '@dragon/hooks'
import router from 'umi/router'
import UploadButton from '@/components/UploadButton'
import { TextArea } from '@/components/FormItems'
import useDict from '@/hooks/useDict'
import {
  addMethods
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
  const { loading: submitLoading, start: submitReq } = useRequest(addMethods, {
    manual: true,
    onSuccess: () => {
      router.push('/methodMgr/list')
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
          values.optTime = moment(values.optTime).format('YYYY-MM-DD HH:mm:ss');
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
    <Card  style={{paddingLeft:'15vw'}}>
      <Form {...formLayout} >
        <Form.Item label="方法学名称" >
          {getFieldDecorator('methodName', {
            rules: [
              {
                required: true,
                message: '请输入方法学名称！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入" />)}
        </Form.Item>

        <Form.Item label="适用场景">
          {getFieldDecorator('methodScene', {
            rules: [
              {
                required: true,
                message: '请输入适用场景！'
              }
            ]
          })(<Select style={{ width: 400 }} placeholder="请输入">
                <Select.Option value="分布式光伏" key="">
                  分布式光伏
                </Select.Option>
              </Select>
          // <Input style={{ width: 400 }} placeholder="请输入" />
          )}
        </Form.Item>

        <Form.Item label="描述">
          {getFieldDecorator('methodDesc', {
            rules: [
              {
                required: true,
                message: '请输入方法学描述！'
              }
            ]
          })(<TextArea style={{ width: 400 }} placeholder="请输入" />)}
        </Form.Item>

        <Form.Item label="方法学版本">
          {getFieldDecorator('methodFile',{
            rules: [
              {
                required: true,
                message: '碳排计算模型！'
              }
            ]
          })(
            <UploadNew
              minLength="0"
              length="10"
              // maxFileNum="10"
              size="20"
              extra="请上传方法学版本"
              accept=".zip,.rar,.doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"
              listType="picture"
            >
              <UploadButton />
            </UploadNew>
          )}
        </Form.Item>
        
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
