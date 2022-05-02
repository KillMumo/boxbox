import React, { useMemo, useCallback } from 'react'
import { Form, Row, Col, Input, Button, Select } from 'antd'
import { Link } from 'react-router-dom'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
// import { addParam, getParamDetail, updateParam } from '@/services/param'
// import router from 'umi/router'
// import { useRequest } from '@dragon/hooks'
import fieldValidator from '@/utils/fieldValidator'
import { UserName, PhoneReg, VerifyCodeReg, IDCardReg, PasswordReg } from '@/common/reg'
import CountDown from '@/components/CountDown'

const Option = Select.Option

const Add = (props) => {
  const {
    form: { getFieldDecorator, validateFieldsAndScroll, getFieldValue }
  } = props

  let positionList = [
    { key: '3', desc: '管理员' },
    { key: '1', desc: '操作员' },
    { key: '2', desc: '复核员' }
  ]

  const formItemLayout = useMemo(
    () => ({
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      colon: false
    }),
    []
  )

  //提交按钮
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values)
        }
      })
    },
    [validateFieldsAndScroll]
  )

  const checkConfirm = useCallback(
    (rule, value, callback) => {
      if (value && value !== getFieldValue('password')) {
        callback('两次输入的密码不匹配')
      } else {
        callback()
      }
    },
    [getFieldValue]
  )

  return (
    <Card>
      <Form onSubmit={handleSubmit}>
        <Form.Item {...formItemLayout} label="姓名">
          {getFieldDecorator('realName', {
            rules: [
              {
                required: true,
                validator: fieldValidator,
                name: '用户姓名',
                regex: {
                  // 正则校验
                  regex: UserName,
                  msg: '请填写正确的姓名!'
                }
              }
            ]
          })(<Input placeholder="请填写真实姓名" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="手机号">
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                validator: fieldValidator,
                name: '手机号',
                regex: {
                  // 正则校验
                  regex: PhoneReg,
                  msg: '请填写正确的手机号!'
                }
              }
            ]
          })(<Input placeholder="请填写手机号" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="短信验证码">
          {getFieldDecorator('code', {
            rules: [
              {
                required: true,
                name: '短信验证码',
                validator: fieldValidator,
                regex: {
                  regex: VerifyCodeReg
                }
              }
            ]
          })(
            <Row gutter={8}>
              <Col span={16}>
                <Input placeholder="请输入验证码" />
              </Col>
              <Col span={8}>
                <CountDown
                  action={(a) => {
                    a()
                  }}
                />
              </Col>
            </Row>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="账号角色">
          {getFieldDecorator('position', {
            rules: [
              {
                required: true,
                message: '请选择账号角色！'
              }
            ]
          })(
            <Select placeholder="请选择角色">
              {positionList.map((item) => (
                <Option value={item.key} key={item.key}>
                  {item.desc}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="身份证号">
          {getFieldDecorator('idCard', {
            rules: [
              {
                required: true,
                name: '身份证号',
                validator: fieldValidator,
                regex: {
                  regex: IDCardReg
                }
              }
            ]
          })(<Input placeholder="请填写身份证号" />)}
        </Form.Item>
        <Form.Item label="设置密码" {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                name: '密码',
                validator: fieldValidator,
                regex: {
                  regex: PasswordReg,
                  msg: '请输入6到20位同时包含字母与数字的密码！'
                }
              }
            ]
          })(<Input placeholder="请填写密码" type="password" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="确认密码">
          {getFieldDecorator('confirmPassword', {
            rules: [{ required: true, message: '请s输入确认密码！' }, { validator: checkConfirm }]
          })(<Input placeholder="请确认密码" type="password" />)}
        </Form.Item>
        <Row gutter={24}>
          <Col span={16}>
            <ButtonGroup align="center">
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button>
                <Link to="/userCenter/enterpriseUsers">返回</Link>
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default Form.create()(Add)
