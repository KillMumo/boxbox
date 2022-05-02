import React, { useMemo } from 'react'
import Card from '@/components/Card'
import PagingTable from '@/components/PagingTable'
import { Form, Input, Row, Col, Button, Select, Tag } from 'antd'
import { searchFormLayout } from '@/common/config'
import ButtonGroup from '@/components/ButtonGroup'
import { useTable } from '@dragon/hooks'
import { formatMoney, getCurrentDate } from '@/utils'
import { fetchMonitorList, fetchMonitorExcel } from '@/services/microSubsidy/postLoan'
import router from 'umi/router'
import { warning } from './../../common/dict'
import Link from 'umi/link'

const List = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props

  const { searchBy, submit, tableProps, exportExcel, excelLoading } = useTable(
    fetchMonitorList,
    fetchMonitorExcel,
    {
      form: props.form
    }
  )

  const columns = useMemo(() => {
    return [
      {
        title: '预警时间',
        fixed: 'left',
        dataIndex: 'warningTime',
        ellipsis: true,
        width: 140
      },
      {
        title: '预警等级',
        fixed: 'left',
        dataIndex: 'level',
        ellipsis: true,
        width: 100,
        render: (t) => <Tag color={warning[t]?.color}>{t}</Tag>
      },
      {
        title: '预警因子',
        dataIndex: 'warningType',
        ellipsis: true,
        width: 140
      },
      {
        title: '预警值',
        dataIndex: 'warningValue',
        align: 'right',
        ellipsis: true,
        width: 80
      },
      {
        title: '监控企业',
        dataIndex: 'orgName',
        ellipsis: true,
        width: 220
      },
      {
        title: '担保编号',
        dataIndex: 'bizNo',
        ellipsis: true,
        width: 140
      },
      {
        title: '放款金额(元)',
        dataIndex: 'amount',
        align: 'right',
        ellipsis: true,
        width: 150,
        render: (t) => formatMoney(t)
      },
      {
        title: '约定还款日',
        dataIndex: 'payDate',
        ellipsis: true,
        width: 120
      },
      {
        title: '累计预警因子数',
        dataIndex: 'accumulateWarningValue',
        align: 'right',
        ellipsis: true,
        width: 140
      },
      {
        title: '操作',
        key: 'action',
        width: 180,
        ellipsis: true,
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button to={`/msPostLoan/management/view/${r.bizNo}`}>保后详情</Button>
              <Button>
                <Link to={`/report/monitor/${r.bizNo}`} target="_blank">
                  监控报告
                </Link>
              </Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  const renderSearchForm = () => {
    const handleSelect = (v) => {
      searchBy((r) => ({ ...r, level: v }))
    }

    const handleReset = () => {
      router.push(`/msPostLoan/monitor/list/全部`)
      resetFields()
      searchBy({})
    }

    const handleExport = () => {
      const fileName = `风险预警列表_${getCurrentDate()}.xls`
      exportExcel(fileName)
    }

    return (
      <Card>
        <Form {...searchFormLayout} onSubmit={submit}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="担保编号">
                {getFieldDecorator('bizNo')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="监控企业">
                {getFieldDecorator('orgName')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="预警因子">
                {getFieldDecorator('warningType')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="预警等级">
                {getFieldDecorator('level', {
                  initialValue: type
                })(
                  <Select onSelect={handleSelect}>
                    <Select.Option value="全部">全部</Select.Option>
                    <Select.Option value="高">高</Select.Option>
                    <Select.Option value="中">中</Select.Option>
                    <Select.Option value="低">低</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={16}>
              <ButtonGroup type="form" align="right">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
                {/* <Button loading={excelLoading} onClick={() => exportExcel('企业监控列表.xls')}> */}
                <Button loading={excelLoading} onClick={handleExport}>
                  导出Excel
                </Button>
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
        <PagingTable rowKey={(i) => i.id} scroll={{ x: 1560 }} columns={columns} {...tableProps} />
      </Card>
    </Card>
  )
}

export default Form.create()(List)
