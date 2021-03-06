import React, { useCallback } from 'react'
import { Input, Button, Form, Row, Col } from 'antd'
import CountDown, { useCountDown } from '@/components/CountDown'
import ButtonGroup from '@/components/ButtonGroup'
import fieldValidator from '@/utils/fieldValidator'
import { PhoneReg } from '@/common/reg'
import router from 'umi/router'
import { useSelector } from 'react-redux'
import { useRequest } from '@dragon/hooks'
import { updatePhone } from '@/services/account'
import { useDispatch } from 'react-redux'
import { saveToken } from '@/common/token'

const formLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    offset: 1,
    span: 15
  },
  style: {
    width: 500,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  colon: false
}

const Step2 = (props) => {
  const {
    form: { getFieldDecorator, validateFields }
  } = props

  const { user } = useSelector(({ user }) => ({
    user: user.user
  }))

  const dispatch = useDispatch()

  const { loading, start: submit } = useRequest(updatePhone, {
    manual: true
    // onSuccess:()=>{
    //   router.push('/account/modifyPhone/step3')
    // }
  })

  const { loading: sendLoading, send } = useCountDown('modifyPhoneNew', {
    form: props.form,
    validateFieldsName: ['newPhone']
  })

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          const params = {
            ...values,
            account: user.account,
            type: 'modifyPhoneNew'
          }
          const res = await submit(params)
          if (res instanceof Error) {
            return
          }
          saveToken(res)
          dispatch({
            type: 'user/fetchUser'
          })
          dispatch({
            type: 'modifyPhone/save',
            payload: values
          })
          router.push('/account/modifyPhone/step3')
        }
      })
    },
    [submit, validateFields, dispatch, user.account]
  )

  return (
    <Form {...formLayout} onSubmit={handleSubmit} hideRequiredMark>
      <Form.Item label="???????????????">
        {getFieldDecorator('account', {
          initialValue: user.account
        })(<span>{user.account}</span>)}
      </Form.Item>
      <Form.Item label="???????????????">
        {getFieldDecorator('newPhone', {
          rules: [
            {
              required: true,
              name: '???????????????',
              validator: fieldValidator,
              regex: {
                regex: PhoneReg,
                msg: '???????????????????????????'
              }
            }
          ]
        })(<Input placeholder="?????????" />)}
      </Form.Item>
      {/*<Form.Item label="???????????????">*/}
      {/*  {getFieldDecorator('phoneCode', {*/}
      {/*    rules: [*/}
      {/*      {*/}
      {/*        required: true,*/}
      {/*        validator: fieldValidator,*/}
      {/*        name: '???????????????',*/}
      {/*        regex: {*/}
      {/*          regex: /^\d{6}$/*/}
      {/*        }*/}
      {/*      }*/}
      {/*    ]*/}
      {/*  })(*/}
      {/*    <Row gutter={8}>*/}
      {/*      <Col span={14}>*/}
      {/*        <Input placeholder="?????????" />*/}
      {/*      </Col>*/}
      {/*      <Col span={10}>*/}
      {/*        <CountDown loading={sendLoading} action={send} />*/}
      {/*      </Col>*/}
      {/*    </Row>*/}
      {/*  )}*/}
      {/*</Form.Item>*/}
      <ButtonGroup align="center">
        <Button loading={loading} type="primary" htmlType="submit">
          ??????
        </Button>
      </ButtonGroup>
    </Form>
  )
}

export default Form.create()(Step2)
