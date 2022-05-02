import React, { useMemo, useCallback } from 'react'
import { Col, Row, Form, Input, Button, message, Modal } from 'antd'
import Card from '@/components/Card'
import Table from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { getTenantList, deleteTenant } from '@/services/tenant'
import { useTable } from '@dragon/hooks'

const Tenant = (props) => {
  const { refresh: refreshList, searchBy, tableProps } = useTable(getTenantList)

  // 表格列
  const columns = useMemo(() => {
    //删除按钮事件
    const handleDelete = (id) => {
      Modal.confirm({
        title: '删除确认',
        okType: 'danger',
        content: '确定删除选中记录?',
        onOk: () => {
          return deleteTenant(id).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refreshList()
          })
        }
      })
    }

    return [
      {
        title: '租户ID',
        dataIndex: 'id'
      },
      {
        title: '租户名称',
        dataIndex: 'tenantName'
      },
      {
        title: '联系人',
        dataIndex: 'linkMan'
      },
      {
        title: '联系电话',
        dataIndex: 'contactNumber'
      },
      {
        title: '联系地址',
        dataIndex: 'address'
      },
      {
        title: '操作',
        key: 'action',
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button auth="tenant_view" to={`/system/tenant/view/${r.id}`}>
                查看
              </Button>
              <Button auth="tenant_delete" onClick={() => handleDelete(r.id)}>
                删除
              </Button>
              <Button auth="tenant_edit" to={`/system/tenant/edit/${r.id}`}>
                修改
              </Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [refreshList])

  // 搜索框
  const renderSearchForm = useCallback(() => {
    const {
      form: { getFieldDecorator }
    } = props

    const formLayout = {
      labelAlign: 'left',
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    }

    //搜索按钮事件
    const handleSubmit = (e) => {
      e.preventDefault()
      const {
        form: { getFieldsValue }
      } = props
      const result = getFieldsValue()

      searchBy({
        ...result
      })
    }

    //重置按钮事件
    const handleReset = () => {
      const {
        form: { resetFields }
      } = props
      resetFields()
      searchBy()
    }

    //搜索框
    return (
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="租户ID">
              {getFieldDecorator('id')(<Input placeholder="请输入租户ID" />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="租户名称">
              {getFieldDecorator('tenantName')(<Input placeholder="请输入租户名称" />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="联系电话">
              {getFieldDecorator('contactNumber')(<Input placeholder="请输入联系电话" />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    )
  }, [props, searchBy])

  // 左侧按钮组
  const renderButtonGroup = useCallback(() => {
    return (
      <ButtonGroup>
        <Button auth="tenant_add" to="/system/tenant/add">
          新增
        </Button>
      </ButtonGroup>
    )
  }, [])

  return (
    <Card>
      {renderSearchForm()}
      {renderButtonGroup()}
      <Table rowKey={(i) => i.id} columns={columns} {...tableProps} />
    </Card>
  )
}

export default Form.create()(Tenant)
