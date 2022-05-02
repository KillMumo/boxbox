import React, { useCallback } from 'react'
import { Row, Col, Form, Button, Input, message } from 'antd'
import Link from 'umi/link'
import styles from './index.less'
import fieldValidator from '@/utils/fieldValidator'
// import logo from '@/assets/msFinance/logo.png'
import CountDown, { useCountDown } from '@/components/CountDown'
import { useSelector } from 'react-redux'
import { useRequest } from '@dragon/hooks'
import { updatePasswordFirst } from '@/services/account'
import router from 'umi/router'
import { PasswordReg } from '@/common/reg'
// import { PhoneReg } from '@/common/reg'

const Login = (props) => {
  const { form } = props
  const { getFieldDecorator, getFieldValue } = form
  // redux数据
  const { pageConfig } = useSelector(({ pageConfig }) => ({
    pageConfig
  }))

  //验证码
  const { loading: sendLoading, send } = useCountDown('modifyPWD', {
    form: props.form,
    validateFieldsName: ['account']
  })

  //用户信息
  const { user } = useSelector(({ user }) => ({
    user: user.user
  }))

  //修改密码
  const { loading, start: updatePasswordReq } = useRequest(updatePasswordFirst, {
    manual: true,
    onSuccess: () => {
      message.success('密码已修改，请重新登录')
      router.push('/user/login')
    }
  })

  //校验再次输入
  const validateConfirmPassword = (r, value, callback) => {
    const newPwd = getFieldValue('newPassword')
    if (value && value !== newPwd) {
      callback('两次输入的密码不匹配')
    } else {
      callback()
    }
  }

  //修改密码
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { validateFieldsAndScroll } = props.form
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          updatePasswordReq({
            type: 'modifyPWD',
            ...values
          })
        }
      })
    },
    [props.form, updatePasswordReq]
  )

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: 'url(' + `${pageConfig?.backgroundImage}` + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center 0'
      }}
    >
      <div className={styles.logo}>
        <img className={styles.img} src={pageConfig?.logo} alt="" />
        {pageConfig?.name}
      </div>
      <div className={styles.text}>{pageConfig?.slogan}</div>
      <Form onSubmit={handleSubmit} hideRequiredMark className={styles.form}>
        <h2>修改密码</h2>
        <Form.Item>
          {getFieldDecorator('account', {
            initialValue: user.account
            // rules: [
            //   {
            //     // required: true,
            //     // validator: fieldValidator,
            //     // name: '手机号' // 校验信息的名字
            //     required: true,
            //     message: '请输入原密码'
            //   }
            // ]
          })(<Input size="large" placeholder="请输入手机号" disabled />)}
        </Form.Item>
        <Row gutter={18}>
          <Col span={15}>
            <Form.Item>
              {getFieldDecorator('phoneCode', {
                rules: [
                  {
                    required: true,
                    validator: fieldValidator,
                    name: '短信验证码',
                    regex: {
                      regex: /^\d{6}$/
                    }
                  }
                ]
              })(<Input size="large" placeholder="请输入短信验证码" />)}
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item>
              <CountDown
                className={styles.countdown}
                loading={sendLoading}
                action={send}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          {getFieldDecorator('newPassword', {
            rules: [
              {
                validator: fieldValidator,
                required: true,
                name: '新密码',
                regex: {
                  regex: PasswordReg,
                  msg: '请输入8到16位数字、字母、符号组合，至少包含其中两种字符类型的密码'
                }
              }
            ]
          })(<Input size="large" type="password" placeholder="请输入新密码" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('newPassword1', {
            rules: [
              {
                required: true,
                message: '请输入确认密码'
              },
              { validator: validateConfirmPassword }
            ]
          })(<Input size="large" type="password" placeholder="请再次输入密码" />)}
        </Form.Item>
        <Button
          className={styles.button}
          loading={loading}
          type="primary"
          size="large"
          htmlType="submit"
          block
        >
          确 认
        </Button>
        <div className={styles.actionContainer}>
          <Link to="/user/register">企业注册</Link>
          <Link to="/user/forget">忘记密码</Link>
        </div>
        <div className={styles.loginFooter}>
          <span>产链数字科技区块链云服务平台</span>
        </div>
      </Form>
    </div>
  )
}

export default Form.create()(Login)
