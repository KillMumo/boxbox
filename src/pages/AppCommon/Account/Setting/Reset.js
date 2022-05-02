import React, { useCallback, useMemo } from 'react'
import { Form, Input, Button, message } from 'antd'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { updatePassword } from '@/services/account'
import router from 'umi/router'
// import { saveToken } from '@/common/token'
import { useRequest } from '@dragon/hooks'
import fieldValidator from '@/utils/fieldValidator'
// import { PasswordReg } from '@/common/reg'
//import { useSelector, useDispatch } from 'react-redux'

const Reset = (props) => {
  const { getFieldDecorator, getFieldValue } = props.form

  // const { isFirst, isReset } = useSelector(({ authorities }) => ({
  //   isFirst: authorities.isFirst,
  //   isReset: authorities.isReset
  // }))

  const { loading, start: updatePasswordReq } = useRequest(updatePassword, {
    manual: true,
    onSuccess: () => {
      message.success('密码已修改，请重新登录')
      //saveToken(res)
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

  //校验密码
  /*const validateNewPassWord=( regex ) => {
    const value = getFieldValue('newPassword')
    if (value && regex.test(value)) {
      return <Icon type="check-circle" style={{color:'#32CD5F'}}/>
    }
    else {
      return <Icon type="close-circle" style={{color:'#F04134'}}/>
    }
  }*/

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { validateFieldsAndScroll } = props.form
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          updatePasswordReq(values)
        }
      })
    },
    [props.form, updatePasswordReq]
  )

  const formItemLayout = useMemo(
    () => ({
      labelCol: {
        span: 4
      },
      wrapperCol: {
        offset: 2,
        span: 15
      },
      style: {
        width: 600
        //margin: '0 auto'
      },
      colon: false
    }),
    []
  )

  //密码正则
  /*const pwdLength = /^[\S\s]{8,16}$/
  const pwdType = /^[0-9A-Za-z]/
  const pwdCombine = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{8,16}$/

  //popover内容
  const content=(
    <div>
      <p>
        {validateNewPassWord(pwdLength)}
        {`8-16个字符`}
      </p>
      <p>
        {validateNewPassWord(pwdType)}
        {`区分大小写，支持字母、数字`}
      </p>
      <p>
        {validateNewPassWord(pwdCombine)}
        {`必须同时包含字母和数字`}
      </p>
    </div>
  )*/
  //新密码正则
  const pwdCombine = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{8,16}$/

  //const dispatch = useDispatch()

  // 取消按钮
  const cancel = () => {
    // if (isFirst || isReset) {
    //   dispatch({
    //     type: 'USER_LOGOUT'
    //   })
    // }
    props.history.goBack()
  }

  return (
    <Card>
      <Form {...formItemLayout} hideRequiredMark onSubmit={handleSubmit}>
        <Form.Item label="原密码">
          {getFieldDecorator('oldPassword', {
            rules: [
              {
                required: true,
                message: '请输入原密码'
              }
            ]
          })(<Input type="password" placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="新密码">
          {/*<Popover*/}
          {/*content={content}*/}
          {/*placement="right"*/}
          {/*trigger="click"*/}
          {/*>*/}
          {getFieldDecorator('newPassword', {
            rules: [
              {
                validator: fieldValidator,
                required: true,
                name: '新密码',
                regex: {
                  regex: pwdCombine,
                  msg: '请输入8到16位数字、字母、符号组合，至少包含其中两种字符类型的密码'
                }
              }
            ]
          })(<Input type="password" placeholder="请输入" />)}
          {/*</Popover>*/}
        </Form.Item>
        <Form.Item label="确认密码">
          {getFieldDecorator('newPassword1', {
            rules: [
              {
                required: true,
                message: '请输入确认密码'
              },
              { validator: validateConfirmPassword }
            ]
          })(<Input type="password" placeholder="请再次输入" />)}
        </Form.Item>
        <ButtonGroup align="center">
          <Button loading={loading} type="primary" htmlType="submit">
            确定
          </Button>
          <Button onClick={cancel}>取消</Button>
        </ButtonGroup>
      </Form>
    </Card>
  )
}

export default Form.create()(Reset)
