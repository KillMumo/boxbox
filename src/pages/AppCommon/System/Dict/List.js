import React, { useMemo, useCallback } from 'react'
import { Col, Row, Form, Input, Button, message, Modal } from 'antd'
import Card from '@/components/Card'
import Table from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { getDictList, deleteDict } from '@/services/dict'
import { useTable } from '@dragon/hooks'

const Dept = (props) => {
  const { submit, reset, refresh: refreshList, tableProps } = useTable(getDictList, {
    form: props.form
  })

  // 列
  const columns = useMemo(() => {
    const handleDelete = (id) => {
      Modal.confirm({
        title: '删除确认',
        content: '确定删除选中记录?',
        onOk: () => {
          return deleteDict(id).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refreshList()
          })
        }
      })
    }

    return [
      {
        title: '值',
        dataIndex: 'dictValue'
      },
      {
        title: '键',
        dataIndex: 'dictKey'
      },
      {
        title: '产品码',
        dataIndex: 'prodCode'
      },
      {
        title: '字典编号',
        dataIndex: 'code'
      },
      {
        title: '排序',
        dataIndex: 'sort'
      },
      {
        title: '操作',
        key: 'action',
        render: (t, r) => {
          return (
            <ButtonGroup type="action">

              {/*auth="dict_delete"*/}
              <Button auth={"dict_delete"}  onClick={() => handleDelete(r.id)} >删除</Button>
              {/*auth="dict_view"*/}
              <Button  to={`/system/dict/view/${r.id}`} >详情</Button>
              {/*auth="dict_view"*/}
              <Button  auth={"dict_update"} to={`/system/dict/edit/${r.id}`}>修改</Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [refreshList])

  // 查询表单
  const renderSearchForm = useCallback(() => {
    const {
      form: { getFieldDecorator }
    } = props

    const formLayout = {
      labelAlign: 'left',
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }

    return (
      <Form {...formLayout} onSubmit={submit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="字典名称">
              {getFieldDecorator('dictValue')(<Input placeholder="请输入字典名称" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="字典编号">
              {getFieldDecorator('code')(<Input placeholder="请输入字典编号" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={reset}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    )
  }, [props, reset, submit])

  // 按钮组
  const renderButtonGroup = useCallback(() => {
    return (
      <ButtonGroup>
        {/*auth="dict_add"*/}
        <Button to="/system/dict/add" type="primary" auth={"dict_add"}>
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

export default Form.create()(Dept)
