import React, { useMemo, useEffect, useCallback } from 'react'
import router from 'umi/router'
import { Row, Form, Col, Input, TreeSelect, Button, message, Radio, InputNumber } from 'antd'
import Card from '@/components/Card'
import { addMenu, getMenuDetail, updateMenu, getMenuTree } from '@/services/menu'
import { Link } from 'react-router-dom'
import ButtonGroup from '@/components/ButtonGroup'
// import { SelectMenu } from '@/components/FormItems'
import { useRequest } from '@dragon/hooks'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const MenuAdd = (props) => {
  const {
    match: {
      params: { id }
    },
    form: { getFieldDecorator }
  } = props

  //菜单树
  const { loading: getTreeLoading, data: menuTree = [], start: fetchMenuTree } = useRequest(
    getMenuTree,
    {
      manual: true,
      enhanceResponse: (data) => {
        return data.concat(
        //   {
        //   id: 0,
        //   title: '顶级',
        //   key: 0,
        //   value: 0
        // }
        )
      }
    }
  )
  //菜单详情
  const { loading: getDetailLoading, data: menuInfo = {}, start } = useRequest(
    (id) => getMenuDetail(id),
    {
      manual: true
    }
  )
  //更新菜单
  const { loading: updateMenuLoading, start: updateMenuReq } = useRequest(updateMenu, {
    manual: true
  })
  //新增菜单
  const { loading: addMenuLoading, start: addMenuReq } = useRequest(addMenu, {
    manual: true
  })

  //菜单详情
  useEffect(() => {
    if (id) {
      start(id)
    }
  }, [id, start])

  //表单样式
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

  //提交按钮事件
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { form } = props
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const parentId = form.getFieldValue('parentId')
          if (id === parentId.toString()) {
            message.warn('上级菜单不能选择自身')
          } else {
            const action = id ? updateMenuReq : addMenuReq
            const params = {
              ...values,
              id
            }
            action(params).then((res) => {
              if (res instanceof Error) return
              message.success(`${id ? '更新' : '添加'}成功`)
              router.push('/system/menu')
            })
          }
        }
      })
    },
    [props, id, updateMenuReq, addMenuReq]
  )

  return (
    <Card title="基本信息" loading={getDetailLoading || getTreeLoading}>
      <Form onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="菜单名称">
              {getFieldDecorator('name', {
                initialValue: menuInfo.name,
                rules: [
                  {
                    required: true,
                    message: '请输入菜单名称'
                  }
                ]
              })(<Input placeholder="请输入菜单名称" />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="路由地址">
              {getFieldDecorator('path', {
                initialValue: menuInfo.path
              })(<Input min={0} placeholder="请输入路由地址" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="上级菜单">
              {getFieldDecorator('parentId', {
                initialValue: menuInfo.parentId,
                rules: [
                  {
                    required: false,
                    message: '请选择上级菜单'
                  }
                ]
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={menuTree}
                  allowClear
                  showSearch
                  treeNodeFilterProp="title"
                  placeholder="请选择上级菜单"
                />
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="菜单图标">
              {getFieldDecorator('source', {
                initialValue: menuInfo.source
                // })(<SelectMenu />)}
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="菜单编号">
              {getFieldDecorator('code', {
                initialValue: menuInfo.code,
                rules: [
                  {
                    required: true,
                    message: '请输入菜单编号'
                  }
                ]
              })(<Input placeholder="请输入菜单编号" />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="菜单类型">
              {getFieldDecorator('category', {
                initialValue: menuInfo.category,
                rules: [
                  {
                    required: true,
                    message: '请选择菜单类型'
                  }
                ]
              })(
                <RadioGroup name="category">
                  <Radio value={1}>菜单</Radio>
                  <Radio value={2}>按钮</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="菜单别名">
              {getFieldDecorator('alias', {
                initialValue: menuInfo.alias,
                rules: [
                  {
                    required: true,
                    message: '请输入菜单别名'
                  }
                ]
              })(<Input placeholder="请输入菜单别名" />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="按钮功能">
              {getFieldDecorator('action', {
                rules: [
                  {
                    required: false,
                    message: '请选择按钮功能'
                  }
                ],
                initialValue: menuInfo.action
              })(
                <RadioGroup name="action">
                  <Radio value={1}>工具栏</Radio>
                  <Radio value={2}>操作栏</Radio>
                  <Radio value={3}>工具操作栏</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="菜单排序">
              {getFieldDecorator('sort', {
                initialValue: menuInfo.sort,
                rules: [
                  {
                    required: true,
                    message: '请输入菜单排序'
                  }
                ]
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入菜单排序" />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="新窗口打开">
              {getFieldDecorator('isOpen', {
                rules: [
                  {
                    required: true,
                    message: '请选择是否新窗口打开'
                  }
                ],
                initialValue: menuInfo.isOpen
              })(
                <RadioGroup name="isOpen">
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="产品码">
              {getFieldDecorator('prodCode', {
                initialValue: menuInfo.prodCode,
                rules: [
                  {
                    required: true,
                    message: '请输入产品码'
                  }
                ]
              })(
                <Input
                  onBlur={(e) => fetchMenuTree({ prodCode: e.target.value })}
                  placeholder="请输入产品码"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={20}>
            <ButtonGroup align="center">
              <Button
                loading={updateMenuLoading || addMenuLoading}
                type="primary"
                htmlType="submit"
              >
                提交
              </Button>
              <Button>
                <Link to="/system/menu">返回</Link>
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default Form.create()(MenuAdd)
