import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select, DatePicker, message, Modal, Table } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import PagingTable from '@/components/PagingTable'
import useModalForm from '@/hooks/useModalForm'
import useDict from '@/hooks/useDict'
import {getDataList, uploadFile, deleteData,dynamicExcel,getWaterList,saveshujudata,deleteDataall} from '@/services/carbon/dataManage'
import { useTable, useRequest } from '@dragon/hooks'
import router from 'umi/router'
import {Link} from "react-router-dom";
import ExcelForm from '@/pages/DataManage/List/Modal/ExcelForm'
import { getSelectData } from '@/services/carbon/common'

const Home = (props) => {
  const {
    form: { getFieldDecorator, resetFields,getFieldsValue },
    match: {
      params: { type }
    }
  } = props

  const { loading: addLoading, start: addReq } = useRequest(dynamicExcel, { manual: true })

  const [yearList, setYearList] = useState([])
  const [industryList, setIndustryList] = useState([])

  const requestData = (params) => {

    getSelectData(params).then((res) => {
      setYearList(res.yearList || [])
      setIndustryList(res.industryList || [])
    })
  }

  useEffect(() => {
    requestData()
  }, [])

  const renderForms = () => {
    return (
      <React.Fragment>
        {/* 新建表单 */}
        <ExcelForm {...addFormProps} />
      </React.Fragment>
    )
  }

  const tolog = () => {
    Modal.confirm({
      title: '是否跳转至日志页查看上传记录？',
      content: '取消后刷新当前页',
      onOk: () => {
        // return deleteData(uids).then((res) => {
        //   if (res instanceof Error) return
        //   message.success('删除成功')
        //   refresh()
        // })
        router.push('/dataManagement/importLog')
      },
      onCancel:()=>{
        window.location.reload()
        router.push('/dataManagement/allList')
      }
    })
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
      message.success('任务提交成功,请留意录入日志哦！')
      tolog()
      // window.location.reload()
      // router.push('/dataManagement/allList')
    }
  })

  const reset = () => {
    router.push(`/dataManagement/allList`)
    resetFields()
    searchBy({year:'2021'})
  }


  const handleDelete = (uids) => {
    Modal.confirm({
      title: '确定删除？',
      content: '删除后不可恢复',
      onOk: () => {
        return deleteData(uids).then((res) => {
          if (res instanceof Error) return
          message.success('删除成功')
          refresh()
        })
      }
    })
  }

  const deleteall = () => {
    Modal.confirm({
      title: '确定删除当前筛选出的全部数据？',
      content: '删除后不可恢复',
      onOk: () => {
        const data=getFieldsValue()
        return deleteDataall(data).then((res) => {
          if (res instanceof Error) return
          message.success('删除成功')
          refresh()
        })
      }
    })
  }

  const carbonModle = useDict('carbon_modle')

  //查询表单样式设置
  const searchFormLayout = {
    colon: true,
    labelAlign: 'right',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const { refresh, searchBy, submit, tableProps } = useTable(
    getWaterList,
    {
      // defaultFilters: { status: type },
      form: props.form
    }
  )

  useEffect(() => {
    // requestListData()
    searchBy({year:'2021'})
  }, [])


  const columns = [
    {
      title: '编号',
      dataIndex: 'year',
      width: 100
    },
    {
      title: '盒型种类',
      dataIndex: 'month',
      width: 100,
      render(t,r){
        if (t===undefined||t===null){
          return "--";
        }else {
          return t;
        }
  }
    },
    {
      title: '成品盒长(mm)',
      dataIndex: 'date',
      width: 120,
      render(t,r){
        if (t===undefined||t===null){
          return "--";
        }else {
          return t;
        }
      }
    },

    {
      title: '成品盒宽(mm)',
      dataIndex: 'companyName',
      width:120
    },
    {
      title: '成品盒高(mm)',
      dataIndex: 'industry',
      width:120,
      render(t,r){
        if (t===undefined||t===null){
          return "--";
        }else {
          return t;
        }
      }
    },
    {
      title: '所属供应商',
      dataIndex: 'total',
      width:150
    },
    {
      title: '联系电话',
      dataIndex: 'energyFrom',
      width:120
    },
    {
      title: '审核状态',
      dataIndex: 'sss',
      width:80
    },
    {
      title: '操作',
      key: 'action',
      width:100,
      render: (t, r) => {
        const uri = encodeURI(`${r.orgId} - ${r.energyFrom} -${ r.total}`)
        return (
          <ButtonGroup type="action">
            <Button onClick={() => {
              saveshujudata(r)
              router.push(`/dataManagement/allList/details`)
              }}>查看
              {/* <Link to={{ pathname: `/dataManagement/details/${uri}` }}>查看</Link> */}
            </Button>
            <Button onClick={() => handleDelete({ uids: r.uid })}>删除</Button>
            <Button onClick={()=>{
                // saveItem(r)
                // router.push(`/reduction/edit/${r.uid}`)
              }}>
                {/*<Link to={{ pathname: `/reduction/edit/${r.bizNo}` }}>编辑</Link>*/}
                编辑
              </Button>
          </ButtonGroup>
        )
      }
    }
  ]

  const SearchForm = () => {
    return (
      <Card style={{ paddingRight: 20 }}>
        <Form {...searchFormLayout} onSubmit={submit}>
          <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="预期盒长范围">
              {getFieldDecorator('orgName')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginRight:"10px"}}/>)}
              ~
              {getFieldDecorator('orgName2')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginLeft:"10px"}}/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预期盒宽范围">
              {getFieldDecorator('width')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginRight:"10px"}}/>)}
              ~
              {getFieldDecorator('width2')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginLeft:"10px"}}/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预期盒高范围">
              {getFieldDecorator('height')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginRight:"10px"}}/>)}
              ~
              {getFieldDecorator('height2')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginLeft:"10px"}}/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="盒型种类">
              {getFieldDecorator('status', {
                initialValue: type
              })(
                <Select>
                  <Select.Option value="6">全部</Select.Option>
                  <Select.Option value="1">已通过</Select.Option>
                  <Select.Option value="2">未认证</Select.Option>
                  <Select.Option value="3">待审核</Select.Option>
                  <Select.Option value="4">已退回</Select.Option>
                  <Select.Option value="5">已驳回</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="所属供应商">
              {getFieldDecorator('companyname')(<Input placeholder="请输入"/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="审核状态">
              {getFieldDecorator('companyname')(<Input placeholder="请输入"/>)}
            </Form.Item>
          </Col>

            <Col span={8}>
                  <ButtonGroup align='right'>
                    <Button
                      type="primary"
                      htmlType="submit"
                    >
                      查询
                    </Button>
                    <Button onClick={reset}>重置</Button>
                  </ButtonGroup>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  return (
    <Card transparent>
      <Card style={{ marginTop: -10 }}>
        {SearchForm()}
        {renderForms()}
        <ButtonGroup>
          <Button
            // to="wasteQuery/add"
            // auth={"data_batch_import"}
            // onClick={openForm}
            to="/dataManagement/allList/add"
            type="primary"
          >
            新增
          </Button>
          <Button
            // auth={"data_mgr_batch_delete"}
            onClick={deleteall}
            // type="primary"
          >
            批量删除
          </Button>
        </ButtonGroup>
        <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps}/>

        {/*<Table*/}
        {/*  loading={loading}*/}
        {/*  rowKey="companyName"*/}
        {/*  columns={columns}*/}
        {/*  dataSource={dataSource}*/}
        {/*  pagination={{pageSize: 10}}*/}
        {/*/>*/}
      </Card>
    </Card>
  )
}

export default Form.create()(Home)
