import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { Form, Input, Row, Col, Button, Select, Tag, Popconfirm, message, Modal } from 'antd'
import PagingTable from '@/components/PagingTable'
import { useRequest, useTable } from '@dragon/hooks'
import { fetchList, getItem, saveNo, saveRow, updateReduction } from '@/services/carbonAccount/reduction'
import moment from 'moment'
import router from 'umi/router'
import useModalForm from '@/hooks/useModalForm'
import { fetchProList, getDevice, getList, getParam } from '@/services/carbonAccount/carbonsink'
import { dynamicExcel } from '@/services/carbon/dataManage'
import CarbonSinkExcelForm from '@/pages/CarbonSink/Modal/CarbonSinkExcelForm'
import { useSelector } from 'react-redux'
// import useDict from '@/hooks/useDict'

const List = (props) => {
  const {
    form: { getFieldDecorator, resetFields }
  } = props

  const role = useSelector(({ user }) => user.role)

  const reset = () => {
    router.push('/cs/list')
    resetFields()
    searchBy()
  }
  const { refresh, searchBy, submit, tableProps } = useTable(getList, {
    form: props.form
  })

  const { loading: addLoading, start: addReq } = useRequest(dynamicExcel, { manual: true })

  const csForms = () => {
    return (
      <React.Fragment>
        {/* 新建表单 */}
        <CarbonSinkExcelForm {...addFormProps} />
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
      router.push('/cs/list')
    }
  })

  const { start: rejectReq } = useRequest(updateReduction, { manual: true })
  const [id, setId] = useState('')
  const { open: openFormModify, props: modifyFormProps } = useModalForm({
    title: '更改状态',
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


//获取项目列表
  const[pro,setPro]=useState([])
  const { data: proLists = [], start: getProLists } = useRequest(
    fetchProList,
    {
      enhanceResponse: (data) => {
        console.log(data)
      }
    }
  )
  // const[pro,setPro]=useState([])
  //  const {start:getRepo} =useRequest(fetchProList,
  //    {
  //      manual:true
  //    })
  //    useEffect(()=>{
  //      getRepo().then(r=>{
  //       setPro(r)
  //      })
  //    },[])


  //表头
  const columns = useMemo(() => {
    return [
      {
        title: '申请时间',
        dataIndex: 'createTime',
        ellipsis:true,
        width: 120
      },
      {
        title: '企业名称',
        dataIndex: 'extra.companyName',
        width: 150,
        ellipsis:true,
      },
      {
        title: '碳汇名称',
        dataIndex: 'extra.sinkName',
        ellipsis:true,
        width: 100
      },
      {
        title: '项目名称',
        dataIndex: 'extra.projectName',
        // render: x=> Math.round(x).toFixed(2),
        ellipsis:true,
        width: 100
      },
      {
        title: '状态',
        dataIndex: 'extra.checkStatus',
        // render: x=> Math.round(x).toFixed(2),
        ellipsis:true,
        width: 80,
        render:(t,r)=>{
          // console.log('uuu',t)
          if(t==0)return '待审核'
          else if(t==1)return '已通过'
          else return '已驳回'
        }
      },
      // {
      //   title: '碳汇类型',
      //   dataIndex: 'extra.sinkType',
      //   // render: x=> Math.round(x).toFixed(2),
      //   ellipsis:true,
      //   width: 80
      // },
      {
        title: '数据集成',
        dataIndex: 'extra.inType',
        // render: x=> Math.round(x).toFixed(2),
        ellipsis:true,
        width: 120
      },
      {
        title: '碳汇类型',
        dataIndex: 'extra.carbonType',
        // render: x=> Math.round(x).toFixed(2),
        ellipsis:true,
        width: 120
      },
      {
        title: '碳减排量总量(吨)',
        dataIndex: 'extra.sinkSum',
        ellipsis:true,
        width: 120
      },
      {
        title: '审核时间',
        dataIndex: 'extra.checkTime',
        ellipsis:true,
        width: 120
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: (t, r) => {
          return (
            <ButtonGroup type='action'>
              <Button onClick={() => {
                // console.log(r)
                localStorage.setItem('carbonItem', JSON.stringify(r))
                router.push(`/cs/view/${r.uid}`)
              }}>
                查看
              </Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  const columns2 = useMemo(() => {
    return [
      {
        title: '申请时间',
        dataIndex: 'createTime',
        ellipsis:true,
        width: 120
      },
      {
        title: '碳汇名称',
        dataIndex: 'extra.sinkName',
        ellipsis:true,
        width: 100
      },
      {
        title: '项目名称',
        dataIndex: 'extra.projectName',
        // render: x=> Math.round(x).toFixed(2),
        ellipsis:true,
        width: 100
      },
      {
        title: '状态',
        dataIndex: 'extra.checkStatus',
        // render: x=> Math.round(x).toFixed(2),
        ellipsis:true,
        width: 80,
        render:(t,r)=>{
          // console.log('uuu',t)
          if(t==0)return '待审核'
          else if(t==1)return '已通过'
          else return '已驳回'
        }
      },
      // {
      //   title: '碳汇类型',
      //   dataIndex: 'extra.sinkType',
      //   // render: x=> Math.round(x).toFixed(2),
      //   ellipsis:true,
      //   width: 80
      // },
      {
        title: '数据采集方式',
        dataIndex: 'extra.inType',
        // render: x=> Math.round(x).toFixed(2),
        ellipsis:true,
        width: 120
      },
      {
        title: '碳汇类型',
        dataIndex: 'extra.carbonType',
        // render: x=> Math.round(x).toFixed(2),
        ellipsis:true,
        width: 120
      },
      {
        title: '碳减排量总量(吨)',
        dataIndex: 'extra.sinkSum',
        ellipsis:true,
        width: 80
      },
      {
        title: '审核时间',
        dataIndex: 'extra.checkTime',
        // render: (t) => moment(t).format('YYYY-MM-DD HH:mm:ss'),
        ellipsis:true,
        width: 120
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: (t, r) => {
          return (
            <ButtonGroup type='action'>
              <Button onClick={() => {
                // console.log(r)
                localStorage.setItem('carbonItem', JSON.stringify(r))
                router.push(`/cs/view/${r.uid}`)
              }}>
                查看
              </Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  const renderSearchForm = () =>{
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
      <Form {...searchFormLayout
            } onSubmit={submit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label='碳汇名称'>
              {getFieldDecorator('like&cname')(<Input placeholder='请输入碳汇名称' />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label='项目名称'>
              {getFieldDecorator('eq&projectName', {})(
                // <Select placeholder={'请选择'}>
                //   {
                //     proLists.map((item, index) => (
                //       <Select.Option key={ item.id } value={item.extra?.projectName}>{item.extra?.projectName}</Select.Option>
                //     ))
                //   }
                // </Select>
                <Input placeholder='请输入项目名称' />
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label='数据集成'>
              {getFieldDecorator('eq&inType', {})(
                <Select placeholder={'请选择'}>
                    <Select.Option value='自主申报'>自主申报</Select.Option>
                    <Select.Option value='系统集成'>系统集成</Select.Option>
                    <Select.Option value='可信采集'>可信采集</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label='碳汇类型'>
              {getFieldDecorator('eq&carbonType', {})(
                <Select placeholder={'请选择'}>
                    <Select.Option value='光伏碳汇'>光伏碳汇</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>

          {(role==='account_admin'||role==='account_super_admin')&&( <Col span={8}>
            <Form.Item label='状态'>
              {getFieldDecorator('eq&checkStatus', {})(
                <Select placeholder={'请选择'}>
                    <Select.Option value='全部'>全部</Select.Option>
                    <Select.Option value='1'>已通过</Select.Option>
                    <Select.Option value='0'>待审核</Select.Option>
                    <Select.Option value='2'>已驳回</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>)}

          {(role==='account_org')&&(<Col span={8}></Col>)}

          {/* <Col span={8}></Col> */}

          <Col span={8}>
            <ButtonGroup type='form' align='right'>
              <Button type='primary' htmlType='submit'>
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
       {csForms()}
      <Card style={{ marginTop: -10 }}>
        {renderSearchForm()}
        <ButtonGroup>
        {/*{(role==='account_org')&&(<Button to='/cs/add' type='primary'>*/}
        {/*    添加碳汇*/}
        {/*  </Button>)}*/}
          {/*{(role==='account_admin'||role==='account_super_admin')&&( <Button*/}
          {/*  // to="wasteQuery/add"*/}
          {/*  auth={"cs_batch_import"}*/}
          {/*  onClick={openForm}*/}
          {/*  type="primary"*/}
          {/*>*/}
          {/*  批量导入*/}
          {/*</Button>)}*/}
          <Button to='/cs/add' type='primary' auth={"cs_add"}>
            添加碳汇
          </Button>
          <Button
            // to="wasteQuery/add"
            auth={"cs_batch_import"}
            onClick={openForm}
            type="primary"
          >
            批量导入
          </Button>

        </ButtonGroup>
        {(role==='account_admin'||role==='account_super_admin'||role==='SHOW')&&( <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />)}
        {(role==='account_org')&&( <PagingTable rowKey={(i) => i.id} columns={columns2} {...tableProps} />)}
      </Card>
    </Card>
  )
}

export default Form.create()(List)
