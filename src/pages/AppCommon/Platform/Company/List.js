import React, { useMemo } from 'react'
import { Input, Select, Row, Col, Button, Form } from 'antd'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { useTable } from '@dragon/hooks'
import Card from '@/components/Card'
import { checkList } from '@/services/platform'
import router from 'umi/router'
import { searchFormLayout } from '@/common/config'

const List = (props) => {
  const {
    form: { getFieldDecorator },
    match: {
      params: { type }
    }
  } = props

  // 列表查询
  const { searchBy, tableProps, submit, reset } = useTable(checkList, {
    form: props.form,
    defaultFilters: { status: type, orgType: '0' }
  })

  const columns = useMemo(() => {
    return [
      {
        title: '企业全称',
        dataIndex: 'companyName',
        width: 240,
        ellipsis: true
      },
      {
        title: '实控人',
        dataIndex: 'realControlPersonName',
        width: 140,
        ellipsis: true
      },
      {
        title: '法人',
        dataIndex: 'legalPersonName',
        width: 140,
        ellipsis: true
      },
      {
        title: '管理员',
        dataIndex: 'name',
        width: 140,
        ellipsis: true
      },
      {
        title: '管理员手机号',
        dataIndex: 'adminPhone',
        width: 140,
        ellipsis: true
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 140,
        ellipsis: true
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
        ellipsis: true
      }
    ]
  }, [])

  const renderSearchForm = () => {
    const handleSelect = (v) => {
      router.push(`/platform/company/${v}`)
      searchBy((r) => ({ ...r, status: v }))
    }

    const handelReset = () => {
      router.push(`/platform/company/全部`)
      reset()
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
              {getFieldDecorator('legalPersonName')(
                <Select onSelect={handleSelect}>
                  <Select.Option value="全部">全部</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <ButtonGroup type="form" align="right">
              <Button onClick={handelReset}>重置</Button>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    )
  }

  return (
    <Card>
      {renderSearchForm()}
      <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
    </Card>
  )
}

export default Form.create()(List)
