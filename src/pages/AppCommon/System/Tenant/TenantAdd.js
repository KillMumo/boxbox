import React, { useMemo, useCallback, useEffect } from 'react'
import { Form, Row, Col, Input, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { addTenant, getTenantDetail, updateTenant } from '@/services/tenant'
import router from 'umi/router'
import { useRequest } from '@dragon/hooks'

const { TextArea } = Input

const TenantAdd = (props) => {
  const {
    match: {
      params: { id }
    },
    form: { getFieldDecorator, validateFieldsAndScroll }
  } = props

  //租户详情
  const { loading: getDetailLoading, data: info = {}, start } = useRequest(
    (id) => getTenantDetail(id),
    {
      manual: true
    }
  )
  //更新租户
  const { loading: updateTenantLoading, start: updateTenantReq } = useRequest(updateTenant, {
    manual: true
  })
  //新增租户
  const { loading: addTenantLoading, start: addTenantReq } = useRequest(addTenant, {
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
          const action = id ? updateTenantReq : addTenantReq
          action({
            ...values,
            id
          }).then((res) => {
            if (res instanceof Error) return
            message.success(`${id ? '更新' : '添加'}成功`)
            router.push('/system/tenant')
          })
        }
      })
    },
    [id, validateFieldsAndScroll, updateTenantReq, addTenantReq]
  )

  return (
    <Card title="基本信息" loading={getDetailLoading}>
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="租户名称">
              {getFieldDecorator('tenantName', {
                initialValue: info.tenantName,
                rules: [
                  {
                    required: true,
                    message: '请输入租户名称'
                  }
                ]
              })(<Input placeholder="请输入租户名称" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="联系人">
              {getFieldDecorator('linkMan', {
                initialValue: info.linkMan,
                rules: [
                  {
                    required: true,
                    message: '请输入联系人'
                  }
                ]
              })(<Input placeholder="请输入联系人" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="联系电话">
              {getFieldDecorator('contactNumber', {
                initialValue: info.contactNumber,
                rules: [
                  {
                    required: true,
                    message: '请输入联系电话'
                  }
                ]
              })(<Input placeholder="请输入联系电话" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="联系地址">
              {getFieldDecorator('address', {
                initialValue: info.address
              })(<TextArea placeholder="请输入联系地址" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <ButtonGroup align="center">
              <Button
                loading={updateTenantLoading || addTenantLoading}
                type="primary"
                htmlType="submit"
              >
                提交
              </Button>
              <Button>
                <Link to="/system/tenant">返回</Link>
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default Form.create()(TenantAdd)
