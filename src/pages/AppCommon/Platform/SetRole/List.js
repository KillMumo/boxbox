import React, { useMemo } from 'react'
import { Input, Select, Row, Col, Button } from 'antd'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { useTable } from '@dragon/hooks'
import Card from '@/components/Card'
import { checkList } from '@/services/platform'
import { CompanyStatus } from '@/common/map'
import useDict from '@/hooks/useDict'

const { Search } = Input

const List = () => {
  const orgType = useDict('org_type')

  // 列表查询
  const { searchBy, tableProps } = useTable(checkList, {
    defaultFilters: { status: CompanyStatus.enum['已审核'], orgType: '0' }
  })

  const columns = useMemo(() => {
    const basePath = '/platform/setRole'
    const actionMap = {
      // 已审核
      [CompanyStatus.enum['已审核']]: (record) => {
        return [
          {
            name: '设置角色',
            to: `${basePath}/set/${record.id}`,
            disabled: record.orgType !== '4' // 供应链企业
          }
        ]
      }
    }
    return [
      {
        title: '企业名称',
        dataIndex: 'orgName',
        width: 240
      },
      {
        title: '企业类型',
        dataIndex: 'orgType',
        width: 120,
        render: (t) => orgType[t]
      },
      {
        title: '管理员',
        dataIndex: 'admin',
        width: 120
      },
      {
        title: '手机号',
        dataIndex: 'adminPhone',
        key: 'adminPhone',
        width: 140
      },
      {
        title: '操作',
        dataIndex: 'handle',
        align: 'center',
        render: (text, record) => (
          <ButtonGroup type="action" align="center">
            {actionMap[record.status] &&
              actionMap[record.status](record).map(({ name, to, ...extra }) => (
                <Button key={name} to={to} {...extra}>
                  {name}
                </Button>
              ))}
          </ButtonGroup>
        )
      }
    ]
  }, [orgType])

  const handleTableFilter = (value, key) => {
    searchBy((r) => ({ ...r, [key]: value }))
  }

  return (
    <Card>
      <Row gutter={18} style={{ marginBottom: 16 }}>
        <Col span={3}>
          <Select
            style={{ width: '100%' }}
            defaultValue="0"
            onChange={(v) => handleTableFilter(v, 'orgType')}
          >
            <Select value="0">全部企业类型</Select>
            {Object.keys(orgType).map((key) => (
              <Select.Option key={key} value={orgType[key]}>
                {orgType[key]}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <Search
            style={{ width: '100%' }}
            placeholder="输入企业名称"
            onSearch={(v) => handleTableFilter(v, 'orgName')}
          />
        </Col>
        <Col style={{ float: 'right' }}>
          <Button>导出excel</Button>
        </Col>
      </Row>
      <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
    </Card>
  )
}

export default List
