import React, { useMemo } from 'react'
import Card from '@/components/Card'
import PagingTable from '@/components/PagingTable'
import { Form, Input, Row, Col, Button, Select, Badge, Modal, message } from 'antd'
import { searchFormLayout } from '@/common/config'
import ButtonGroup from '@/components/ButtonGroup'
import { useTable, useRequest } from '@dragon/hooks'
import {
  fetchFinanceList,
  deleteOne,
  bizStatusOption,
  fetchFinanceExcel
} from '@/services/microSubsidy/companyFinance'
import router from 'umi/router'
import { formatMoney, getCurrentDate } from '@/utils'
import { companyFinanceStatus } from '../common/dict'

const List = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props

  const { refresh, searchBy, submit, exportExcel, excelLoading, tableProps } = useTable(
    fetchFinanceList,
    fetchFinanceExcel,
    {
      defaultFilters: { bizStatus: type },
      form: props.form
    }
  )

  //获取状态下拉框数据
  const { data: bizStatus = [] } = useRequest(bizStatusOption)

  const columns = useMemo(() => {
    const handleDelete = (p) => {
      Modal.confirm({
        title: '确定删除？',
        content: '删除后不可恢复',
        onOk: () => {
          return deleteOne(p).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refresh()
          })
        }
      })
    }

    const getActionMap = (record) => ({
      已暂存: [
        {
          name: '编辑',
          props: {
            auth: '融资管理-列表页-编辑-企业',
            to: `/msCompanyFinance/edit/${record.bizNo}`
          }
        },
        {
          name: '删除',
          props: {
            auth: '融资管理-列表页-删除-企业',
            onClick: () => handleDelete({ bizNo: record.bizNo })
          }
        }
      ],
      待审批: [
        {
          name: '查看',
          props: { to: `/msCompanyFinance/view/${record.bizNo}` }
        }
      ],
      待企业提交: [
        {
          name: '查看',
          props: { to: `/msCompanyFinance/view/${record.bizNo}` }
        }
      ],
      待放款: [{ name: '查看', props: { to: `/msCompanyFinance/view/${record.bizNo}` } }]
    })

    return [
      {
        title: '担保编号',
        dataIndex: 'bizNo',
        fixed: 'left',
        // ellipsis: true,
        width: 160
      },
      {
        title: '申请担保金额(元)',
        dataIndex: 'extra.applyFinanceAmount',
        align: 'right',
        ellipsis: true,
        // width: 150,
        render: (t) => formatMoney(t)
      },
      {
        title: '预计还款日',
        dataIndex: 'extra.paymentDate',
        ellipsis: true
        // width: 120
      },
      // {
      //   title: '融资开户行',
      //   dataIndex: 'extra.bankSiteName',
      //   ellipsis: true,
      //   width: 120
      // },
      {
        title: '状态',
        dataIndex: 'bizStatus',
        ellipsis: true,
        // width: 160,
        render: (t) => <Badge color={companyFinanceStatus[t]?.color} text={t} />
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        ellipsis: true,
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              {getActionMap(r)[r.bizStatus]?.map((b) => (
                <Button key={b.name} {...b.props}>
                  {b.name}
                </Button>
              ))}
            </ButtonGroup>
          )
        }
      }
    ]
  }, [refresh])

  const renderSearchForm = () => {
    const handleSelect = (v) => {
      router.push(`/msCompanyFinance/list/${v}`)
      searchBy((r) => ({ ...r, bizStatus: v }))
    }

    const handelReset = () => {
      router.push(`/msCompanyFinance/list/全部`)
      resetFields()
      searchBy({ bizStatus: '全部' })
    }

    const handleExport = () => {
      const fileName = `担保办理列表_${getCurrentDate()}.xls`
      exportExcel(fileName)
    }

    // const handleExport = () => {
    //   const bizNo = getFieldValue('bizNo') === undefined ? '' : `_${getFieldValue('bizNo')}`
    //   const bankName =
    //     getFieldValue('bankName') === undefined ? '' : `_${getFieldValue('bankName')}`
    //   console.log(`融资管理${bizNo}${bankName}${getFieldValue('bizStatus')}.xlsx`)
    //   //console.log(`融资管理_${getFieldValue("bizNo")}_${getFieldValue("bankName")}_${getFieldValue("bizStatus")}.xlsx`)
    // }

    return (
      <Card>
        <Form {...searchFormLayout} onSubmit={submit}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="担保编号">
                {getFieldDecorator('bizNo')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            {/* <Col span={8}>
              <Form.Item label="融资开户行">
                {getFieldDecorator('bankSiteName')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col> */}
            <Col span={8}>
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
                    {/* <Select.Option value="全部">全部</Select.Option>
                    <Select.Option value="已暂存">已暂存</Select.Option>
                    <Select.Option value="待风控审批">待风控审批</Select.Option>
                    <Select.Option value="待总经理审批">待总经理审批</Select.Option>
                    <Select.Option value="待委员会审批">待委员会审批</Select.Option>
                    <Select.Option value="待提交">待提交</Select.Option>
                    <Select.Option value="待放款">待放款</Select.Option> */}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <ButtonGroup type="form" align="right">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={handelReset}>重置</Button>
                <Button loading={excelLoading} onClick={handleExport}>
                  导出excel
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          {/* <Row>
            <ButtonGroup type="form" align="left">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handelReset}>重置</Button>
              <Button loading={excelLoading} onClick={handleExport}>
                导出excel
              </Button>
            </ButtonGroup>
          </Row> */}
        </Form>
      </Card>
    )
  }

  return (
    <Card transparent>
      {renderSearchForm()}
      <Card style={{ marginTop: -10 }}>
        <ButtonGroup>
          <Button
            auth="融资管理-列表页-申请融资担保-企业"
            to="/msCompanyFinance/apply"
            type="primary"
          >
            申请融资担保
          </Button>
        </ButtonGroup>
        <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
      </Card>
    </Card>
  )
}

export default Form.create()(List)
