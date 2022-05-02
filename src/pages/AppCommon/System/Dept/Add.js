import React, { useMemo, useCallback, useEffect } from 'react'
import { Form, Row, Col, TreeSelect, Input, InputNumber, Button, message } from 'antd'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { tree as getTree, addDept, getDeptDetail, updateDept } from '@/services/dept'
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
      return data.concat(
      //   {
      //   id: 0,
      //   title: '顶级',
      //   key: 0,
      //   value: 0
      // }
      )
    }
  })
  const { loading: getDetailLoading, data: info = {}, start } = useRequest(getDeptDetail, {
    manual: true
  })

  const { loading: updateDeptLoading, start: updateDeptReq } = useRequest(updateDept, {
    manual: true
  })
  const { loading: addDeptLoading, start: addDeptReq } = useRequest(addDept, {
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

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          const action = id ? updateDeptReq : addDeptReq
          action({
            ...values,
            id
          }).then((res) => {
            if (res instanceof Error) return
            message.success(`${id ? '更新' : '添加'}成功`)
            router.push('/system/org')
          })
        }
      })
    },
    [addDeptReq, id, updateDeptReq, validateFieldsAndScroll]
  )

  return (
    <Card loading={getTreeLoading || getDetailLoading} transparent>
      <Form {...formLayout} hideRequiredMark onSubmit={handleSubmit}>
        <Card title="基本信息" bordered={false}>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item label="机构名称">
                {getFieldDecorator('orgName', {
                  initialValue: info.orgName,
                  rules: [
                    {
                      required: true,
                      message: '请输入机构名称'
                    }
                  ]
                })(<Input placeholder="请输入机构简称" />)}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="上级组织">
                {getFieldDecorator('parentId', {
                  initialValue: info.parentId
                })(
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={tree}
                    allowClear
                    showSearch
                    treeNodeFilterProp="title"
                    placeholder="请选择上级组织"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item label="联系人">
                {getFieldDecorator('legalPersonName', {
                  initialValue: info.legalPersonName,
                  rules: [
                    {
                      required: true,
                      message: '请输入联系人'
                    }
                  ]
                })(<Input placeholder="请输入联系人" />)}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="手机号">
                {getFieldDecorator('legalPersonPhone', {
                  initialValue: info.legalPersonPhone,
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号'
                    }
                  ]
                })(<Input placeholder="请输入手机号" />)}
              </Form.Item>
            </Col>
            {/*<Col span={10}>*/}
            {/*  <Form.Item label="机构排序">*/}
            {/*    {getFieldDecorator('sort', {*/}
            {/*      initialValue: info.sort,*/}
            {/*      rules: [*/}
            {/*        {*/}
            {/*          required: true,*/}
            {/*          message: '请输入机构排序'*/}
            {/*        }*/}
            {/*      ]*/}
            {/*    })(<InputNumber style={{ width: '100%' }} placeholder="请输入机构排序" />)}*/}
            {/*  </Form.Item>*/}
            {/*</Col>*/}
          </Row>
        </Card>
        <Card title="其他信息" bordered={false}>
          <Row gutter={24}>
            <Col span={20}>
              <Form.Item labelAlign="left" label="机构备注">
                {getFieldDecorator('remark', {
                  initialValue: info.remark
                })(<TextArea rows={4} placeholder="请输入机构备注" />)}
              </Form.Item>
            </Col>
          </Row>
          <ButtonGroup>
            <Button loading={updateDeptLoading || addDeptLoading} type="primary" htmlType="submit">
              提交
            </Button>
          </ButtonGroup>
        </Card>
      </Form>
    </Card>
  )
}

export default Form.create()(Add)
