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
} from '@/services/microSubsidy/finance'
import router from 'umi/router'
import { formatMoney } from '@/utils'
import { financeStatus } from '../common/dict'
import { getCurrentDate } from '@/utils'

const List = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props

  const { refresh, searchBy, submit, excelLoading, exportExcel, tableProps } = useTable(
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
          props: { auth: '融资管理-列表页-编辑-国投', to: `/msFinance/edit/${record.bizNo}` }
        },
        {
          name: '删除',
          props: {
            auth: '融资管理-列表页-删除-国投',
            onClick: () => handleDelete({ bizNo: record.bizNo })
          }
        }
      ],
      待业务员提交: [
        {
          name: '查看',
          props: {
            to: `/msFinance/view/${record.bizNo}`
          }
        }
      ],
      待业务员审批: [
        {
          name: '查看',
          props: { to: `/msFinance/view/${record.bizNo}` }
        }
      ],
      待风控审批: [
        {
          name: '查看',
          props: { to: `/msFinance/view/${record.bizNo}` }
        }
      ],
      待总经理审批: [
        {
          name: '查看',
          props: { to: `/msFinance/view/${record.bizNo}` }
        }
      ],
      待委员会审批: [
        {
          name: '查看',
          props: { to: `/msFinance/view/${record.bizNo}` }
        }
      ],
      待企业提交: [
        {
          name: '查看',
          props: { to: `/msFinance/view/${record.bizNo}` }
        }
      ],
      待放款: [{ name: '查看', props: { to: `/msFinance/view/${record.bizNo}` } }]
    })

    return [
      {
        title: '担保编号',
        dataIndex: 'bizNo',
        fixed: 'left',
        width: 140
      },
      {
        title: '申请企业',
        dataIndex: 'extra.orgName',
        fixed: 'left',
        // ellipsis: true,
        width: 200
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
        // width: 150,
        render: (t) => formatMoney(t)
      },
      {
        title: '预计还款日',
        dataIndex: 'extra.paymentDate'
        // width: 120
      },
      // {
      //   title: '融资开户行',
      //   dataIndex: 'extra.bankSiteName',
      //   ellipsis: true,
      //   width: 120
      // },
      // {
      //   title: '反欺诈评分',
      //   dataIndex: 'fraudCount',
      //   align: 'right',
      //   width: 100
      // },
      // {
      //   title: '风控评分',
      //   dataIndex: 'riskCount',
      //   align: 'right',
      //   width: 80
      // },
      {
        title: '状态',
        dataIndex: 'bizStatus',
        // width: 160,
        render: (t) => <Badge color={financeStatus[t]?.color} text={t} />
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
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
      router.push(`/msFinance/list/${v}`)
      searchBy((r) => ({ ...r, bizStatus: v }))
    }

    const handelReset = () => {
      router.push(`/msFinance/list/全部`)
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
            <Col span={8}>
              <Form.Item label="申请企业">
                {getFieldDecorator('orgName')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              {/* <Form.Item label="融资开户行">
                {getFieldDecorator('bankSiteName')(<Input placeholder="请输入" />)}
              </Form.Item> */}
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
                <Button onClick={handelReset}>重置</Button>
                <Button
                  auth="融资管理-列表页-导出Excel-国投"
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
        <ButtonGroup>
          <Button to="/msFinance/apply" type="primary">
            申请融资担保
          </Button>
        </ButtonGroup>
        <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
      </Card>
    </Card>
  )
}

export default Form.create()(List)
