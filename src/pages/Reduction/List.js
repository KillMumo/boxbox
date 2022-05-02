import React, { useCallback, useMemo, useState } from 'react'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { Form, Input, Row, Col, Button, Select, Tag, Popconfirm, message, Modal } from 'antd'
import { Link } from 'react-router-dom'
import PagingTable from '@/components/PagingTable'
import { useRequest, useTable } from '@dragon/hooks'
import { deleteReduction, fetchList, getItem, saveItem, saveNo, saveRow, updateReduction } from '@/services/carbonAccount/reduction'
import moment from 'moment'
import router from 'umi/router'
import useModalForm from '@/hooks/useModalForm'
import { useSelector } from 'react-redux'
import ModifyStatus from '@/pages/Reduction/Modal/ModifyStatus'
import { dynamicMapExcel } from '@/services/carbon/dataManage'
import ReduceExcelForm from '@/pages/Reduction/Modal/ReduceExcelForm'
// import useDict from '@/hooks/useDict'


const List = (props) => {
  const {
    form: { getFieldDecorator, resetFields }
  } = props

  const role = useSelector(({ user }) => user.role)

  const reset = () => {
    router.push('/reduction/list')
    resetFields()
    searchBy()
  }

  const { loading: addLoading, start: addReq } = useRequest(dynamicMapExcel, { manual: true })

  const tkForms = () => {
    return (
      <React.Fragment>
        {/* 新建表单 */}
        <ReduceExcelForm {...addFormProps} />
      </React.Fragment>
    )
  }

  //新建的弹框
  const { open: openForm, props: addFormProps } = useModalForm({
    title: '选择导入模板',
    confirmLoading: addLoading,
    afterValidate: async (v, close) => {
      const res = await addReq({
        ...v
      })
      if (res instanceof Error) return
      message.success('导入成功')
      window.location.reload()
      router.push('/reduction')
    }
  })

  const { refresh,searchBy, submit, tableProps } = useTable(fetchList, {
    form: props.form
  })
  const handleDelete = (bizNo) => {
    console.log(bizNo)
    Modal.confirm({
      title: '确定删除？',
      content: '删除后不可恢复',
      onOk: () => {
        return deleteReduction(bizNo).then((res) => {
          if (res instanceof Error) return
          message.success('删除成功')
          refresh()
        })
      }
    })
  }
  const { loading: rejectLoading, start: rejectReq } = useRequest(updateReduction, { manual: true })
  const [id, setId] = useState('')
  const { open: openFormModify, props: modifyFormProps } = useModalForm({
    title: '更改状态',
    confirmLoading: rejectLoading,
    afterValidate: async (v, close) => {
      const res = await rejectReq({
        bizNo: id,
        ...v
      })
      if (res instanceof Error) return
      message.success('更改状态成功成功')
      router.push('/reduction/list')
      refresh()
    }
  })

  const renderForms = () => {
    return (
      <React.Fragment>
        {/* 新建表单 */}
        <ModifyStatus {...modifyFormProps} />
      </React.Fragment>
    )
  }

  //表头
  const columns = useMemo(() => {
    return [

      {
        title: '项目名称',
        dataIndex: 'extra.projectName',
        width: 120,

      },
      {
        title: '企业名称',
        dataIndex: 'extra.companyName',
        width: 120,

      },
      {
        title: '描述',
        dataIndex: 'extra.desc',
        width: 120
      },
      {
        title: '项目类型',
        dataIndex: 'extra.scene',
        width: 80,
      },
      // {
      //   title: '状态',
      //   dataIndex: 'extra.status',
      //   width: 50,
      //   render: (t) =>
      //     t === '未激活' ? (
      //       <Tag color="orange">{t}</Tag>
      //     ) : (
      //       // ) : t === '已激活' ? (
      //       //   <Tag color="red">{t}</Tag>
      //       <Tag color="green">{t}</Tag>
      //     )
      // },
      {
        title: '开始（并网）时间',
        dataIndex: 'extra.startTime',
        width: 100,
        render: (t) => moment(t).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button>
                <Link to={{ pathname: `/reduction/view/${r.bizNo}` }}>查看</Link>
              </Button>
              <Button  auth="reduce_update" onClick={()=>{
                saveItem(r)
                router.push(`/reduction/edit/${r.bizNo}`)
              }}>
                {/*<Link to={{ pathname: `/reduction/edit/${r.bizNo}` }}>编辑</Link>*/}
                编辑
              </Button>
              <Button auth={"reduce_delete"} onClick={() => handleDelete({ bizNos: r.bizNo })}>删除</Button>
              {/* <Button
                onClick={() => {
                  openFormModify()
                  setId(r.bizNo)
                  saveRow(r)
                }}
              >
                更改状态
              </Button> */}
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])



  const renderSearchForm = useCallback(() => {
    const {
      form: { getFieldDecorator }
    } = props

    const formLayout = {
      labelAlign: 'left',
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }
    //查询表单样式设置
    const searchFormLayout = {
      colon: true,
      labelAlign: 'right',
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    return (
      <Card style={{ paddingRight: 20 }}>
      <Form {...searchFormLayout} onSubmit={submit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="项目名称">
              {getFieldDecorator('like&projectName')(<Input placeholder="请输入项目名称" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="项目类型">
              {getFieldDecorator('eq&scene')(<Select>
                <Select.Option key={1} value={"分布式光伏"}>分布式光伏</Select.Option>
              </Select>)}
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item label="状态">
              {getFieldDecorator('eq&status')(<Select>
                <Select.Option key={1} value={"在建"}>在建</Select.Option>
                <Select.Option key={1} value={"已完成"}>已完成</Select.Option>
              </Select>)}
            </Form.Item>
          </Col> */}
          {/* <Col span={8}></Col>
          <Col span={8}></Col> */}
          <Col span={8}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={reset}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form></Card>
    )
  }, [props, resetFields, submit])

  return (
    <Card transparent>
      {tkForms()}
      {renderForms()}
      <Card style={{ marginTop: -10 }}>
        {renderSearchForm()}
         <ButtonGroup>
          <Button to="/reduction/add" type="primary" auth={"reduce_add"}>
            添加减排
         </Button>
         {/*{(role==='account_admin'||role==='account_super_admin')&&( <Button*/}
         {/*    // to="wasteQuery/add"*/}
         {/*  auth={"reduce_batch_import"}*/}
         {/*    onClick={openForm}*/}
         {/*    type="primary"*/}
         {/*  >*/}
         {/*    批量导入*/}
         {/*  </Button>)}*/}
           <Button
             // to="wasteQuery/add"
             auth={"reduce_batch_import"}
             onClick={openForm}
             type="primary"
           >
             批量导入
           </Button>
        </ButtonGroup>
        <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
      </Card>
    </Card>
  )
}

export default Form.create()(List)
