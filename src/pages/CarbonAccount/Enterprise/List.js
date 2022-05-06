import React, { useEffect, useMemo, useState } from 'react'
import { Input, Select, Row, Col, Button, Form ,Table} from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import Card from '@/components/Card'
import { getList,saveshuju } from '@/services/box'
import router from 'umi/router'

const searchFormLayout = {
  colon: true,
  labelAlign: 'right',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const List = (props) => {
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

  const columns = useMemo(() => {
    const getActionMap = (r) => {
      const baseUrl = '/msEnterprise/view'
      return {
        2: { name: '查看', to: `${baseUrl}/${r.id}` }, // 未认证
        3: { name: '查看', to: `${baseUrl}/${r.id}` }, // 待审核
        4: { name: '查看', to: `${baseUrl}/${r.id}` }, // 已退回
        5: { name: '查看', to: `${baseUrl}/${r.id}` }, // 已驳回
        1: { name: '查看', to: `${baseUrl}/${r.id}` } // 已通过
      }
    }

    return [
      {
        title: '编号',
        dataIndex: 'bizNo',
        // fixed: 'left',
        width: 140,
        ellipsis: true
      },
      {
        title: '盒型种类',
        dataIndex: 'type',
        // fixed: 'left',
        width: 100,
        ellipsis: true,
        // render: (t) => (t === '0' ? '供应商' : '客户')
      },
      {
        title: '成品盒长(mm)',
        dataIndex: 'finallength',
        width: 120,
        ellipsis: true,
        render: (t) => t || '-'
      },
      {
        title: '成品盒宽(mm)',
        dataIndex: 'finalwidth',
        width: 120,
        ellipsis: true,
        render: (t) => t || '-'
      },
      {
        title: '成品盒高(mm)',
        dataIndex: 'finalheight',
        width: 120,
        ellipsis: true,
        render: (t) => t || '-'
      },
      {
        title: '所属供应商',
        dataIndex: 'companyname',
        width: 150,
        ellipsis: true,
        // render: (t) => companyStatus[t]?.name
      },
      {
        title: '联系电话',
        dataIndex: 'number',
        width: 120,
        ellipsis: true
      },
      {
        title: '日期',
        dataIndex: 'date',
        width: 120,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        width: 80,
        ellipsis: true,
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
            <Button
              onClick={() => {
                saveshuju(r)
                // router.push(`/reduction/view`)
                router.push('/msEnterprise/view');
              }}
            >
              查看
              {/* <Link to={{ pathname: `/dataManagement/details/${uri}` }}>查看</Link> */}
            </Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  const renderSearchForm = () => {

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
              {getFieldDecorator('length1')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginRight:"10px"}}/>)}
              ~
              {getFieldDecorator('length2')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginLeft:"10px"}}/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预期盒宽范围">
              {getFieldDecorator('width1')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginRight:"10px"}}/>)}
              ~
              {getFieldDecorator('width2')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginLeft:"10px"}}/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预期盒高范围">
              {getFieldDecorator('height1')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginRight:"10px"}}/>)}
              ~
              {getFieldDecorator('height2')(<Input placeholder="请输入" addonAfter="mm" style={{width:'140px',marginLeft:"10px"}}/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="盒型种类">
              {getFieldDecorator('type', {
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
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit" onClick={submit}>
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
    <Card>
      {renderSearchForm()}
      {/* <PagingTable scoll={{ x: 0 }} rowKey={(i) => i.id} columns={columns}  /> */}
      <Table dataSource={data} columns={columns}></Table>
    </Card>
  )
}

export default Form.create()(List)
