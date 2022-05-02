import React, { useCallback, useMemo } from 'react'
import { Row, Col, Form, Button, Input } from 'antd'
import { Link } from 'react-router-dom'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import Table from '@/components/PagingTable'
import { getLogApiList } from '@/services/log'
import { useSelector } from 'react-redux'
import { useTable } from '@dragon/hooks'

const { Item } = Form

const Api = (props) => {
  const {
    form: { getFieldDecorator, getFieldsValue, resetFields }
  } = props
  const codes = useSelector(({ authorities }) => authorities.button.buttons)

  const { searchBy, tableProps } = useTable(getLogApiList)

  const columns = useMemo(() => {
    return [
      {
        title: '服务id',
        dataIndex: 'serviceId'
      },
      {
        title: '服务host',
        dataIndex: 'serverHost'
      },
      {
        title: '服务ip',
        dataIndex: 'serverIp'
      },
      {
        title: '软件环境',
        dataIndex: 'env'
      },
      {
        title: '日志名',
        dataIndex: 'methodDes'
      },
      {
        title: '请求方法',
        dataIndex: 'requestMethod'
      },
      {
        title: '请求接口',
        dataIndex: 'requestUri'
      },
      {
        title: '日志时间',
        dataIndex: 'createTime'
      },
      {
        title: '操作',
        key: 'action',
        render: (t, r) => {
          return codes.includes('logapi_view') && <Link to={`/log/logapi/view/${r.id}`}>详情</Link>
        }
      }
    ]
  }, [codes])

  const renderSearchForm = useCallback(() => {
    const formLayout = {
      labelAlign: 'left',
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const result = getFieldsValue()
      searchBy(result)
    }

    return (
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <Item label="服务id">
              {getFieldDecorator('serviceId')(<Input placeholder="请输入服务id" />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="日志名">
              {getFieldDecorator('methodDes')(<Input placeholder="请输入日志名" />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="请求接口">
              {getFieldDecorator('requestUri')(<Input placeholder="请输入请求接口" />)}
            </Item>
          </Col>
        </Row>
        <Row>
          <Col style={{ marginBottom: 24 }}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={() => resetFields()}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    )
  }, [getFieldDecorator, getFieldsValue, resetFields, searchBy])

  return (
    <Card>
      {renderSearchForm()}
      <Table rowKey={(i) => i.id} columns={columns} {...tableProps} />
    </Card>
  )
}

export default Form.create()(Api)
