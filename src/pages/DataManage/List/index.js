import React, {useState, useEffect, useRef} from 'react'
import router from 'umi/router'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { Table, Button, message, Popconfirm, Modal, Upload, Form, Row, Col, Input, Select } from 'antd'
import {Link} from 'react-router-dom'
import {getDataList, uploadFile, deleteData,dynamicExcel} from '@/services/carbon/dataManage'
import SearchForm from '@/components/SearchForm'
import lowIcon from '@/assets/icons/标签_低碳@2x.svg'
import midIcon from '@/assets/icons/标签_中碳@2x.svg'
import highIcon from '@/assets/icons/标签_高碳@2x.svg'
import useModalForm from "@/hooks/useModalForm";
import { useRequest,useTable} from '@dragon/hooks'
import ExcelForm from '@/pages/DataManage/List/Modal/ExcelForm'
import PagingTable from '@/components/PagingTable'
import { getSelectData } from '@/services/carbon/common'
import { useSelector } from 'react-redux'

const iconMap = {
  高: highIcon,
  中: midIcon,
  低: lowIcon
}

const ColumnOpt = ({r, request}) => {
  const [deleting, setDeleting] = useState(false)
  const [deletePopconfirmVisable, setDeletePopconfirmVisable] = useState(false)

  return (
    <ButtonGroup type="action">
      <Button>
        <Link to={{pathname: `/dataManagement/dataReport/${r.companyName}/${r.year || 2020}/${r.industry||'-'}`}}>
          查看
        </Link>
      </Button>
      {/*<Button>*/}
      {/*  <Link to={{pathname: `/dataManagement/list/edit/${r.companyName}/${r.year || 2020}`}}>编辑</Link>*/}
      {/*</Button>*/}
      <Popconfirm
        title="是否确定删除？"
        key="delete"
        placement="topRight"
        visible={deletePopconfirmVisable}
        onConfirm={() => {
          setDeleting(true)

          deleteData({
            year: r.year,
            companyName: r.name
          })
            .then((res) => {
              if (!res) {
                message.success('删除成功')
                request()
              }
            })
            .finally(() => {
              setDeleting(false)
              setDeletePopconfirmVisable(false)
            })
        }}
        onCancel={() => setDeletePopconfirmVisable(false)}
        okButtonProps={{loading: deleting}}
        okText="确定"
        cancelText="取消"
      >
        {/*<Button type="link" onClick={() => setDeletePopconfirmVisable(true)}>*/}
        {/*  删除*/}
        {/*</Button>*/}
      </Popconfirm>
    </ButtonGroup>
  )
}

const DataManageList = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props

  const role = useSelector(({ user }) => user.role)

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


  const { loading: addLoading, start: addReq } = useRequest(dynamicExcel, { manual: true })

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
      router.push('/dataManagement/list')
      // router.push('/repository/repoCheck')
      // refresh()
    }
  })

  const searchFormRef = useRef()
  // const [dataSource, setDataSource] = useState([])
  // const [loading, setLoading] = useState(false)

  const { refresh, searchBy, submit, tableProps } = useTable(
    getDataList,
    {
      // defaultFilters: { status: type },
      form: props.form
    }
  )

  const [uploading, setUploading] = useState(false)

  const searchFn = searchFormRef?.current?.search

  //表头
  const columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      align:'left',
      ellipsis: true,
      width: 145
    },
    {
      title: '年份',
      dataIndex: 'year',
      width: 46
    },
    // {
    //   title: '企业机构代码',
    //   dataIndex: 'companyCode',
    //   ellipsis: true,
    //   width: 100
    // },
    {
      title: '行业',
      dataIndex: 'industry',
      ellipsis: true,
      width: 132,
      render(t,r){
        if (t===undefined||t===null){
          return "--";
        }else {
          return t;
        }
      }
    },
    {
      title: '碳排放量(吨)',
      dataIndex: 'carbonOutCount',
      width: 79,
      ellipsis: true,
      sorter: (a, b) => a.total - b.total,
      render: (v, r) => (
        <div>
          <img width="14" src={iconMap[r.level]}/>
          <span style={{marginLeft: 6}}>{v}</span>
        </div>
      )
    },
    {
      title: '碳强度(吨/万元)',
      dataIndex: 'orgIncome',
      width: 79,
      ellipsis: true,
      sorter: (a, b) => a.ntotal - b.ntotal,
      render: (v, r) => (
        <div>
          <img width="14" src={iconMap[r.nlevel]}/>
          <span style={{marginLeft: 6}}>{v}</span>
        </div>
      )
    },
    {
      title: '碳减排量(吨)',
      dataIndex: 'reduceTotal',
      width: 79,
      ellipsis: true,
      sorter: (a, b) => a.reduceTotal - b.reduceTotal,
      render(t,r){
        if (t===undefined||t===null){
          return "0";
        }else {
          return t;
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 99,
      render: (t, r) => {
        return <ColumnOpt r={r} request={searchFn}/>
      }
    }
  ]


  const beforeUpload = (file) => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('formKey', "formKey")

    setUploading(true)
    uploadFile(formData)
      .then((res) => {
        if (!res) {
          message.success('导入成功')
          // searchFn()
        }
      })
      .finally(() => {
        setUploading(false)
      })
  }

  const uploadProps = {
    accept: '.csv,.xls,.xlsx',
    beforeUpload,
    showUploadList: false
  }

  useEffect(() => {
    // requestListData()
  if(role!=='account_org'){
    searchBy({year:'2021'})
  }
  }, [])

  const reset = () => {
    // router.push(`/dealBusiness/dealBusinessQuery`)
    resetFields()
    if(role!=='account_org'){
      searchBy({year:'2021'})
    }else searchBy()
  }

  const searchFormLayout = {
    colon: true,
    labelAlign: 'right',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const SearchForm = () => {
    return (
      <Card style={{ paddingRight: 20 }}>
        <Form {...searchFormLayout} onSubmit={submit}>
          <Row gutter={24}>

            {(role!=='account_org')&&(<Col span={8}>
              <Form.Item label="企业名称">
                {getFieldDecorator('companyName')(<Input placeholder="请输入公司名称" />)}
              </Form.Item>
            </Col>)}

            {(role==='account_org')&&(<Col span={8}>
              <Form.Item label="年份">
                {getFieldDecorator('year')
                (
                  <Select placeholder="请选择" >
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
            </Col>)}

            {(role!=='account_org')&&(<Col span={8}>
              <Form.Item label="年份">
                {getFieldDecorator('year',{
                  initialValue:'2021'
                })
                (
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
            </Col>)}

            {(role!=='account_org')&&(<div><Col span={8}>
              <Form.Item label="行业">
                {getFieldDecorator('industry')(
                  <Select placeholder="请选择">
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
            <Col span={8}></Col>
            </div>
            )}
            <Col span={8}></Col>
            <Col span={8}>
              <Row>
                <Col span={6}></Col>
                <Col span={18}>
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
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }


  return (

    <Card transparent>
      
      {renderForms()}
      <Card>
        {SearchForm()}
        {/*<SearchForm*/}
        {/*  myRef={searchFormRef}*/}
        {/*  show={{*/}
        {/*    companyName: true,*/}
        {/*    district: true,*/}
        {/*    industry: true,*/}
        {/*    year: true*/}
        {/*  }}*/}
        {/*  search={requestListData}*/}
        {/*/>*/}
        <ButtonGroup style={{display: 'flex', justifyContent: 'flex-start'}}>

        </ButtonGroup>

        <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />

      </Card>
    </Card>
  )
}

export default Form.create()(DataManageList)
