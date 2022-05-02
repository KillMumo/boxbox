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
              saveshujudata(r)
              router.push(`/reduction/view`)
              }}>查看
              {/* <Link to={{ pathname: `/dataManagement/details/${uri}` }}>查看</Link> */}
            </Button>
          </ButtonGroup>
        )
      }
    }
  ]

  return (
    <Card transparent>
      <Card style={{ marginTop: -10 }}>
        {/* {SearchForm()} */}
        {renderForms()}
        <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps}/>
      </Card>
    </Card>
  )
}

export default Form.create()(Home)
