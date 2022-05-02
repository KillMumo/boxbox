import React, { useMemo, useCallback, useState } from 'react'
import Card from '@/components/Card'
import PagingTable from '@/components/PagingTable'
import {
  getInterfaceMenuList,
  getInterfaceList,
  addInterface,
  deleteInterface,
  updateInterface
} from '@/services/interface'
import { Drawer, Modal, message, Form, Button, Col, Row, Input } from 'antd'
import { useBoolean, useTable, useRequest } from '@dragon/hooks'
import ButtonGroup from '@/components/ButtonGroup'

const { TextArea } = Input

const DrawerWithModal = Form.create()((props) => {
  const {
    form: { getFieldDecorator, getFieldsValue, resetFields, validateFields },
    menuId
  } = props

  // 接口详情弹出框的信息 其中check为true表示查看
  const [interfaceInfo, setInterfaceInfo] = useState({})

  const { state: modalVisible, toggle: toggleModal } = useBoolean()

  // 新增和更新
  const { loading: addInterfaceLoading, start: addInterfaceReq } = useRequest(addInterface, {
    manual: true
  })
  const { loading: updateInterfaceLoading, start: updateInterfaceReq } = useRequest(
    updateInterface,
    {
      manual: true
    }
  )

  const {
    refresh: refreshInterfaceList,
    searchBy: searchInterfaceBy,
    tableProps: interfaceTableProps
  } = useTable((params) => getInterfaceList({ ...params, menuId }))

  const handleEditOrCheck = useCallback(
    (interfaceRecord, check) => {
      setInterfaceInfo({
        ...interfaceRecord,
        check
      })
      toggleModal(true)
    },
    [toggleModal]
  )

  const handleDelete = useCallback(
    (interfaceId) => {
      Modal.confirm({
        title: '删除确认',
        content: '确定删除选中记录?',
        onOk: () => {
          return deleteInterface(interfaceId).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refreshInterfaceList()
          })
        }
      })
    },
    [refreshInterfaceList]
  )

  const interfaceColumns = useMemo(
    () => [
      {
        title: '权限名称',
        dataIndex: 'name'
      },
      {
        title: '权限字符串',
        dataIndex: 'code'
      },
      {
        title: '权限路由',
        dataIndex: 'path'
      },
      {
        title: '操作',
        key: 'action',
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button onClick={() => handleEditOrCheck(r, false)}>修改</Button>
              <Button onClick={() => handleDelete(r.id)}>删除</Button>
              <Button onClick={() => handleEditOrCheck(r, true)}>查看</Button>
            </ButtonGroup>
          )
        }
      }
    ],
    [handleDelete, handleEditOrCheck]
  )

  const renderInterfaceForm = useCallback(() => {
    const formLayout = {
      labelAlign: 'left',
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      colon: false
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const result = getFieldsValue()

      searchInterfaceBy((r) => ({
        code: result.interfaceCode,
        name: result.interfaceName
      }))
    }

    return (
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="权限编号">
              {getFieldDecorator('interfaceCode')(<Input placeholder="请输入权限编号" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="权限名称">
              {getFieldDecorator('interfaceName')(<Input placeholder="请输入权限名称" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
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
  }, [getFieldDecorator, getFieldsValue, resetFields, searchInterfaceBy])

  const handleAddInterface = useCallback(() => {
    setInterfaceInfo({})
    toggleModal(true)
  }, [toggleModal])

  const renderButtonGroup = useCallback(() => {
    return (
      <ButtonGroup>
        <Button type="primary">
          <a onClick={handleAddInterface}>新增</a>
        </Button>
      </ButtonGroup>
    )
  }, [handleAddInterface])

  // 渲染弹出框
  const renderModal = useCallback(() => {
    const handleInterfaceSubmit = (e) => {
      e.preventDefault()
      validateFields((err, values) => {
        if (!err) {
          const action = interfaceInfo.check === void 0 ? addInterfaceReq : updateInterfaceReq
          const params = {
            code: values.code,
            name: values.name,
            path: values.path,
            remark: values.remark,
            menuId,
            id: interfaceInfo.id
          }
          // 如果是查看，直接关闭
          if (interfaceInfo.check) {
            toggleModal(false)
          } else {
            action(params).then((res) => {
              if (res instanceof Error) return
              message.success(`${interfaceInfo.check === void 0 ? '添加' : '更新'}成功`)
              setInterfaceInfo({})
              toggleModal(false)
              refreshInterfaceList()
            })
          }
        }
      })
    }

    return (
      <Modal
        width={820}
        title="数据权限配置"
        visible={modalVisible}
        destroyOnClose
        confirmLoading={addInterfaceLoading || updateInterfaceLoading}
        onCancel={() => {
          toggleModal(false)
          setInterfaceInfo({})
        }}
        onOk={handleInterfaceSubmit}
      >
        <Form hideRequiredMark>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item label="权限字符串">
                {getFieldDecorator('code', {
                  initialValue: interfaceInfo.code,
                  rules: [
                    {
                      required: true,
                      message: '请输入权限字符串'
                    }
                  ]
                })(<Input disabled={!!interfaceInfo.check} placeholder="请输入权限字符串" />)}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="权限名字">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入权限名字'
                    }
                  ],
                  initialValue: interfaceInfo.name
                })(<Input disabled={!!interfaceInfo.check} placeholder="请输入权限名字" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item label="路由权限">
                {getFieldDecorator('path', {
                  rules: [
                    {
                      required: true,
                      message: '请输入路由权限'
                    }
                  ],
                  initialValue: interfaceInfo.path
                })(<Input disabled={!!interfaceInfo.check} placeholder="请输入路由权限" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={20}>
              <Form.Item labelAlign="left" label="备注">
                {getFieldDecorator('remark', {
                  initialValue: interfaceInfo.remark
                })(<TextArea disabled={!!interfaceInfo.check} rows={4} placeholder="请输入备注" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }, [
    addInterfaceLoading,
    addInterfaceReq,
    getFieldDecorator,
    interfaceInfo.check,
    interfaceInfo.code,
    interfaceInfo.id,
    interfaceInfo.name,
    interfaceInfo.path,
    interfaceInfo.remark,
    menuId,
    modalVisible,
    refreshInterfaceList,
    toggleModal,
    updateInterfaceLoading,
    updateInterfaceReq,
    validateFields
  ])

  return (
    <React.Fragment>
      {renderInterfaceForm()}
      {renderButtonGroup()}
      <PagingTable rowKey={(i) => i.id} columns={interfaceColumns} {...interfaceTableProps} />
      {renderModal()}
    </React.Fragment>
  )
})

const List = (props) => {
  // 点击配置选中的menuId
  const [menuId, setMenuId] = useState(void 0)

  // 菜单表格
  const { searchBy: setMenuFilters, tableProps: menuTableProps } = useTable(getInterfaceMenuList)

  // 抽屉可见
  const { state: visible, toggle: toggleDrawer } = useBoolean()

  const columns = useMemo(() => {
    const handleConfigure = (menuId) => {
      setMenuId(menuId)
      toggleDrawer(true)
    }

    return [
      {
        title: '菜单名称',
        dataIndex: 'name'
      },
      {
        title: '菜单编号',
        dataIndex: 'code'
      },
      {
        title: '菜单别名',
        dataIndex: 'alias'
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
              <Button onClick={() => handleConfigure(r.id)}>配置</Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [toggleDrawer])

  // 渲染菜单的查询表单
  const renderSearchForm = useCallback(() => {
    const {
      form: { getFieldDecorator }
    } = props

    const formLayout = {
      labelAlign: 'left',
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const {
        form: { getFieldsValue }
      } = props
      const result = getFieldsValue()

      setMenuFilters({
        code: result.menuCode,
        name: result.menuName
      })
    }

    const handleReset = () => {
      const {
        form: { resetFields }
      } = props
      resetFields()
    }

    return (
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="菜单编号">
              {getFieldDecorator('menuCode')(<Input placeholder="请输入菜单编号" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="菜单名称">
              {getFieldDecorator('menuName')(<Input placeholder="请输入菜单名称" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <ButtonGroup align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    )
  }, [props, setMenuFilters])

  return (
    <Card>
      {renderSearchForm()}
      <PagingTable rowKey={(i) => i.id} columns={columns} {...menuTableProps} />
      <Drawer
        visible={visible}
        closable
        destroyOnClose
        width={1100}
        onClose={() => toggleDrawer(false)}
      >
        <DrawerWithModal menuId={menuId} />
      </Drawer>
    </Card>
  )
}

export default Form.create()(List)
