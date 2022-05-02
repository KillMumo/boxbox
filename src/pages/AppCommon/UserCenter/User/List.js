import React, { useMemo, useCallback, useState } from 'react'
import { Row, Col, Form, Input, Button, message, Modal, Tree, Dropdown, Menu } from 'antd'
import { useBoolean, useTable, useRequest } from '@dragon/hooks'
import Table from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import Card from '@/components/Card'
import {
  getUserList,
  deleteUser,
  deleteMultiUser,
  grantUser,
  resetPassword
} from '@/services/userManagement'
import { tree as getRoleTree } from '@/services/role'
import { fetchParams } from '@/services/common'
import router from 'umi/router'

const { TreeNode } = Tree

const Item = Form.Item

const User = (props) => {
  const { refresh: refreshList, submit, reset, tableProps } = useTable(getUserList, {
    form: props.form
  })

  const { state: visible, setTrue: show, setFalse: close } = useBoolean(false)

  const { data: initPassword } = useRequest(() =>
    fetchParams({
      key: 'init_password'
    })
  )

  // 手动获取权限树
  const { data: roleTree = [], loading: getRoleTreeLoading, start: getRoleTreeReq } = useRequest(
    getRoleTree,
    {
      manual: true // 手动触发
    }
  )
  // 手动进行授权
  const { loading: grantLoading, start: grantUserReq } = useRequest(grantUser, {
    manual: true // 手动触发
  })

  // 选中的行
  const [selectRows, setSelectRows] = useState([])
  // 选中的tree key
  const [checkedTreeKeys, setCheckedTreeKeys] = useState([])

  // 列名
  const columns = useMemo(() => {
    const handleSingleDelete = (id) => {
      Modal.confirm({
        title: '移除后用户将无法登录当前平台，确定移除？',
        content: '注：您可通过【导入企业用户】操作重新添加并为其配置使用权限。',
        onOk: () => {
          return deleteUser(id).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refreshList()
          })
        }
      })
    }
    return [
      {
        title: '用户姓名',
        dataIndex: 'userName'
      },
      {
        title: '手机号',
        dataIndex: 'account'
      },
      {
        title: '所属角色',
        dataIndex: 'roleName'
      },
      {
        title: '操作',
        key: 'action',
        render: (t, r) => {
          return (
            // <ButtonGroup type="action">
            //   <Button auth="user_view" to={`/userCenter/user/view/${r.id}`}>
            //     查看
            //   </Button>
            //   {r.isShowDeleteButton && (
            //     <Button auth="user_edit" to={`/userCenter/user/edit/${r.id}`}>
            //       编辑
            //     </Button>
            //   )}
            //   {r.isShowDeleteButton && (
            //     <Button auth="user_delete" onClick={() => handleSingleDelete(r.id)}>
            //       移除
            //     </Button>
            //   )}
            // </ButtonGroup>

            <ButtonGroup type="action">
              <Button  to={`/userCenter/user/view/${r.id}`}>
                查看
              </Button>
              {r.isShowDeleteButton && (
                <Button  auth={"user_update"} to={`/userCenter/user/edit/${r.id}`}>
                  编辑
                </Button>
              )}
              {r.isShowDeleteButton && (
                <Button  auth={"user_delete"}  onClick={() => handleSingleDelete(r.id)}>
                  移除
                </Button>
              )}
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
            <Item label="手机号">
              {getFieldDecorator('account')(<Input placeholder="请输入手机号" />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="用户姓名">
              {getFieldDecorator('userName')(<Input placeholder="请输入姓名" />)}
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
        message.warn('请至少选择一位用户')
        return
      }

      Modal.confirm({
        title: '移除后用户将无法登录当前平台，确定移除？',
        content: '注：您可通过【导入企业用户】操作重新添加并为其配置使用权限。',
        onOk: () => {
          return deleteMultiUser({ ids: selectRows.join(',') }).then((res) => {
            if (res instanceof Error) return
            message.success('移除成功')
            refreshList()
          })
        }
      })
    }

    const handleResetPassword = () => {
      if (selectRows.length === 0) {
        message.warn('请至少选择一条数据')
        return
      }
      Modal.confirm({
        title: '重置密码确认',
        content: `确定将选择账号密码重置为${initPassword}?`,
        onOk: () => {
          return resetPassword({ userIds: selectRows }).then((res) => {
            if (res instanceof Error) return
            message.success('重置成功')
            refreshList()
          })
        }
      })
    }

    const handleSetRole = async () => {
      if (selectRows.length === 0) {
        message.warn('请至少选择一条数据')
        return
      }
      if (roleTree.length === 0) {
        await getRoleTreeReq()
      }
      show()
    }
    const onMenuClick = ({ key }) => {
      switch (key) {
        case 'import':
          router.replace('/userCenter/user/import')
          break
        case 'add':
          router.replace('/userCenter/user/add')
          break
        default:
          break
      }
    }
    const menu = (
      <Menu onClick={onMenuClick}>
        <Menu.Item key="import">
          <span>导入企业用户</span>
        </Menu.Item>
        <Menu.Item key="add">
          <span>添加新用户</span>
        </Menu.Item>
      </Menu>
    )

    return (
      <div style={{ display: 'flex' }}>
        {/* <Dropdown trigger={['click']} overlay={menu} placement="bottomLeft"> */}

        {/* </Dropdown> */}
        {/*<ButtonGroup>*/}
        {/*  <Button auth="user_delete" onClick={handleMultiDelete} type="danger">*/}
        {/*    移除*/}
        {/*  </Button>*/}
        {/*  <Button auth="user_role" loading={getRoleTreeLoading} onClick={handleSetRole}>*/}
        {/*    配置角色*/}
        {/*  </Button>*/}
        {/*  <Button auth="user_reset" onClick={handleResetPassword}>*/}
        {/*    重置密码*/}
        {/*  </Button>*/}
        {/*</ButtonGroup>*/}
        <ButtonGroup>
          <Button
            style={{ marginRight: 8 }}
            auth={"user_add"}
            // to="/userCenter/user/add"
            onClick={() => router.replace('/userCenter/user/add')}
            type="primary"
          >
            新增
          </Button>
          <Button auth={"user_batch_delete"}  onClick={handleMultiDelete} type="danger">
            移除
          </Button>
          <Button  auth={"user_set_role"} loading={getRoleTreeLoading} onClick={handleSetRole}>
            配置角色
          </Button>
          <Button  auth="user_reset_pass" onClick={handleResetPassword}>
            重置密码
          </Button>
        </ButtonGroup>

      </div>
    )
  }, [
    getRoleTreeLoading,
    getRoleTreeReq,
    initPassword,
    refreshList,
    roleTree.length,
    selectRows,
    show
  ])

  // 当列表进行选择时
  const rowSelection = useMemo(
    () => ({
      onChange: (key, records) => {
        setSelectRows(key)
      },
      getCheckboxProps: (r) => ({
        disabled: !r.isShowDeleteButton
      })
    }),
    []
  )

  const renderTreeModal = useCallback(() => {
    const renderTreeNodes = (roleTree) =>
      roleTree.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          )
        }
        return <TreeNode {...item} />
      })
    const handleGrant = () => {
      if (!checkedTreeKeys.checked?.length) {
        message.warning('请至少选择一条')
        return
      }
      const params = {
        userIds: selectRows.join(','),
        roleIds: checkedTreeKeys.checked.join(',')
      }

      grantUserReq(params).then((res) => {
        if (res instanceof Error) return
        message.success('授权成功')
        refreshList()
        close()
      })
    }
    return (
      <Modal
        title="权限配置"
        width={350}
        visible={visible}
        onOk={handleGrant}
        onCancel={close}
        confirmLoading={grantLoading}
      >
        <Tree
          checkable
          checkStrictly
          checkedKeys={checkedTreeKeys}
          onCheck={(keys) => setCheckedTreeKeys(keys)}
        >
          {renderTreeNodes(roleTree)}
        </Tree>
      </Modal>
    )
  }, [
    checkedTreeKeys,
    close,
    grantLoading,
    grantUserReq,
    refreshList,
    roleTree,
    selectRows,
    visible
  ])

  return (
    <Card>
      {renderSearchForm()}
      {renderButtonGroup()}
      <Table rowKey={(i) => i.id} rowSelection={rowSelection} columns={columns} {...tableProps} />
      {renderTreeModal()}
    </Card>
  )
}

export default Form.create()(User)
