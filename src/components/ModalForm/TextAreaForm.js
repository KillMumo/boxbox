import React from 'react'
import ModalForm from './index'
import { Form } from 'antd'
import fieldValidator from '@/utils/fieldValidator'
import { TextArea } from '../FormItems'

const TextAreaForm = (props) => {
  const { visible, loading, afterValidate, title, extra, ...restProps } = props

  const { getFieldDecorator } = props.form

  return (
    <ModalForm
      form={props.form}
      visible={visible}
      confirmLoading={loading}
      afterValidate={afterValidate}
      title={title}
      {...restProps}
    >
      <Form>
        <Form.Item>
          {getFieldDecorator('reject', {
            rules: [
              {
                validator: fieldValidator,
                required: true,
                name: title,
                length: { max: 100 }
              }
            ]
          })(<TextArea placeholder="请填写" />)}
        </Form.Item>
        {extra && <div>{extra}</div>}
      </Form>
    </ModalForm>
  )
}

export default Form.create()(TextAreaForm)
