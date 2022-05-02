import React, { useMemo } from 'react'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { useTable } from '@dragon/hooks'
import { formatTime } from '@/utils'
import { fetchFinanceList, fetchFinanceExcel } from '@/services/microSubsidy/finance'
import { Form, Input, Row, Col, Button, Select, Table } from 'antd'
import { searchFormLayout } from '@/common/config'

const List = (props) => {
  const {
    form: { getFieldDecorator }
  } = props

  const { refresh, searchBy, submit, exportExcel, excelLoading, tableProps } = useTable(
    fetchFinanceList,
    fetchFinanceExcel,
    {
      defaultFilters: { bizStatus: '全部' },
      form: props.form
    }
  )

  const data = [
    {
      key: '1',
      name: '设备1',
      id: 'F202009034501',
      onlyId: '20200813113036nRCJ',
      createDate: 1599129136376,
      enableDate: 1599129136376,
      refreshDate: 1599129136376,
      status: '待启用'
    },
    {
      key: '2',
      name: '设备2',
      id: 'F202009026269',
      onlyId: '20200813113036nRCJ',
      createDate: 1599040401842,
      enableDate: 1599040401842,
      refreshDate: 1599040401842,
      status: '待启用'
    },
    {
      key: '3',
      name: '设备3',
      id: 'F202008283631',
      onlyId: '20200813113036nRCJ',
      createDate: 1598604198120,
      enableDate: 1598604198120,
      refreshDate: 1598604198120,
      status: '待启用'
    }
  ]

  //表头
  const columns = useMemo(() => {
    return [
      {
        title: '设备ID',
        dataIndex: 'id',
        // fixed: 'left',
        width: 100
      },
      {
        title: '设备名称',
        dataIndex: 'name',
        // fixed: 'left',
        width: 100
      },
      {
        title: '设备唯一码',
        dataIndex: 'onlyId',
        width: 120,
        ellipsis: true
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        width: 80,
        render: (t) => formatTime(t, 'ymd')
      },
      {
        title: '激活时间',
        dataIndex: 'enableDate',
        width: 80,
        render: (t) => formatTime(t, 'ymd')
      },
      {
        title: '更新时间',
        dataIndex: 'refreshDate',
        width: 80,
        render: (t) => formatTime(t, 'ymd')
      },
      {
        title: '设备状态',
        dataIndex: 'status',
        width: 80
      },
      {
        title: '操作',
        key: 'action',
        width: 80,
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button to={`/device/list/view/${r.id}`}>查看</Button>
              {/* {r.status === "" ? } */}
              <Button>启用</Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  const renderSearchForm = () => {
    return (
      <Card>
        <Form {...searchFormLayout} onSubmit={submit}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="资产ID">
                {getFieldDecorator('bizNo')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="资产名称">
                {getFieldDecorator('orgName')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="状态">
                {getFieldDecorator('bizStatus')(
                  <Select>
                    <Select.Option key="全部">全部</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            {/* <Col span={8}>
              <Form.Item label="状态">
                {getFieldDecorator('bizStatus', {
                  initialValue: type
                })(
                  <Select onSelect={handleSelect}>
                    {bizStatus.map((b) => (
                      <Select.Option value={b} key={b}>
                        {b}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col> */}
            <Col span={8}>
              <ButtonGroup type="form" align="left">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button>重置</Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  return (
    <Card transparent>
      {renderSearchForm()}
      <Card style={{ marginTop: -10 }}>
        <Table rowKey={(i) => i.id} columns={columns} dataSource={data} />
      </Card>
    </Card>
  )
}

export default Form.create()(List)
