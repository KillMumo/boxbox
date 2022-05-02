import React, { useMemo } from 'react'
import { Input, Select, Row, Col, Button, Form } from 'antd'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { useTable } from '@dragon/hooks'
import Card from '@/components/Card'
import { checkList } from '@/services/enterprise'
import router from 'umi/router'
// import { searchFormLayout } from '@/common/config'
import { companyStatus } from '@/common/dict'

const searchFormLayout = {
  colon: true,
  labelAlign: 'right',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const List = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props

  // 列表查询
  const { searchBy, tableProps, submit } = useTable(checkList, {
    form: props.form,
    defaultFilters: { status: type }
  })

  const columns = useMemo(() => {
    const getActionMap = (r) => {
      const baseUrl = '/msEnterprise/view'
      return {
        2: { name: '查看', to: `${baseUrl}/${r.id}` }, // 未认证
        3: { name: '查看', to: `${baseUrl}/${r.id}` }, // 待审核
        4: { name: '查看', to: `${baseUrl}/${r.id}` }, // 已退回
        5: { name: '查看', to: `${baseUrl}/${r.id}` }, // 已驳回
        1: { name: '查看', to: `${baseUrl}/${r.id}` } // 已通过
      }
    }

    return [
      {
        title: '编号',
        dataIndex: 'orgName',
        // fixed: 'left',
        width: 180,
        ellipsis: true
      },
      {
        title: '盒型种类',
        dataIndex: 'industry',
        // fixed: 'left',
        width: 150,
        ellipsis: true,
        // render: (t) => (t === '0' ? '供应商' : '客户')
      },
      {
        title: '成品盒长(mm)',
        dataIndex: 'legalPersonName',
        width: 90,
        ellipsis: true,
        render: (t) => t || '-'
      },
      {
        title: '成品盒宽(mm)',
        dataIndex: 'adminName',
        width: 120,
        ellipsis: true,
        render: (t) => t || '-'
      },
      {
        title: '成品盒高(mm)',
        dataIndex: 'adminPhone',
        width: 140,
        ellipsis: true,
        render: (t) => t || '-'
      },
      {
        title: '所属供应商',
        dataIndex: 'status',
        width: 80,
        ellipsis: true,
        render: (t) => companyStatus[t]?.name
      },
      {
        title: '联系电话',
        dataIndex: 'createTime',
        width: 120,
        ellipsis: true
      },
      {
        title: '日期',
        dataIndex: 'createTime',
        width: 120,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        ellipsis: true,
        render: (t, r) => {
          const { name, ...props } = getActionMap(r)[r.status] || {}

          return (
            <ButtonGroup type="action">
              <Button {...props}>{name}</Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  const renderSearchForm = () => {
    const handleSelect = (v) => {
      router.push(`/msEnterprise/list/${v}`)
      searchBy((r) => ({ ...r, status: v }))
    }

    const handleType = (v) => {
      searchBy((r) => ({ ...r, cmyType: v }))
    }

    const handelReset = () => {
      router.push(`/msEnterprise/list/6`)
      resetFields()
      searchBy({ status: '6' })
    }

    return (
      <Card style={{ paddingRight: 20 }}>
      <Form {...searchFormLayout} onSubmit={submit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="预期盒长范围">
              {getFieldDecorator('orgName')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginRight:"10px"}}/>)}
              ~
              {getFieldDecorator('orgName2')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginLeft:"10px"}}/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预期盒宽范围">
              {getFieldDecorator('width')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginRight:"10px"}}/>)}
              ~
              {getFieldDecorator('width2')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginLeft:"10px"}}/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预期盒高范围">
              {getFieldDecorator('height')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginRight:"10px"}}/>)}
              ~
              {getFieldDecorator('height2')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginLeft:"10px"}}/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="盒型种类">
              {getFieldDecorator('status', {
                initialValue: type
              })(
                <Select onSelect={handleSelect}>
                  <Select.Option value="6">全部</Select.Option>
                  <Select.Option value="1">已通过</Select.Option>
                  <Select.Option value="2">未认证</Select.Option>
                  <Select.Option value="3">待审核</Select.Option>
                  <Select.Option value="4">已退回</Select.Option>
                  <Select.Option value="5">已驳回</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="所属供应商">
              {getFieldDecorator('companyname')(<Input placeholder="请输入"/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handelReset}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
      </Card>
    )
  }

  return (
    <Card>
      {renderSearchForm()}
      <PagingTable scoll={{ x: 0 }} rowKey={(i) => i.id} columns={columns} {...tableProps} />
    </Card>
  )
}

export default Form.create()(List)
