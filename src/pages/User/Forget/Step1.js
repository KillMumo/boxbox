import React, { useCallback } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'
import CountDown, { useCountDown } from '@/components/CountDown'
import { PhoneReg } from '@/common/reg'
import fieldValidator from '@/utils/fieldValidator'
import router from 'umi/router'
import { useDispatch } from 'react-redux'
import styles from './styles.less'
import useGraphCode from '@/hooks/useGraphCode'
import { useRequest } from '@dragon/hooks'
import { forgetPwdStep1 } from '@/services/account'

const Step1 = (props) => {
  const {
    form: { validateFields, getFieldDecorator }
  } = props

  const dispatch = useDispatch()

  const { graph, fetchGraph } = useGraphCode('forgetPWD')

  const { loading: sendLoading, send } = useCountDown('forgetPWD', {
    form: props.form,
    validateFieldsName: ['phone', 'graphCode'],
    onError: fetchGraph
  })

  const { loading: submitting, start: submit } = useRequest(forgetPwdStep1, {
    manual: true,
    onSuccess: () => {
      router.push('/user/forget/step2')
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
            type: 'forgetPWD'
          })
          if (res instanceof Error) {
            fetchGraph()
            return
          }
          dispatch({
            type: 'forget/save',
            payload: values
          })
        }
      })
    },
    [dispatch, fetchGraph, graph.graphId, submit, validateFields]
  )

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className={styles.title}>安全验证</h2>
      <Form.Item>
        {getFieldDecorator('phone', {
          rules: [
            {
              required: true,
              validator: fieldValidator,
              name: '手机号',
              regex: {
                regex: PhoneReg
              }
            }
          ]
        })(<Input placeholder="请输入手机号" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('graphCode', {
          rules: [
            {
              required: true,
              message: '请输入短信验证码'
            }
          ]
        })(
          <Row gutter={8}>
            <Col span={16}>
              <Input placeholder="请输入图形验证码" />
            </Col>
            <Col span={8}>
              <img onClick={fetchGraph} className={styles.img} src={graph.graphSource} alt="" />
            </Col>
          </Row>
        )}
      </Form.Item>
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
        })(
          <Row gutter={8}>
            <Col span={16}>
              <Input placeholder="请输入手机验证码" />
            </Col>
            <Col span={8}>
              <CountDown loading={sendLoading} action={send} />
            </Col>
          </Row>
        )}
      </Form.Item>
      <Form.Item>
        <Button loading={submitting} block type="primary" htmlType="submit">
          下一步
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(Step1)
