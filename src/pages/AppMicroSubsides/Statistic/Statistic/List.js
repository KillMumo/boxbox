import React, { useMemo } from 'react'
import Card from '@/components/Card'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { Button, Form, Row, Col, Input } from 'antd'
import { searchFormLayout } from '@/common/config'
import { useTable } from '@dragon/hooks'
import { fetchList, fetchExcel } from '@/services/microSubsidy/statistic'
import { formatMoney, getCurrentDate } from '@/utils'

const List = (props) => {
  const {
    form: { getFieldDecorator }
  } = props

  //获取企业列表
  const { submit, reset, exportExcel, excelLoading, tableProps } = useTable(fetchList, fetchExcel, {
    form: props.form
  })

  //表头
  const columns = useMemo(() => {
    return [
      // {
      //   title: '企业编号',
      //   dataIndex: 'orgUid',
      //   // ellipsis: true,
      //   fixed: 'left',
      //   width: 160
      // },
      {
        title: '企业全称',
        dataIndex: 'orgName',
        // ellipsis: true,
        fixed: 'left',
        width: 240
      },
      {
        title: '申请担保次数',
        dataIndex: 'applyCount',
        ellipsis: true,
        align: 'right'
        // width: 110
      },
      {
        title: '担保申请通过次数',
        dataIndex: 'passCount',
        ellipsis: true,
        align: 'right'
        // width: 130
      },
      {
        title: '逾期次数',
        dataIndex: 'dueCount',
        ellipsis: true,
        align: 'right'
        // width: 100
      },
      {
        title: '申请担保金额(元)',
        dataIndex: 'applyAmount',
        align: 'right',
        ellipsis: true,
        // width: 130,
        render: (t) => formatMoney(t)
      },
      {
        title: '放款金额(元)',
        dataIndex: 'loanAmount',
        align: 'right',
        ellipsis: true,
        // width: 130,
        render: (t) => formatMoney(t)
      },
      {
        title: '结清金额(元)',
        dataIndex: 'payAmount',
        align: 'right',
        ellipsis: true,
        // width: 130,
        render: (t) => formatMoney(t)
      },
      {
        title: '在保余额(元)',
        dataIndex: 'backAmount',
        align: 'right',
        ellipsis: true,
        // width: 130,
        render: (t) => formatMoney(t)
      },
      {
        title: '操作',
        key: 'action',
        ellipsis: true,
        width: 100,
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button to={`/msStatistic/statistic/view/${r.orgId}`}>查看</Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  //搜索框
  const renderSearchForm = () => {
    const handleExport = () => {
      const fileName = `数据统计列表_${getCurrentDate()}.xls`
      exportExcel(fileName)
    }
    return (
      <Form {...searchFormLayout} onSubmit={submit}>
        <Row gutter={24}>
          {/* <Col span={8}>
            <Form.Item label="企业编号">
              {getFieldDecorator('orgUid')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item label="企业全称">
              {getFieldDecorator('orgName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={reset}>重置</Button>
              <Button
                auth="数据统计-列表页-导出Excel"
                loading={excelLoading}
                onClick={handleExport}
              >
                导出excel
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    )
  }
  return (
    <Card>
      {renderSearchForm()}
      <PagingTable
        rowKey={(i) => i.orgUid}
        columns={columns}
        {...tableProps}
        scroll={{ x: 1340 }}
      />
    </Card>
  )
}

export default Form.create()(List)
