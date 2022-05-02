import React, { useMemo } from 'react'
import Card from '@/components/Card'
import PagingTable from '@/components/PagingTable'
import { Form, Input, Row, Col, Button, Select, Badge } from 'antd'
import { searchFormLayout } from '@/common/config'
import ButtonGroup from '@/components/ButtonGroup'
import { useTable, useRequest } from '@dragon/hooks'
import { fetchPostLoanList, fetchExcel } from '@/services/microSubsidy/postLoan'
import { formatMoney, getCurrentDate } from '@/utils'
import router from 'umi/router'
import { fetchBankList } from '@/services/common'
import { financeStatus } from '../common/dict'

const List = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props

  const { searchBy, submit, exportExcel, excelLoading, tableProps } = useTable(
    fetchPostLoanList,
    fetchExcel,
    {
      defaultFilters: { bizStatus: type },
      form: props.form
    }
  )

  const { data: bankList = [] } = useRequest(fetchBankList)

  const columns = useMemo(() => {
    const getActionMap = (r) => ({
      待还款: {
        name: '查看',
        props: { to: `/msPostLoan/management/view/${r.bizNo}` }
      },
      逾期未还清: { name: '查看', props: { to: `/msPostLoan/management/view/${r.bizNo}` } },
      逾期已还清: {
        name: '查看',
        props: { to: `/msPostLoan/management/view/${r.bizNo}` }
      },
      已还清: { name: '查看', props: { to: `/msPostLoan/management/view/${r.bizNo}` } }
    })

    return [
      {
        title: '担保编号',
        dataIndex: 'bizNo',
        // ellipsis: true,
        fixed: 'left',
        width: 140
      },
      {
        title: '申请企业',
        dataIndex: 'extra.orgName',
        // ellipsis: true,
        fixed: 'left',
        width: 220
      },
      {
        title: '所属行业',
        dataIndex: 'extra.orgType',
        ellipsis: true
        // width: 180
      },
      {
        title: '申请担保金额(元)',
        dataIndex: 'extra.applyFinanceAmount',
        align: 'right',
        ellipsis: true,
        // width: 140,
        render: (t) => formatMoney(t)
      },
      {
        title: '放款金额(元)',
        dataIndex: 'extra.loanPayAmount',
        align: 'right',
        ellipsis: true,
        // width: 150,
        render: (t) => formatMoney(t)
      },
      {
        title: '放款银行',
        dataIndex: 'extra.loanPayBankName',
        // ellipsis: true,
        width: 120
      },
      {
        title: '约定还款日',
        dataIndex: 'extra.loanAppointDate',
        // ellipsis: true,
        width: 120
      },
      {
        title: '状态',
        dataIndex: 'bizStatus',
        // ellipsis: true,
        width: 140,
        render: (t) => <Badge color={financeStatus[t]?.color} text={financeStatus[t]?.name} />
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        ellipsis: true,
        render: (t, r) => {
          const button = getActionMap(r)[r.bizStatus]
          return (
            button && (
              <ButtonGroup type="action">
                <Button {...button.props}>{button.name}</Button>
              </ButtonGroup>
            )
          )
        }
      }
    ]
  }, [])

  const renderSearchForm = () => {
    const handleSelect = (v) => {
      router.push(`/msPostLoan/management/${v}`)
      searchBy((r) => ({ ...r, bizStatus: v }))
    }

    const handleBankSelect = (v) => {
      // router.push(`/msPostLoan/management/${v}`)
      searchBy((r) => ({ ...r, payBankName: v }))
    }

    const handleReset = () => {
      router.push(`/msPostLoan/management/全部`)
      resetFields()
      searchBy({ bizStatus: '全部' })
    }

    const handleExport = () => {
      const fileName = `保后检查列表_${getCurrentDate()}.xls`
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
              <Form.Item label="申请企业">
                {getFieldDecorator('orgName')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="放款银行">
                {getFieldDecorator('payBankName')(
                  <Select placeholder="请选择" onSelect={handleBankSelect}>
                    {bankList.map((i) => (
                      <Select.Option key={i.bankName} value={i.bankName}>
                        {i.bankName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="状态">
                {getFieldDecorator('bizStatus', {
                  initialValue: type
                })(
                  <Select onSelect={handleSelect}>
                    <Select.Option value="全部">全部</Select.Option>
                    <Select.Option value="待还款">待还款</Select.Option>
                    <Select.Option value="逾期未还清">逾期未还清</Select.Option>
                    <Select.Option value="逾期已还清">逾期已还清</Select.Option>
                    <Select.Option value="已还清">已还清</Select.Option>
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
                <Button
                  auth="贷后监管-贷后管理-列表页-导出Excel-国投"
                  loading={excelLoading}
                  onClick={handleExport}
                >
                  导出excel
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
        <PagingTable rowKey={(i) => i.id} scroll={{ x: 1530 }} columns={columns} {...tableProps} />
      </Card>
    </Card>
  )
}

export default Form.create()(List)
