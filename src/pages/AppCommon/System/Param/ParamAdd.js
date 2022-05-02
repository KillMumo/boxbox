import React, { useMemo, useCallback, useEffect } from 'react'
import { Form, Row, Col, Input, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { addParam, getParamDetail, updateParam } from '@/services/param'
import router from 'umi/router'
import { useRequest } from '@dragon/hooks'

const { TextArea } = Input

const ParamAdd = (props) => {
  const {
    match: {
      params: { id }
    },
    form: { getFieldDecorator, validateFieldsAndScroll }
  } = props

  //参数详情
  const { loading: getDetailLoading, data: info = {}, start } = useRequest(
    (id) => getParamDetail(id),
    {
      manual: true
    }
  )
  //更新参数
  const { loading: updateParamLoading, start: updateParamReq } = useRequest(updateParam, {
    manual: true
  })
  //新增参数
  const { loading: addParamLoading, start: addParamReq } = useRequest(addParam, {
    manual: true
  })

  useEffect(() => {
    if (id) {
      start(id)
    }
  }, [id, start])

  const formLayout = useMemo(
    () => ({
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    }),
    []
  )

  const formItemLayout = useMemo(
    () => ({
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    }),
    []
  )

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          const action = id ? updateParamReq : addParamReq
          action({
            ...values,
            id
          }).then((res) => {
            if (res instanceof Error) return
            message.success(`${id ? '更新' : '添加'}成功`)
            router.push('/system/param')
          })
        }
      })
    },
    [id, validateFieldsAndScroll, updateParamReq, addParamReq]
  )

  return (
    <Card title="基本信息" loading={getDetailLoading}>
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="参数名称">
              {getFieldDecorator('paramName', {
                initialValue: info.paramName,
                rules: [
                  {
                    required: true,
                    message: '请输入参数名称'
                  }
                ]
              })(<Input placeholder="请输入参数名称" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="参数键名">
              {getFieldDecorator('paramKey', {
                initialValue: info.paramKey,
                rules: [
                  {
                    required: true,
                    message: '请输入参数键名'
                  }
                ]
              })(<Input placeholder="请输入参数键名" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="参数键值">
              {getFieldDecorator('paramValue', {
                initialValue: info.paramValue,
                rules: [
                  {
                    required: true,
                    message: '请输入参数键值'
                  }
                ]
              })(<Input placeholder="请输入参数键值" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="参数描述">
              {getFieldDecorator('remark', {
                initialValue: info.remark
              })(<TextArea placeholder="请输入参数描述" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <ButtonGroup align="center">
              <Button
                loading={updateParamLoading || addParamLoading}
                type="primary"
                htmlType="submit"
              >
                提交
              </Button>
              <Button>
                <Link to="/system/param">返回</Link>
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default Form.create()(ParamAdd)
