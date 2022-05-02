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
      title: '年份',
      dataIndex: 'year',
      width: 50
    },
    {
      title: '月份',
      dataIndex: 'month',
      width: 50,
      render(t,r){
        if (t===undefined||t===null){
          return "--";
        }else {
          return t;
        }
  }
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 50,
      render(t,r){
        if (t===undefined||t===null){
          return "--";
        }else {
          return t;
        }
      }
    },

    {
      title: '企业名称',
      dataIndex: 'companyName',
      width:145
    },
    {
      title: '行业',
      dataIndex: 'industry',
      width:145,
      render(t,r){
        if (t===undefined||t===null){
          return "--";
        }else {
          return t;
        }
      }
    },
    // {
    //   title: '数据类型',
    //   dataIndex: 'status',
    //   width:100
    // },
    {
      title: '碳排放量(吨)',
      dataIndex: 'total',
      width:100
    },
    {
      title: '能源类型',
      dataIndex: 'energyFrom',
      width:100
    },

    {
      title: '操作',
      key: 'action',
      width:100,
      render: (t, r) => {
        const uri = encodeURI(`${r.orgId} - ${r.energyFrom} -${ r.total}`)
        // console.log("uri--------------")
        // console.log(uri)
        return (
          <ButtonGroup type="action">
            <Button onClick={() => {
              saveshujudata(r)
              router.push(`/dataManagement/allList/details`)
              }}>查看
              {/* <Link to={{ pathname: `/dataManagement/details/${uri}` }}>查看</Link> */}
            </Button>
            <Button auth={"data_delete"} onClick={() => handleDelete({ uids: r.uid })}>删除</Button>
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
              <Form.Item label="企业名称">
                {getFieldDecorator('companyName')(<Input placeholder="请输入公司名称" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="年份">
                {getFieldDecorator('year',{
                  initialValue:'2021'
                })(
                  <Select placeholder="请选择">
                    <Select.Option value="" key="">
                      全部
                    </Select.Option>
                    {yearList.map((key) => (
                      <Select.Option key={key} value={key}>
                        {key}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="月份">
                {getFieldDecorator('month')(
                  <Select placeholder="请选择">
                    <Select.Option value="" key="">
                      全部
                    </Select.Option>
                    <Select.Option value="01" key="">
                      一月
                    </Select.Option>
                    <Select.Option value="02" key="">
                      二月
                    </Select.Option>
                    <Select.Option value="03" key="">
                      三月
                    </Select.Option>
                    <Select.Option value="04" key="">
                      四月
                    </Select.Option>
                    <Select.Option value="05" key="">
                      五月
                    </Select.Option>
                    <Select.Option value="06" key="">
                      六月
                    </Select.Option>
                    <Select.Option value="07" key="">
                      七月
                    </Select.Option>
                    <Select.Option value="08" key="">
                      八月
                    </Select.Option>
                    <Select.Option value="09" key="">
                      九月
                    </Select.Option>
                    <Select.Option value="10" key="">
                      十月
                    </Select.Option>
                    <Select.Option value="11" key="">
                      十一月
                    </Select.Option>
                    <Select.Option value="12" key="">
                      十二月
                    </Select.Option>

                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="行业">
                {getFieldDecorator('industry')(
                  <Select placeholder="请输入">
                    <Select.Option value="" key="">
                      全部
                    </Select.Option>
                    {industryList.map((key) => (
                      <Select.Option key={key} value={key}>
                        {key}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
             <Form.Item label="能源类型">
               {getFieldDecorator('energyFrom')(
               <Select placeholder="请输入">
               {Object.keys(carbonModle).map((key) => (
                 <Select.Option key={key} value={carbonModle[key]}>
                   {carbonModle[key]}
                 </Select.Option>
               ))}
             </Select>)}
              {/* (<Input placeholder="请输入数据来源" />)} */}
             </Form.Item>
            </Col>


            <Col span={8}>
              {/* <Row>
                <Col span={6}></Col>
                <Col span={18}> */}
                  <ButtonGroup align='right'>
                    <Button
                      style={{
                        backgroundColor: '#35AE8C',
                        borderColor: '#35AE8C',
                        '&hover': {
                          backgroundColor: '#7ae6c7',
                          borderColor: '#7ae6c7'
                        }
                      }}
                      type="primary"
                      htmlType="submit"
                    >
                      查询
                    </Button>
                    <Button onClick={reset}>重置</Button>
                  </ButtonGroup>
                {/* </Col>
              </Row> */}
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
            auth={"data_batch_import"}
            onClick={openForm}
            type="primary"
          >
            批量导入
          </Button>
          <Button
            auth={"data_mgr_batch_delete"}
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
