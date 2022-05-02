import React, { useMemo, useCallback, useState } from 'react'
import { Row, Col, Form, Input, Button, message, Modal } from 'antd'
import { useTable } from '@dragon/hooks'
import Table from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import Card from '@/components/Card'
import { getMenuList, deleteMenu, deleteMultiMenu } from '@/services/menu'

const Item = Form.Item

const formLayout = {
  labelAlign: 'left',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const Menu = (props) => {
  const { submit, reset, refresh: refreshList, tableProps } = useTable(getMenuList, {
    form: props.form
  })

  // 选中的行
  const [selectRows, setSelectRows] = useState([])

  // 列名
  const columns = useMemo(() => {
    const handleSingleDelete = (r) => {
      const ids = getIds(r.children)
      Modal.confirm({
        title: '删除确认',
        content: '确定删除选中记录?',
        okType: 'danger',
        onOk: () => {
          return deleteMenu({ ids: [r.id].concat(ids).join(',') }).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refreshList()
          })
        }
      })
    }
    return [
      {
        title: '菜单名称',
        dataIndex: 'name'
      },
      {
        title: '产品码',
        dataIndex: 'prodCode'
      },
      {
        title: '菜单别名',
        dataIndex: 'alias'
      },
      {
        title: '菜单类别',
        dataIndex: 'category'
      },
      {
        title: '路由地址',
        dataIndex: 'path'
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
              <Button auth="menu_view" to={`/system/menu/view/${r.id}`}>
                查看
              </Button>
              <Button auth="menu_delete" onClick={() => handleSingleDelete(r)}>
                删除
              </Button>
              <Button auth="menu_edit" to={`/system/menu/edit/${r.id}`}>
                修改
              </Button>
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

    return (
      <Form {...formLayout} onSubmit={submit}>
        <Row gutter={24}>
          <Col span={8}>
            <Item label="产品码">
              {getFieldDecorator('prodCode')(<Input placeholder="请输入产品码" />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="菜单名称">
              {getFieldDecorator('name')(<Input placeholder="请输入菜单名称" />)}
            </Item>
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
    const handleMultiDelete = () => {
      if (selectRows.length === 0) {
        message.warn('请至少选择一条数据')
        return
      }

      Modal.confirm({
        title: '删除确认',
        content: '确定删除选中记录?',
        onOk: () => {
          deleteMultiMenu({ ids: selectRows.join(',') }).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refreshList()
          })
        }
      })
    }

    return (
      <ButtonGroup>
        <Button auth="menu_add" to="/system/menu/add">
          新增
        </Button>
        <Button auth="menu_delete" onClick={handleMultiDelete} type="danger">
          删除
        </Button>
      </ButtonGroup>
    )
  }, [selectRows, refreshList])

  // 当列表进行选择时
  const rowSelection = useMemo(
    () => ({
      onChange: (key, records) => {
        setSelectRows(key)
      }
    }),
    []
  )

  return (
    <Card>
      {renderSearchForm()}
      {renderButtonGroup()}
      <Table rowKey={(i) => i.id} rowSelection={rowSelection} columns={columns} {...tableProps} />
    </Card>
  )
}

export default Form.create()(Menu)

// 同时获取所有孩子的id
function getIds(arr) {
  if (!arr) return []
  return arr.reduce((ids, item) => {
    if (Array.isArray(item.children)) {
      return ids.concat(getIds(item.children))
    }
    return ids.concat(item.id)
  }, [])
}
