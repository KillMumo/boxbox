import React, { useMemo } from 'react'
import { Input, Select, Row, Col, Button, Form } from 'antd'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { useTable } from '@dragon/hooks'
import Card from '@/components/Card'
import { checkList } from '@/services/microSubsidy/enterprise'
import router from 'umi/router'
import { searchFormLayout } from '@/common/config'
import { companyStatus } from '@/common/dict'

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
      const baseUrl = '/msEnterprise/review/view'
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
        title: '企业全称',
        dataIndex: 'orgName',
        fixed: 'left',
        width: 240,
        ellipsis: true
      },
      {
        title: '实控人',
        dataIndex: 'realControlPersonName',
        width: 140,
        ellipsis: true,
        render: (t) => t || '-'
      },
      {
        title: '法人',
        dataIndex: 'legalPersonName',
        width: 140,
        ellipsis: true,
        render: (t) => t || '-'
      },
      {
        title: '管理员',
        dataIndex: 'adminName',
        width: 140,
        ellipsis: true,
        render: (t) => t || '-'
      },
      {
        title: '管理员手机号',
        dataIndex: 'adminPhone',
        width: 140,
        ellipsis: true,
        render: (t) => t || '-'
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 140,
        ellipsis: true,
        render: (t) => companyStatus[t]?.name
      },
      {
        title: '注册时间',
        dataIndex: 'createTime',
        width: 140,
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
      router.push(`/msEnterprise/review/${v}`)
      searchBy((r) => ({ ...r, status: v }))
    }

    const handelReset = () => {
      router.push(`/msEnterprise/review/6`)
      resetFields()
      searchBy({ status: '6' })
    }

    return (
      <Form {...searchFormLayout} onSubmit={submit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="企业全称">
              {getFieldDecorator('orgName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="实控人">
              {getFieldDecorator('realControlPersonName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="法人">
              {getFieldDecorator('legalPersonName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="状态">
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
          <Col span={16}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handelReset}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    )
  }

  return (
    <Card>
      {renderSearchForm()}
      <PagingTable scroll={{ x: 1480 }} rowKey={(i) => i.id} columns={columns} {...tableProps} />
    </Card>
  )
}

export default Form.create()(List)
