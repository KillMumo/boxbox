import React, { useMemo, useCallback } from 'react'
import { Col, Row, Form, Input, Button, message, Modal } from 'antd'
import Card from '@/components/Card'
import Table from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import {
  getFlowList,
  deleteFlow,
  deployFlow,
  activeFlow,
  suspendFlow,
  fetchDiagram
} from '@/services/flow'
import { useTable } from '@dragon/hooks'

const formLayout = {
  labelAlign: 'left',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const Flow = (props) => {
  const { refresh: refreshList, searchBy, tableProps } = useTable(getFlowList)
  // const { data: diagram = '', start: fetchDiagramReq } = useRequest((id) =>
  //   fetchDiagram(id),
  //   {
  //   manual:true
  //   }
  // )

  // 表格列
  const columns = useMemo(() => {
    //删除按钮事件
    const handleDelete = (id) => {
      Modal.confirm({
        title: '删除确认',
        okType: 'danger',
        content: '确定删除选中记录?',
        onOk: () => {
          return deleteFlow(id).then((res) => {
            if (res instanceof Error) return
            message.success('删除成功')
            refreshList()
          })
        }
      })
    }

    //部署按钮事件
    const handleDeploy = (id) => {
      Modal.confirm({
        title: '部署确认',
        okType: 'primary',
        content: '确定部署选中流程?',
        onOk: () => {
          return deployFlow(id).then((res) => {
            if (res instanceof Error) return
            message.success('部署成功')
            refreshList()
          })
        }
      })
    }

    //激活按钮
    const handleActive = (id) => {
      Modal.confirm({
        title: '激活确认',
        okType: 'primary',
        content: '确定激活选中流程?',
        onOk: () => {
          return activeFlow(id).then((res) => {
            if (res instanceof Error) return
            message.success('激活成功')
            refreshList()
          })
        }
      })
    }

    //挂起按钮
    const handleSuspend = (id) => {
      Modal.confirm({
        title: '挂起确认',
        okType: 'primary',
        content: '确定挂起选中流程?',
        onOk: () => {
          return suspendFlow(id).then((res) => {
            if (res instanceof Error) return
            message.success('挂起成功')
            refreshList()
          })
        }
      })
    }

    //流程图按钮事件
    const handleDiagram = async (id) => {
      const res = await fetchDiagram(id)
      //console.log("流程图"+diagram)
      Modal.confirm({
        title: '流程图',
        icon: 'branches',
        centered: true,
        width: '10',
        content: <img src={res} alt="" />,
        okText: '确定',
        okType: 'primary'
      })
    }

    //操作栏
    const getActionMap = (record) => ({
      0: [
        { name: '部署', props: { onClick: () => handleDeploy(record.id) } },
        { name: '修改', props: { to: `/flow/edit/${record.id} ` } },
        { name: '删除', props: { onClick: () => handleDelete({ id: record.id }) } }
      ],
      1: [
        { name: '部署', props: { onClick: () => handleDeploy(record.id) } },
        { name: '挂起', props: { onClick: () => handleSuspend(record.id) } },
        { name: '流程图', props: { onClick: () => handleDiagram(record.id) } },
        { name: '修改', props: { to: `/flow/edit/${record.id} ` } },
        { name: '删除', props: { onClick: () => handleDelete({ id: record.id }) } }
      ],
      2: [
        { name: '部署', props: { onClick: () => handleDeploy(record.id) } },
        { name: '激活', props: { onClick: () => handleActive(record.id) } },
        { name: '流程图', props: { onClick: () => handleDiagram(record.id) } },
        { name: '修改', props: { to: `/flow/edit/${record.id} ` } },
        { name: '删除', props: { onClick: () => handleDelete({ id: record.id }) } }
      ]
    })

    return [
      {
        title: '名称',
        dataIndex: 'flowName'
      },
      {
        title: '别名',
        dataIndex: 'flowAlias'
      },
      {
        title: 'key',
        dataIndex: 'flowKey'
      },
      {
        title: '类型',
        dataIndex: 'flowType'
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status) => {
          let config = {
            '0': '未部署',
            '1': '已激活',
            '2': '已挂起'
          }
          return config[status]
        }
      },
      {
        title: '部署时间',
        dataIndex: 'deployTime'
      },
      {
        title: '操作',
        key: 'action',
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              {getActionMap(r)[r.status]?.map((b) => (
                <Button key={b.name} {...b.props}>
                  {b.name}
                </Button>
              ))}
            </ButtonGroup>
          )
        }
      }
    ]
  }, [refreshList])

  // 搜索框
  const renderSearchForm = useCallback(() => {
    const {
      form: { getFieldDecorator }
    } = props

    //搜索按钮事件
    const handleSubmit = (e) => {
      e.preventDefault()
      const {
        form: { getFieldsValue }
      } = props
      const result = getFieldsValue()

      searchBy({
        ...result
      })
    }

    //重置按钮事件
    const handleReset = () => {
      const {
        form: { resetFields }
      } = props
      resetFields()
      searchBy()
    }

    //搜索框
    return (
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="流程名称">
              {getFieldDecorator('flowName')(<Input placeholder="请输入流程名称" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="流程类型">
              {getFieldDecorator('flowType')(<Input placeholder="请输入流程类型" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    )
  }, [props, searchBy])

  // 左侧按钮组
  const renderButtonGroup = useCallback(() => {
    return (
      <ButtonGroup>
        <Button auth="flow_add" type="primary" to="/flow/add">
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

export default Form.create()(Flow)
