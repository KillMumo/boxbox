import React, { useMemo, useCallback, useState } from 'react'
import { Col, Input, Row, Form, Button, Modal, message, Tabs, Tree } from 'antd'
import Card from '@/components/Card'
import { Link } from 'react-router-dom'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { getRoleList } from '@/services/role'
import { deleteRole, getMenuGrantTree, getCheckedMenuTreeKeys, roleGrant } from '@/services/role'
import { useTable, useBoolean, useRequest } from '@dragon/hooks'
import { useSelector } from 'react-redux'

const List = (props) => {
  const [prodCode, setProdCode] = useState('')

  const { roleCodes } = useSelector(({ user }) => user.user)
  const isRoot = roleCodes?.includes('root')

  // 获取菜单授权树
  const {
    loading: getMenuGrantTreeLoading,
    data: menuGrantTree = [],
    start: getMenuGrantTreeReq
  } = useRequest(getMenuGrantTree, { manual: true })

  // 菜单选中的treeKey
  const {
    loading: getCheckedMenuTreeLoading,
    data: checkedMenuTreeKeys = [],
    setData: setCheckedMenuTreeKeys,
    start: getCheckedMenuTreeKeysReq
  } = useRequest(getCheckedMenuTreeKeys, {
    manual: true
  })

  // 进行授权
  const { loading: roleGrantLoading, start: roleGrantReq } = useRequest(roleGrant, {
    manual: true
  })

  // modal的开关
  const { state: visible, setTrue: showModal, setFalse: closeModal } = useBoolean()

  // 选中的rowId
  const [selectRows, setSelectRows] = useState([])

  // 表格hook
  const { refresh: refreshList, searchBy, reset, tableProps } = useTable(getRoleList, {
    form: props.form
  })

  const columns = useMemo(() => {
    const handleDelete = (id) => {
      Modal.confirm({
        title: '删除确认',
        content: '确定删除选中记录?',
        onOk: () => {
          return deleteRole(id).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refreshList()
          })
        }
      })
    }

    return [
      {
        title: '角色名称',
        dataIndex: 'roleName'
      },
      {
        title: '角色码',
        dataIndex: 'roleCode'
      },
      {
        title: '排序',
        dataIndex: 'sort'
      },
      {
        title: '操作',
        key: 'action',
        render: (t, r) => {
          const { isInited } = r
          return (
            <ButtonGroup type="action">
              <Button  to={`/authority/role/view/${r.id}`}>
                详情
              </Button>
              {isInited !== 1 && (
                <Button  to={`/authority/role/edit/${r.id}`} auth={"role_update"}>
                  修改
                </Button>
              )}
              {isInited !== 1 && <Button onClick={() => handleDelete(r.id)} auth={"role_delete"}>删除</Button>}
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

    return (
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="角色名称">
              {getFieldDecorator('roleName')(<Input placeholder="请输入角色名称" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="角色别名">
              {getFieldDecorator('roleAlias')(<Input placeholder="请输入角色别名" />)}
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
  }, [props, reset, searchBy])

  // 当列表进行选择时
  const rowSelection = useMemo(
    () => ({
      onChange: (key, records) => {
        setProdCode(records[records.length - 1]?.prodCode)
        setSelectRows(key)
      },
      getCheckboxProps: (r) => {
        return { disabled: r.isInited === 1 }
      }
    }),
    []
  )

  const renderButtonGroup = useCallback(() => {
    const handleRoleGrant = () => {
      if (selectRows.length !== 1) {
        message.warn('只能选择一条')
        return
      }
      getMenuGrantTreeReq({
        prodCode: isRoot ? prodCode : void 0
      })
        .then((res) => {
          return getCheckedMenuTreeKeysReq({
            roleIds: selectRows[0]
          })
        })
        .then((res) => {
          if (res instanceof Error) return
          showModal()
        })
    }
    return (
      <ButtonGroup>
        <Button  type="primary"  auth={"role_add"}>
          <Link to="/authority/role/add" >新增</Link>
        </Button>
        <Button
          auth={"role_administration"}
          loading={getCheckedMenuTreeLoading || getMenuGrantTreeLoading}
          onClick={handleRoleGrant}
        >
          权限设置
        </Button>
      </ButtonGroup>
    )
  }, [
    getCheckedMenuTreeKeysReq,
    getCheckedMenuTreeLoading,
    getMenuGrantTreeLoading,
    getMenuGrantTreeReq,
    isRoot,
    prodCode,
    selectRows,
    showModal
  ])

  const renderModal = () => {
    const handleGrant = () => {
      roleGrantReq({
        roleIds: selectRows[0],
        menuIds: checkedMenuTreeKeys.join(',')
      }).then((res) => {
        if (res instanceof Error) return
        message.success('配置成功')
        closeModal()
      })
    }

    const handleMenuTreeCheck = ({ checked: checkedTreeKeys }) => {
      setCheckedMenuTreeKeys(checkedTreeKeys)
    }

    const renderTreeNodes = (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <Tree.TreeNode title={item.name} key={item.id}>
              {renderTreeNodes(item.children)}
            </Tree.TreeNode>
          )
        }
        return <Tree.TreeNode title={item.name} key={item.id} />
      })
    }

    return (
      <Modal
        title="权限配置"
        width={400}
        destroyOnClose
        confirmLoading={roleGrantLoading}
        visible={visible}
        onCancel={closeModal}
        onOk={handleGrant}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="菜单权限" key="1">
            <Tree
              checkStrictly
              checkable
              checkedKeys={checkedMenuTreeKeys}
              onCheck={handleMenuTreeCheck}
            >
              {renderTreeNodes(menuGrantTree)}
            </Tree>
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="数据权限" key="2">
            暂未开通
            <Tree checkable checkedKeys={checkedDataTreeKeys} onCheck={handleDataTreeCheck}>
              {renderTreeNodes(dataGrantTree)}
            </Tree>
          </Tabs.TabPane>
          <Tabs.TabPane tab="接口权限" key="3">
            暂未开通
            <Tree checkable checkedKeys={checkedInterfaceTreeKeys} onCheck={handleInterfaceTreeCheck}>
              {renderTreeNodes(interfaceGrantTree)}
            </Tree>
          </Tabs.TabPane> */}
        </Tabs>
      </Modal>
    )
  }

  return (
    <Card>
      {renderSearchForm()}
      {renderButtonGroup()}
      <PagingTable
        rowSelection={rowSelection}
        rowKey={(i) => i.id}
        columns={columns}
        {...tableProps}
      />
      {renderModal()}
    </Card>
  )
}

export default Form.create()(List)
