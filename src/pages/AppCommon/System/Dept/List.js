import React, { useMemo, useCallback } from 'react'
import { Col, Row, Form, Input, Button, message, Modal } from 'antd'
import Card from '@/components/Card'
import Table from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { getDeptList, deleteDept } from '@/services/dept'
import { useTable } from '@dragon/hooks'
import useDict from '@/hooks/useDict'

const Dept = (props) => {
  const { refresh: refreshList, searchBy, tableProps } = useTable(getDeptList)
  const orgType = useDict('org_type')

  // 列
  const columns = useMemo(() => {
    const handleDelete = (id) => {
      Modal.confirm({
        title: '删除确认',
        content: '确定删除选中记录?',
        onOk: () => {
          return deleteDept(id).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refreshList(false)
          })
        }
      })
    }

    return [
      {
        title: '机构名称',
        dataIndex: 'orgName'
      },
      // {
      //   title: '联系人',
      //   dataIndex: 'orgType',
      //   render: (t) => orgType[t]
      // },
      {
        title: '联系人',
        dataIndex: 'legalPersonName'
      },
      {
        title: '手机',
        dataIndex: 'legalPersonPhone'
      },
      {
        title: '说明',
        dataIndex: 'remark'
      },

      {
        title: '操作',
        key: 'action',
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              {/*auth="org_delete"*/}
              <Button auth={"org_delete"} onClick={() => handleDelete(r.id)} >删除</Button>
              {/*auth="org_view"*/}
              <Button to={`/system/org/view/${r.id}`} >详情</Button>
              {/*auth="org_edit"*/}
              <Button auth={"org_update"} to={`/system/org/edit/${r.id}`} >修改</Button>
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

    const handleSubmit = (e) => {
      e.preventDefault()
      const {
        form: { getFieldsValue }
      } = props
      const result = getFieldsValue()
      console.log(111)
      console.log(result)

      searchBy({ ...result })
    }

    const handleReset = () => {
      const {
        form: { resetFields }
      } = props
      resetFields()
      searchBy()
    }

    return (
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="组织名称">
              {getFieldDecorator('orgName')(<Input placeholder="请输入组织名称" />)}
            </Form.Item>
          </Col>
          <Col span={8}></Col>
          {/*<Col span={8}>*/}
          {/*  <Form.Item label="联系人">*/}
          {/*    {getFieldDecorator('legalPersonName')(<Input placeholder="请输入联系人" />)}*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          {/*<Col span={8}>*/}
          {/*  <Form.Item label="手机号">*/}
          {/*    {getFieldDecorator('legalPersonPhone')(<Input placeholder="请输入联系人" />)}*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          {/*<Col span={8}>*/}
          {/*  <Form.Item label="联系人">*/}
          {/*    {getFieldDecorator('legalPersonName')(<Input placeholder="请输入联系人" />)}*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col span={8}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit" >
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    )
  }, [props, searchBy])

  // 按钮组
  const renderButtonGroup = useCallback(() => {
    return (
      <ButtonGroup>
        <Button auth={"org_add"} type="primary" to="/system/org/add">
          新增
        </Button>
      </ButtonGroup>
    )
  }, [])

  return (
    <Card>
      {renderSearchForm()}
      {renderButtonGroup()}
      <Table rowKey={(i) => i.id} columns={columns} {...tableProps} />
    </Card>
  )
}

export default Form.create()(Dept)
