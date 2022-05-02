import React, { useCallback } from 'react'
import { Input, Button, Form } from 'antd'
import fieldValidator from '@/utils/fieldValidator'
import { PasswordReg } from '@/common/reg'
import router from 'umi/router'
import { useSelector } from 'react-redux'
import styles from './styles.less'
import { useRequest } from '@dragon/hooks'
import { forgetPwdStep2 } from '@/services/account'

const Step1 = (props) => {
  const {
    form: { getFieldDecorator, getFieldValue, validateFields }
  } = props

  const forgetState = useSelector(({ forget }) => forget.info)

  const { loading, start: submit } = useRequest(forgetPwdStep2, { manual: true })

  const validateConfirmPassword = (r, value, callback) => {
    const newPwd = getFieldValue('password')
    if (value && value !== newPwd) {
      callback('两次输入的密码不匹配')
    } else {
      callback()
    }
  }

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          const params = {
            ...values,
            account: forgetState.phone
          }
          const res = await submit(params)
          if (res instanceof Error) return
          router.push('/user/forget/step3')
        }
      })
    },
    [forgetState.phone, submit, validateFields]
  )

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className={styles.title}>重置密码</h2>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              name: '新密码',
              validator: fieldValidator,
              regex: {
                regex: PasswordReg,
                msg: '请输入8到16位数字、字母、符号组合，至少包含其中两种字符类型的密码'
              }
            }
          ]
        })(<Input placeholder="新密码" type="password" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('confirmPwd', {
          rules: [
            {
              required: true,
              message: '请确认密码'
            },
            { validator: validateConfirmPassword }
          ]
        })(<Input placeholder="确认密码" type="password" />)}
      </Form.Item>
      <Form.Item>
        <Button loading={loading} block type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(Step1)
