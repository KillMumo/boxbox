import React from 'react'
import { Form } from 'antd'
import ModalForm from '@/components/ModalForm'
import { TextArea } from '@/components/FormItems'
import Upload from '@/components/Upload'
import { validateFiles } from '@/utils/fieldValidator'
import UploadButton from '../UploadButton'

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
  colon: false
}

// 业务员通过
const PassAndReject = (props) => {
  const {
    form: { getFieldDecorator },
    ...restProps
  } = props

  return (
    <ModalForm form={props.form} width={600} {...restProps}>
      <Form {...formLayout}>
        <Form.Item label="申请企业审核审批表">
          {getFieldDecorator('files', {
            rules: [
              { required: true, message: '请上传申请企业审核审批表' },
              { validator: validateFiles }
            ]
          })(
            <Upload
              minLength={1}
              length={10}
              size={20}
              extra="请上传申请企业审核审批表"
              accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
              listType="picture"
            >
              <UploadButton />
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="反担保企业审核审批表">
          {getFieldDecorator('cgVerifyFiles', {
            rules: [{ validator: validateFiles }]
          })(
            <Upload
              length={10}
              size={20}
              extra="请上传反担保企业审核审批表"
              accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
              listType="picture"
            >
              <UploadButton />
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="会议记录">
          {getFieldDecorator('meetingFiles', {
            rules: [{ validator: validateFiles }]
          })(
            <Upload
              length={10}
              size={20}
              extra="请上传会议记录"
              accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
              listType="picture"
            >
              <UploadButton />
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="其他尽职报告材料">
          {getFieldDecorator('otherFiles', {
            rules: [{ validator: validateFiles }]
          })(
            <Upload
              length={10}
              size={20}
              extra="请上传其他尽职报告材料"
              accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
              listType="picture"
            >
              <UploadButton />
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="备注">
          {getFieldDecorator('remark', {
            validateTrigger: 'onBlur',
            rules: [
              {
                required: true,
                message: '请输入备注',
                whitespace: true
              }
            ]
          })(<TextArea placeholder="请输入" />)}
        </Form.Item>
      </Form>
    </ModalForm>
  )
}

export default Form.create()(PassAndReject)
