import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select, DatePicker, message, Modal, Table } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import PagingTable from '@/components/PagingTable'
import useModalForm from '@/hooks/useModalForm'
import useDict from '@/hooks/useDict'
import {getDataList, uploadFile,deleteMethods, deleteData,dynamicExcel,getWaterList,saveshujudata,savemethoddata,getMethodList} from '@/services/carbon/dataManage'
import { useTable, useRequest } from '@dragon/hooks'
import router from 'umi/router'
import {Link} from "react-router-dom";
import ExcelForm from '@/pages/DataManage/List/Modal/ExcelForm'
import { getSelectData } from '@/services/carbon/common'

const Home = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
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
      router.push('/dataManagement/allList')
    }
  })




  const reset = () => {
    router.push(`/methodMgr/list`)
    resetFields()
    searchBy()
  }


  const handleDelete = (bizNo) => {
    Modal.confirm({
      title: '确定删除？',
      content: '删除后不可恢复',
      onOk: () => {
        return deleteMethods(bizNo).then((res) => {
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
    getMethodList,
    {
      // defaultFilters: { status: type },
      form: props.form
    }
  )


  const columns = [
    {
      title: '方法学名称',
      dataIndex: 'extra.methodName',
      width:145
    },
    {
      title: '适用场景',
      dataIndex: 'extra.methodScene',
      width:100
    },
    {
      title: '描述',
      dataIndex: 'extra.methodDesc',
      width:100
    },
    {
      title: '上传时间',
      dataIndex: 'extra.optTime',
      width:100
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
              savemethoddata(r)
              router.push(`/methodMgr/detail`)
              }}>查看
            </Button>
            <Button
              auth={"method_update"}
              onClick={() => {
                savemethoddata(r);
                router.push(`/methodMgr/edit`)
              }}
            >
              编辑
            </Button>
            <Button auth={"method_delete"} onClick={() => handleDelete({ bizNos: r.bizNo })}>删除</Button>
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
              <Form.Item label="方法学名称">
                {getFieldDecorator('like&methodName')(<Input placeholder="请输入方法学名称" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="适用场景">
                {getFieldDecorator('eq&methodScene')(
                  <Select placeholder="请选择">
                    <Select.Option value="分布式光伏" key="">
                      分布式光伏
                    </Select.Option>
                    {/* {yearList.map((key) => (
                      <Select.Option key={key} value={key}>
                        {key}
                      </Select.Option>
                    ))} */}
                  </Select>
                )}
              </Form.Item>
            </Col>
{/*
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
                {getFieldDecorator('energyFrom')
                (<Input placeholder="请输入能源类型" />)}
              </Form.Item>
            </Col> */}


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

      <Card style={{ marginTop: 0 }}>
        {SearchForm()}
        {renderForms()}
        <ButtonGroup>
          <Button
            auth={"method_add"}
            // to="Method/add"
            onClick={() => {
              router.push(`/methodMgr/add`)
              }}
            // onClick={openForm}
            type="primary"
          >
            新增方法学
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
