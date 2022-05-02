import React, { useMemo } from 'react'
import Card from '@/components/Card'
import { Form, Input, Button, Row, Col } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import PagingTable from '@/components/PagingTable'
import { fetchHistoryList } from '@/services/apply'
import { useTable } from '@dragon/hooks'
import { EventStatus } from '@/common/map'

const formLayout = {
  labelAlign: 'left',
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
  colon: false
}

const History = (props) => {
  const {
    form: { getFieldDecorator }
  } = props

  const { submit, reset, tableProps } = useTable(fetchHistoryList, { form: props.form })

  const columns = useMemo(() => {
    return [
      {
        title: '流程名称',
        dataIndex: 'flowName'
      },
      {
        title: '流程类型',
        dataIndex: 'flowType'
      },
      {
        title: '当前步骤',
        dataIndex: 'currentStep'
      },
      {
        title: '申请时间',
        dataIndex: 'createTime'
      },
      {
        title: '发起人',
        dataIndex: 'startUser'
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (t) => EventStatus.map[t]
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime'
      },
      {
        title: '操作',
        key: 'action',
        render: () => {
          return (
            <ButtonGroup type="action">
              <Button>办理</Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  const renderSearchForm = () => {
    return (
      <Form {...formLayout} onSubmit={submit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="标题">{getFieldDecorator('label')(<Input />)}</Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="名称">{getFieldDecorator('name')(<Input />)}</Form.Item>
          </Col>
          <Col span={8}>
            <ButtonGroup align="right">
              <Button onClick={() => reset()}>重置</Button>
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

export default Form.create()(History)
