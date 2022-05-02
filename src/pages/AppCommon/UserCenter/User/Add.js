import React, { useMemo, useEffect, useCallback } from 'react'
import router from 'umi/router'
import { Row, Form, Col, Input, TreeSelect, Button, message } from 'antd'
import { useRequest } from '@dragon/hooks'
import Card from '@/components/Card'

import { tree as roles } from '@/services/role'
import { tree as depts } from '@/services/dept'
import { addUser, getOneUser, updateUser } from '@/services/userManagement'
import fieldValidator from '@/utils/fieldValidator'
import { PhoneReg } from '@/common/reg'

const FormItem = Form.Item

const Add = (props) => {
  // 获取两棵树
  const { loading: roleTreeLoading, data: roleTree = [] } = useRequest(roles)
  const { loading: orgTreeLoading, data: orgTree = [] } = useRequest(depts)
  // 修改页获取用户信息
  const { loading: getUserLoading, data: userInfo = {}, start } = useRequest(
    (id) => getOneUser(id),
    {
      manual: true
    }
  )

  // 新增user
  const { loading: addUserLoading, start: addUserReq } = useRequest(addUser, {
    manual: true
  })
  // 更新user
  const { loading: updateUserLoading, start: updateUserReq } = useRequest(updateUser, {
    manual: true
  })

  const {
    match: {
      params: { id }
    },
    form: { getFieldDecorator }
  } = props

  useEffect(() => {
    if (id) {
      start(id)
    }
  }, [id, start])

  const formAllItemLayout = useMemo(
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
      const { form } = props
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const password = form.getFieldValue('password')
          const password2 = form.getFieldValue('password2')
          if (password !== password2) {
            message.warning('两次密码输入不一致')
          } else {
            const action = id ? updateUserReq : addUserReq
            const params = {
              id,
              ...values,
              roleIds: values.roleIds.join(','),
              orgIds: values.orgIds.join(',')
            }
            action(params).then((res) => {
              if (res instanceof Error) return
              message.success('提交成功')
              router.push('/userCenter/user')
            })
          }
        }
      })
    },
    [props, id, updateUserReq, addUserReq]
  )

  return (
    <Card title="基本信息" loading={roleTreeLoading || orgTreeLoading || getUserLoading}>
      <Form onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={20}>
            <FormItem {...formAllItemLayout} label="手机号">
              {getFieldDecorator('account', {
                initialValue: userInfo.account,
                rules: [
                  {
                    required: true,
                    validator: fieldValidator,
                    regex: { regex: PhoneReg },
                    name: '手机号'
                  }
                ]
              })(<Input disabled={id} placeholder="请输入手机号" />)}
            </FormItem>
          </Col>
        </Row>
        {!id && (
          <Row gutter={24}>
            <Col span={10}>
              <FormItem {...formItemLayout} label="密码">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码'
                    }
                  ]
                })(<Input type="password" placeholder="请输入密码" />)}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem {...formItemLayout} label="确认密码">
                {getFieldDecorator('password2', {
                  rules: [
                    {
                      required: true,
                      message: '请输入确认密码'
                    }
                  ]
                })(<Input type="password" placeholder="请输入确认密码" />)}
              </FormItem>
            </Col>
          </Row>
        )}
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="用户姓名">
              {getFieldDecorator('userName', {
                initialValue: userInfo.userName,
                rules: [
                  {
                    required: true,
                    message: '请输入用户姓名'
                  }
                ]
              })(<Input disabled={id} placeholder="请输入用户姓名" />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="用户职位">
              {getFieldDecorator('position', {
                initialValue: userInfo.position,
                rules: [
                  {
                    required: true,
                    message: '请输入用户职位'
                  }
                ]
              })(<Input placeholder="请输入用户职位" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="所属角色">
              {getFieldDecorator('roleIds', {
                initialValue: userInfo.roleIds && userInfo.roleIds.split(','),
                rules: [
                  {
                    required: true,
                    message: '请选择所属角色'
                  }
                ]
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={roleTree}
                  allowClear
                  showSearch
                  treeNodeFilterProp="title"
                  multiple
                  placeholder="请选择所属角色"
                />
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="所属机构">
              {getFieldDecorator('orgIds', {
                initialValue: userInfo.orgIds && userInfo.orgIds.split(','),
                rules: [
                  {
                    required: true,
                    message: '请选择所属机构'
                  }
                ]
              })(
                <TreeSelect
                  disabled={id}
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={orgTree}
                  allowClear
                  showSearch
                  treeNodeFilterProp="title"
                  multiple
                  placeholder="请选择所属机构"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={20} offset={3}>
            <Button loading={addUserLoading || updateUserLoading} type="primary" htmlType="submit">
              提交
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default Form.create()(Add)
