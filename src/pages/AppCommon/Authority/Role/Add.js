import React, { useMemo, useCallback, useEffect } from 'react'
import { Form, Row, Col, InputNumber, Button, Input, TreeSelect, message } from 'antd'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { tree as getTree, addRole, updateRole, getRoleDetail } from '@/services/role'
import router from 'umi/router'
import { useRequest } from '@dragon/hooks'

const { TextArea } = Input

const Add = (props) => {
  const {
    match: {
      params: { id }
    },
    form: { getFieldDecorator, validateFieldsAndScroll }
  } = props

  const { loading: getTreeLoading, data: tree = [] } = useRequest(getTree, {
    enhanceResponse: (data) => {
      return [
        // {
        //   id: 0,
        //   title: '顶级',
        //   key: 0,
        //   value: 0
        // }
      ].concat(data)
    }
  })

  const { loading: getDetailLoading, data: info = {}, start } = useRequest(
    () => getRoleDetail(id),
    {
      manual: true
    }
  )

  const { loading: updateRoleLoading, start: updateRoleReq } = useRequest(updateRole, {
    manual: true
  })

  const { loading: addRoleLoading, start: addRoleReq } = useRequest(addRole, {
    manual: true
  })

  useEffect(() => {
    if (id) {
      start()
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

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          const action = id ? updateRoleReq : addRoleReq
          action({
            ...values,
            id
          }).then((res) => {
            if (res instanceof Error) return
            message.success(`${id ? '更新' : '添加'}成功`)
            router.push('/authority/role')
          })
        }
      })
    },
    [addRoleReq, id, updateRoleReq, validateFieldsAndScroll]
  )

  return (
    <Card loading={getTreeLoading || getDetailLoading} transparent>
      <Form {...formLayout} hideRequiredMark onSubmit={handleSubmit}>
        <Card title="基本信息" bordered={false}>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item label="角色名称">
                {getFieldDecorator('roleName', {
                  initialValue: info.roleName,
                  rules: [
                    {
                      required: true,
                      message: '请输入角色名称',
                      whitespace: true
                    }
                  ]
                })(<Input placeholder="请输入角色名称" />)}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="角色别名">
                {getFieldDecorator('roleAlias', {
                  initialValue: info.roleAlias,
                  rules: [
                    {
                      required: true,
                      message: '请输入角色别名',
                      whitespace: true
                    }
                  ]
                })(<Input placeholder="请输入角色别名" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item label="上级角色">
                {getFieldDecorator('parentId', {
                  initialValue: info.parentId
                })(
                  <TreeSelect
                    disabled={!!info.id}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={tree}
                    allowClear
                    showSearch
                    treeNodeFilterProp="title"
                    placeholder="请选择上级角色"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="角色排序">
                {getFieldDecorator('sort', {
                  rules: [
                    {
                      required: true,
                      message: '请输入角色排序'
                    }
                  ],
                  initialValue: info.sort
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入角色排序" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item label="角色码">
                {getFieldDecorator('roleCode', {
                  initialValue: info.roleCode,
                  rules: [{ required: true, message: '请输入角色码', whitespace: true }]
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="其他信息" bordered={false}>
          <Row gutter={24}>
            <Col span={20}>
              <Form.Item labelAlign="left" label="角色备注">
                {getFieldDecorator('remark', {
                  initialValue: info.remark
                })(<TextArea rows={4} placeholder="请输入角色备注" />)}
              </Form.Item>
            </Col>
          </Row>
          <ButtonGroup align="center">
            <Button loading={updateRoleLoading || addRoleLoading} type="primary" htmlType="submit">
              提交
            </Button>
          </ButtonGroup>
        </Card>
      </Form>
    </Card>
  )
}

export default Form.create()(Add)
