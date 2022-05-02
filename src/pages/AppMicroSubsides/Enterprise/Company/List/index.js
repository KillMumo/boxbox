import React, { useMemo } from 'react'
import Card from '@/components/Card'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { Button, Form, Row, Col, Input } from 'antd'
import { searchFormLayout } from '@/common/config'
import { useTable } from '@dragon/hooks'
import {
  formatTime,
  getCurrentDate
  // formatMoney
} from '@/utils'
import { fetchEnterpriseList, fetchEnterpriseExcel } from '@/services/microSubsidy/enterprise'

const List = (props) => {
  const {
    form: { getFieldDecorator }
  } = props

  //获取企业列表
  const { submit, reset, tableProps, exportExcel, excelLoading } = useTable(
    fetchEnterpriseList,
    fetchEnterpriseExcel,
    {
      form: props.form
    }
  )

  //表头
  const columns = useMemo(() => {
    return [
      {
        title: '企业全称',
        dataIndex: 'orgName',
        // ellipsis: true,
        fixed: 'left',
        width: 240
      },
      {
        title: '所属行业',
        dataIndex: 'orgType',
        width: 140,
        ellipsis: true
      },
      {
        title: '注册资本',
        dataIndex: 'capital',
        width: 160,
        ellipsis: true,
        render: (t) => `${t?.coin}${t?.type}`
      },
      {
        title: '实控人',
        dataIndex: 'realControlPersonName',
        width: 120,
        render: (t) => t || '-'
      },
      {
        title: '法人',
        dataIndex: 'legalPersonName',
        width: 120,
        render: (t) => t || '-'
      },
      {
        title: '管理员',
        dataIndex: 'adminName',
        width: 120,
        render: (t) => t || '-'
      },
      {
        title: '管理员手机号',
        dataIndex: 'adminPhone',
        width: 120,
        render: (t) => t || '-'
      },
      {
        title: '入驻时间',
        dataIndex: 'createTime',
        width: 120,
        render: (t) => formatTime(t, 'ymd')
      },
      {
        title: '银行账户数',
        dataIndex: 'bankAccountNum',
        width: 120
      },
      {
        title: '供销关系数',
        dataIndex: 'relatedCompanyNum',
        width: 120
      },
      {
        title: '关联人数',
        dataIndex: 'relatePersonNum',
        ellipsis: true,
        width: 120
      },
      {
        title: '信息完善分',
        dataIndex: 'infoPerfection',
        width: 120
      },
      {
        title: '操作',
        key: 'action',
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button to={`/msEnterprise/company/view/${r.id}`}>查看</Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  //搜索框
  const renderSearchForm = () => {
    const handleExport = () => {
      const fileName = `客户列表_${getCurrentDate()}.xls`
      exportExcel(fileName)
    }

    return (
      <Form {...searchFormLayout} onSubmit={submit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="企业编号">
              {getFieldDecorator('uid')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="企业全称">
              {getFieldDecorator('orgName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="实控人">
              {getFieldDecorator('realControlPersonName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="法人">
              {getFieldDecorator('legalPersonName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={16}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={reset}>重置</Button>
              <Button
                auth="企业管理-企业管理-列表页-导出Excel"
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
      <ButtonGroup>
        <Button
          // auth="企业管理-企业管理-列表页-添加企业"
          to="/msEnterprise/company/add"
          type="primary"
        >
          添加客户
        </Button>
      </ButtonGroup>
      <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} scroll={{ x: 1860 }} />
    </Card>
  )
}

export default Form.create()(List)
