import React from 'react'
import { Form } from 'antd'
import ModalForm from '@/components/ModalForm'
import { TextArea } from '@/components/FormItems'
import Upload from '@/components/Upload'
import { validateFiles } from '@/utils/fieldValidator'
import UploadButton from '../UploadButton'

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13 },
  colon: false
}

// 通过、驳回 （业务员除外）
const PassAndReject = (props) => {
  const {
    form: { getFieldDecorator },
    ...restProps
  } = props

  return (
    <ModalForm form={props.form} {...restProps}>
      <Form {...formLayout}>
        <Form.Item label="备注">
          {getFieldDecorator('remark', {
            rules: [{ required: true, message: '请输入备注', whitespace: true }]
          })(<TextArea />)}
        </Form.Item>
        <Form.Item label="上传材料">
          {getFieldDecorator('files', {
            rules: [{ validator: validateFiles }]
          })(
            <Upload
              length={10}
              size={20}
              extra="请上传审批材料"
              accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
              listType="picture"
            >
              <UploadButton />
            </Upload>
          )}
        </Form.Item>
      </Form>
    </ModalForm>
  )
}

export default Form.create()(PassAndReject)
