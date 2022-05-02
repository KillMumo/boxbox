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

// 上传贷后报告
const PassAndReject = (props) => {
  const {
    form: { getFieldDecorator },
    ...restProps
  } = props

  return (
    <ModalForm form={props.form} {...restProps}>
      <Form {...formLayout}>
        <Form.Item label="保后报告">
          {getFieldDecorator('postLoanFiles', {
            rules: [{ required: true, message: '请上传保后报告' }, { validator: validateFiles }]
          })(
            <Upload
              minLength={1}
              length={10}
              size={20}
              extra="请上传保后报告"
              accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
              listType="picture"
            >
              <UploadButton />
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="其他材料">
          {getFieldDecorator('extraFiles', {
            rules: [{ validator: validateFiles }]
          })(
            <Upload
              length={10}
              size={20}
              extra="请上传其他材料"
              accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
              listType="picture"
            >
              <UploadButton />
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="备注">
          {getFieldDecorator('remark')(<TextArea placeholder="请输入" />)}
        </Form.Item>
      </Form>
    </ModalForm>
  )
}

export default Form.create()(PassAndReject)
