import React, {useCallback, useState, useRef} from 'react'
import { Row, Col, Form, Input, Button,message } from 'antd'
import CountDown, { useCountDown } from '@/components/CountDown'
import ButtonGroup from '@/components/ButtonGroup'
import fieldValidator from '@/utils/fieldValidator'
import router from 'umi/router'
import { useDispatch } from 'react-redux'
import styles from './styles.less'
import useGraphCode from '@/hooks/useGraphCode'
import { useRequest } from '@dragon/hooks'
import { forgetPwdStep1 } from '@/services/account'
import { useSelector } from 'react-redux'

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

const Step1 = (props) => {
  const {
    form: { validateFields, getFieldDecorator }
  } = props

  //用户信息
  const { user } = useSelector(({ user }) => ({
    user: user.user
  }))

  const dispatch = useDispatch()

  const { graph, fetchGraph } = useGraphCode('modifyPhone')

  const { loading: sendLoading, send } = useCountDown('modifyPhone', {
    form: props.form,
    validateFieldsName: ['phone', 'graphCode'],
    onError: fetchGraph
  })

  const { loading: submitting, start: submit } = useRequest(forgetPwdStep1, {
    manual: true,
    onSuccess: () => {
        router.push('/account/modifyPhone/step2')
    }
  })

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          const res = await submit({
            ...values,
            graphId: graph.graphId,
            type: 'modifyPhone'
          })
          if (res instanceof Error) {
            fetchGraph()
            return
          }
          dispatch({
            type: 'modifyPhone/save',
            payload: values
          })
        }
      })
    },
    [dispatch, fetchGraph, graph.graphId, submit, validateFields]
  )

  return (
    <Form {...formLayout} onSubmit={handleSubmit} hideRequiredMark>
      <Form.Item label="手机号">
        {getFieldDecorator('phone', {
          initialValue: user.account
        })(<span>{user.account}</span>)}
      </Form.Item>
      <Form.Item label="图形验证码">
        {getFieldDecorator('graphCode', {
          rules: [
            {
              required: true,
              message: '请输入图形验证码'
            }
          ]
        })(
          <Row gutter={8}>
            <Col span={14}>
              <Input placeholder="请输入"  />
            </Col>
            <Col span={10}>
              <img onClick={fetchGraph} className={styles.img} src={graph.graphSource} alt="" />
            </Col>
          </Row>
        )}
      </Form.Item>
      {/*<Form.Item label="短信验证码">*/}
      {/*  {getFieldDecorator('phoneCode', {*/}
      {/*    rules: [*/}
      {/*      {*/}
      {/*        required: true,*/}
      {/*        validator: fieldValidator,*/}
      {/*        name: '短信验证码',*/}
      {/*        regex: {*/}
      {/*          regex: /^\d{6}$/*/}
      {/*        }*/}
      {/*      }*/}
      {/*    ]*/}
      {/*  })(*/}
      {/*    <Row gutter={8}>*/}
      {/*      <Col span={14}>*/}
      {/*        <Input placeholder="请输入" />*/}
      {/*      </Col>*/}
      {/*      <Col span={10}>*/}
      {/*        <CountDown loading={sendLoading} action={send} />*/}
      {/*      </Col>*/}
      {/*    </Row>*/}
      {/*  )}*/}
      {/*</Form.Item>*/}
      <ButtonGroup align="center">
        <Button loading={submitting} type="primary" htmlType="submit">
          下一步
        </Button>
      </ButtonGroup>
    </Form>
  )
}

export default Form.create()(Step1)
