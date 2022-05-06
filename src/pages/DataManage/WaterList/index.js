import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select,  message, Modal, Table } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import { deleteData,deleteDataall} from '@/services/carbon/dataManage'
import { getList } from '@/services/box'

const Home = (props) => {
  const {
    form: { getFieldDecorator, resetFields,getFieldsValue },
    match: {
      params: { type }
    }
  } = props

  const[data,setdata]=useState([])

  const requestlist1=()=>{
    getList({}).then((res)=>{
      setdata(res)
    })
  }
 
  const submit=()=>{
    getList(getFieldsValue()).then((res)=>{
      setdata(res)
    })
  }

  useEffect(()=>{
    requestlist1()
  },[])


  const handleDelete = () => {
    Modal.confirm({
      title: '确定删除？',
      content: '删除后不可恢复',
      onOk: () => {
        return deleteData().then((res) => {
          if (res instanceof Error) return
          message.success('删除成功')
          // refresh()
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
        })
      }
    })
  }

  //查询表单样式设置
  const searchFormLayout = {
    colon: true,
    labelAlign: 'right',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'bizNo',
      width: 140,
      ellipsis: true
    },
    {
      title: '盒型种类',
      dataIndex: 'type',
      width: 100
    },
    {
      title: '成品盒长(mm)',
      dataIndex: 'finallength',
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
      dataIndex: 'finalwidth',
      width:120
    },
    {
      title: '成品盒高(mm)',
      dataIndex: 'finalheight',
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
      dataIndex: 'companyname',
      width:150
    },
    {
      title: '联系电话',
      dataIndex: 'number',
      width:120
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      width:80
    },
    {
      title: '操作',
      key: 'action',
      width:100,
      render: (t, r) => {
        // const uri = encodeURI(`${r.orgId} - ${r.energyFrom} -${ r.total}`)
        return (
          <ButtonGroup type="action">
            <Button onClick={() => {
              // saveshujudata(r)
              // router.push(`/dataManagement/allList/details`)
              }}>查看
              {/* <Link to={{ pathname: `/dataManagement/details/${uri}` }}>查看</Link> */}
            </Button>
            <Button onClick={() => handleDelete()}>删除</Button>
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

    const handelReset = () => {
      resetFields()
      getList({}).then((res)=>{
        setdata(res)
      })
    }

    return (
      <Card style={{ paddingRight: 20 }}>
        <Form {...searchFormLayout}>
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
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="扣盖式">扣盖式</Select.Option>
                  <Select.Option value="手提式">手提式</Select.Option>
                  <Select.Option value="粘接式">粘接式</Select.Option>
                  <Select.Option value="两页式">两页式</Select.Option>
                  <Select.Option value="套盖式">套盖式</Select.Option>
                  <Select.Option value="摇盖盒">摇盖盒</Select.Option>
                  <Select.Option value="抽屉式">抽屉式</Select.Option>
                  <Select.Option value="其他">其他</Select.Option>
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
              {getFieldDecorator('status')(
                <Select>
                <Select.Option value="6">全部</Select.Option>
                <Select.Option value="1">待审核</Select.Option>
                <Select.Option value="2">已通过</Select.Option>
                <Select.Option value="3">已驳回</Select.Option>
              </Select>
              )}
            </Form.Item>
          </Col>

            <Col span={8}>
                  <ButtonGroup align='right'>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={submit}
                    >
                      查询
                    </Button>
                    <Button onClick={handelReset}>重置</Button>
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
        {/* {renderForms()} */}
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
        {/* <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps}/>
         */}
        {/*<Table*/}
        {/*  loading={loading}*/}
        {/*  rowKey="companyName"*/}
        {/*  columns={columns}*/}
        {/*  dataSource={dataSource}*/}
        {/*  pagination={{pageSize: 10}}*/}
        {/*/>*/}
       <Table dataSource={data} columns={columns}></Table>
      </Card>
    </Card>
  )
}

export default Form.create()(Home)
