import React, { useMemo, useCallback } from 'react'
import { Form, Button } from 'antd'
import Card from '@/components/Card'
import Table from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
// import { useTable } from '@dragon/hooks'

const List = (props) => {
  // const { tableProps } = useTable(getAllBankList)

  const dataSource = [
    {
      key: '1',
      userRealName: '测试',
      userPhone: 12324567,
      userStatusDesc: '有效',
      posNameSet: ['复核员', '操作员', '管理员'],
      cmyName: '杭州趣链科技有限公司',
      cmyTypeNameSet: ['飞洛平台方']
    }
  ]

  // 表格列
  const columns = useMemo(() => {
    return [
      {
        title: '姓名',
        dataIndex: 'userRealName'
      },
      {
        title: '手机号',
        dataIndex: 'userPhone'
      },
      {
        title: '状态',
        dataIndex: 'userStatusDesc'
      },
      {
        title: '账户角色',
        dataIndex: 'posNameSet',
        render: (text) => text.join(',')
      },
      {
        title: '所属企业',
        dataIndex: 'cmyName'
      },
      {
        title: '企业类型',
        dataIndex: 'cmyTypeNameSet',
        render: (text) => text.join(',')
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (t, r) => (
          <ButtonGroup type="action">
            <Button auth="enterpriseUsers_view" to={`/userCenter/enterpriseUsers/view/${r.id}`}>
              查看
            </Button>
            <Button
              auth="enterpriseUsers_grant"
              to={`/userCenter/enterpriseUsers/accredit/${r.id}`}
            >
              授权
            </Button>
          </ButtonGroup>
        )
      }
    ]
  }, [])

  // 左侧按钮组
  const renderButtonGroup = useCallback(() => {
    return (
      <ButtonGroup>
        <Button auth="enterpriseUsers_add" type="primary" to="/userCenter/enterpriseUsers/add">
          添加用户
        </Button>
      </ButtonGroup>
    )
  }, [])

  return (
    <Card>
      {renderButtonGroup()}
      {/*<Table rowKey={(i) => i.id} columns={columns} {...tableProps} />*/}
      <Table dataSource={dataSource} columns={columns} />
    </Card>
  )
}

export default Form.create()(List)
