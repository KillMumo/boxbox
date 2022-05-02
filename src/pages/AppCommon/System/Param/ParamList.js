import React, { useMemo, useCallback } from 'react'
import { Col, Row, Form, Input, Button, message, Modal } from 'antd'
import Card from '@/components/Card'
import Table from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { getParamList, deleteParam } from '@/services/param'
import { useTable } from '@dragon/hooks'

const Param = (props) => {
  const { refresh: refreshList, searchBy, tableProps } = useTable(getParamList)

  // 表格列
  const columns = useMemo(() => {
    //删除按钮事件
    const handleDelete = (id) => {
      Modal.confirm({
        title: '删除确认',
        okType: 'danger',
        content: '确定删除选中记录?',
        onOk: () => {
          return deleteParam(id).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refreshList()
          })
        }
      })
    }

    return [
      {
        title: '参数名称',
        dataIndex: 'paramName'
      },
      {
        title: '参数键名',
        dataIndex: 'paramKey'
      },
      {
        title: '参数键值',
        dataIndex: 'paramValue'
      },
      {
        title: '操作',
        key: 'action',
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button auth="param_view" to={`/system/param/view/${r.id}`}>
                查看
              </Button>
              <Button auth="param_delete" onClick={() => handleDelete(r.id)}>
                删除
              </Button>
              <Button auth="param_edit" to={`/system/param/edit/${r.id}`}>
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
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
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
            <Form.Item label="参数名称">
              {getFieldDecorator('paramName')(<Input placeholder="请输入参数名称" />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="参数键名">
              {getFieldDecorator('paramKey')(<Input placeholder="请输入参数键名" />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="参数键值">
              {getFieldDecorator('paramValue')(<Input placeholder="请输入参数键值" />)}
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
        <Button auth="param_add" to="/system/param/add">
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

export default Form.create()(Param)
