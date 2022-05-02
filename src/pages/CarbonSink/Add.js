import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select, DatePicker, message, InputNumber, Divider, Radio, Tag,Table } from 'antd'
import { useRequest, useTable } from '@dragon/hooks'
import useDict from '@/hooks/useDict'
import PagingTable from '@/components/PagingTable'
import {
  addJob,
  fetchDetail,
  fetchProList,
  getDeviceList,
  getOrgId, getParam,
  save,
  setParam,
  getMonthList,
  addSink
} from '@/services/carbonAccount/carbonsink'
import router from 'umi/router'
import Log from '../../../config/routers/Common/routers/Log'
import ButtonGroup from '@/components/ButtonGroup'
import moment from 'moment'
import UploadNew from '@/components/UploadNew'
import UploadButton from '@/components/UploadButton'

const Add = (props) => {
  const names = useDict('dict_method')
  const { RangePicker } = DatePicker

  const [type1startdate,settype1startdate]=useState('2021-10')
  const [type1enddate,settype1enddate]=useState('2022-01')
  const [monthlist,setmonthlist]=useState([])
  const [data,setdata]=useState([])
  const [listshujudata,setlistshujudata]=useState([])

  const [sinktype,settype]=useState('')
  const [sinkname,setname]=useState('')
  const [projectname,setprojectName]=useState('')
  const [radiovalue, setValue] = useState('自主申报')

  const formatDate2=(values)=>{
    values.startDate = moment(values[0]).format('yyyy-MM')
    values.endDate = moment(values[1]).format('yyyy-MM')
    settype1startdate(values.startDate)
    settype1enddate(values.endDate)
    console.log('zhouqichange', values)
  }

  const formatDate = (values) => {
    // values.startDate = moment(values[0]).format('yyyy-MM-DD')
    // values.endDate = moment(values[0]).format('yyyy-MM-DD')
    // settype2startdate(values.startDate)
    // settype2enddate(values.endDate)
    // console.log('shijian',values)
  }

  const requestMonthList=()=>{
    getMonthList({startDate:type1startdate,endDate:type1enddate}).then((res)=>{
      setmonthlist(res)
    })
  }

  const resettable=()=>{
    if(monthlist.length>0){
      let arr=[]
      let arr2=[]
      monthlist.map((el)=>{
       arr.push({
         shuju:'',
         danwei:'kwh',
         shijian:el,
       })
       arr2.push('0')
      })
      console.log('datalist',arr)
      console.log('datalist222',arr2)
      setdata(arr)
      setlistshujudata(arr2)
     }
  }

  useEffect(() => {
    requestMonthList()
  },[type1startdate,type1enddate])

  useEffect(() => {
    resettable()
  },[monthlist])

  // const handleSubmit2=()=>{
  //   // console.log('liebiao',{
  //   //   sinkType:sinktype,
  //   //   sinkName:sinkname,
  //   //   projectName:projectname,
  //   //   inType:radiovalue,
  //   //   valueList:listshujudata
  //   // })
  //   addSink({
  //     sinkType:sinktype,
  //     sinkName:sinkname,
  //     projectName:projectname,
  //     inType:radiovalue,
  //     valueList:listshujudata,
  //     monthList:monthlist,
  //     unit:'kwh'
  //   })
  //   // addSink()
  // }

  const { loading: submitLoading2, start: submitReq2 } = useRequest(addSink, {
    manual: true,
    onSuccess: () => {
      router.push('/cs/list')
      message.success('添加成功')
    }
  })

  // 添加/修改商品
  const handleSubmit2 = useCallback(
    (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          console.log(values)
          const params = {
            ...values,
            // sinkType:sinktype,
            // sinkName:sinkname,
            // projectName:projectname,
            inType:radiovalue,
            valueList:listshujudata,
            monthList:monthlist,
            unit:'kwh'
          }
          submitReq2(params)
        }
      })
    },
    [validateFields, submitReq2,sinktype,sinkname,projectname,radiovalue,listshujudata,monthlist]
  )

  class ControlledRangePicker extends React.Component {
    state = {
      mode: ['month', 'month'],
      value: [],
    };

    handlePanelChange = (value, mode) => {
      this.setState({
        value,
        mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
      });
      // console.log('342334',this.state)
    };

    handleChange = value => {
      this.setState({ value });
      // console.log('342334',value)
    };

    render() {
      const { value, mode } = this.state;
      return (
        <RangePicker
          placeholder={['开始月份', '结束月份']}
          format="YYYY-MM"
          value={value}
          mode={mode}
          onChange={this.handleChange}
          onPanelChange={this.handlePanelChange}
        />
      );
    }
  }

  const formLayout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    colon: true
  }
  const itemlayout = {
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    colon: true
  }
  const buttonlayout = {
    labelAlign: 'right',
    labelCol: { span: 11 },
    wrapperCol: { span: 13 },
    colon: false
  }

  const {
    form: { getFieldDecorator, validateFields },
    match: {
      params: { id }
    }
  } = props

  const { loading: submitLoading, start: submitReq } = useRequest(save, {
    manual: true
  })

  const { loading: getWasteLoading, data: info = {}, start } = useRequest(fetchDetail, {
    manual: true
  })

  const { start: myJob } = useRequest(addJob, {
    manual: true
  })
  let {  data: orgId = {}, start:fetchOrgId } = useRequest(getOrgId, {
    manual: true
  })

  useEffect(()=>{
    fetchOrgId().then(res=>{
      orgId=res.orgId
    })
  },[])

  useEffect(() => {
    if (id) {
      start({ uid: id })
    }
  }, [id, start])

  //获取项目列表
  const { loading: getRepoLoading, data: proLists = [], start: getRepoLists } = useRequest(
    fetchProList,
    {
      enhanceResponse: (data) => {
        console.log(data)
      }
    }
  )

  const { refresh, searchBy, submit, tableProps } = useTable(getDeviceList, {
    form: props.form
  })

  const columns = useMemo(() => {
    return [

      {
        title: '设备名称',
        dataIndex: 'jsonExtra.deviceName',
        width: 120
      },
      {
        title: '设备ID',
        dataIndex: 'jsonExtra.deviceId',
        width: 120
      },
      {
        title:'操作',
        key:'action',
        width: 120,
        render:(t, r) => {
          return (
            <ButtonGroup type="action">
              <Button onClick={() => {
                // saveshujudata(r)
                // openFormModify()
                window.open(`/device/view/${r.uid}-${r.jsonExtra.deviceId}`,'_blank')
                }}>查看
              </Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  const columns2=[
    {
      title: '数据',
      dataIndex: 'shuju',
      width: 120,
      render:(t, r,i) => {
        const getvalue=(e)=>{
          // console.log('??',e.target.value);
          listshujudata[i]=e.target.value
          // console.log('::::',arr)
        }
        return(
          <Input style={{ width: '80%' }} onChange={getvalue} defaultValue='0' placeholder="请输入"/>
        )
      }
    },
    {
      title: '单位',
      dataIndex: 'danwei',
      width: 120
    },
    {
      title: '时间',
      dataIndex: 'shijian',
      width: 120
    },
  ]

  // const data=[
  //   {
  //     shuju:'',
  //     danwei:'kwh',
  //     shijian:'2016-09',
  //   },
  // ]

  //  提交按钮事件
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields((err, values) => {
        if (!err) {
          let deviceList = JSON.parse(localStorage.getItem('deviceList'))
          values = {
            ...values,
            fileTime:moment(values.fileTime).format('YYYY-MM-DD'),
            startTime:moment(values.startTime).format('YYYY-MM-DD'),
            deviceList: deviceList
          }
          console.log(values)
          let deviceIds = ''
          if (deviceList.length === 1) {
            deviceIds += deviceList[0].jsonExtra.deviceId
          } else {
            deviceIds += deviceList[0].jsonExtra.deviceId + ','
            for (let i = 1; i < deviceList.length; i++) {
              if (i !== deviceList.length - 1) {
                deviceIds += deviceList[i].uid + ','
              } else {
                deviceIds += deviceList[i].uid
              }
            }
          }
          deviceIds += ',' + values.project.bizNo
          deviceIds += ',' + orgId
          console.log(deviceIds)

          submitReq({
            ...values,
            type:'分布式光伏',
            param:deviceIds
          }).then((res) => {
            if (res instanceof Error) return
            setParam(res)

          }).finally(()=>{
            //调取定时定时任务接口
            addJob({
              param:getParam()
            }).then(res=>{
              if (res instanceof Error) return
              message.success(`添加成功`)
              router.push('/cs/list')
            })
          })

          console.log(values)
        }
      })
    },
    [id, submitReq, validateFields]
  )


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setDeviceList(() => {
        return selectedRows
      })
      localStorage.setItem('deviceList', JSON.stringify(selectedRows))
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
  }

  const [deviceList, setDeviceList] = useState([])
  useEffect(() => {
    console.log('effect')
    console.log(deviceList)
  }, [deviceList])

  const [selectionType, setSelectionType] = useState('checkbox')

  const onradioChange = e => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const shebeichange=useCallback(
    (d, ds) => {
      console.log('shebeichange', d)
      console.log('shebeichangeds', ds)
    },
    []
  )

  const typechange=(e)=>{
    console.log('typechange', e)
    settype(e)
  }

  const sinknamechange=(e)=>{
    console.log('sinknamechange', e.target.value)
    setname(e.target.value)
  }

  const projectNamechange=(e)=>{
    console.log('projectNamechange', e)
    setprojectName(e)
  }

  return (
    <Card loading={getWasteLoading}>
      <Form {...formLayout}>

        <h1>碳汇资产</h1>
        <Form.Item {...itemlayout} label='碳汇类型'>
          {getFieldDecorator('carbonType', {
            rules: [
              {
                required: true,
                message: '请选择碳汇类型！'
              }
            ],
            initialValue: '分布式光伏'
          })(<Select style={{ width: 600 }} placeholder={'请选择'} onChange={typechange}>
              <Select.Option value='分布式光伏'>分布式光伏</Select.Option>
            </Select>)}
        </Form.Item>

        <Form.Item {...itemlayout} label='碳汇名称'>
          {getFieldDecorator('sinkName', {
            rules: [
              {
                required: true,
                message: '请输入碳汇名称！'
              }
            ],
            // initialValue: info?.extra?.cname
          })(<Input style={{ width: 600 }} placeholder='请输入' onChange={sinknamechange}/>)}
        </Form.Item>

        <h1>减排项目</h1>

        <Form.Item {...itemlayout} label='项目名称'>
          {getFieldDecorator('projectName', {
            rules: [
              {
                required: false,
                message: '请输入项目名称！'
              }
            ],
            // initialValue: info?.extra?.project
          })(
            <Select style={{ width: 600 }} placeholder={'请选择'} onChange={projectNamechange}>
              {
                proLists.map((item, index) => (
                  <Select.Option key={{ index }} value={item.extra.projectName}>{item.extra?.projectName}</Select.Option>
                ))
              }
            </Select>)}
        </Form.Item>

        <h1>监测数据</h1>

        <Row style={{marginBottom:'30px'}}>
          <Col span={4}></Col>
          <Col span={20}>
            <Radio.Group onChange={onradioChange} defaultValue='自主申报'>
              <Radio value='自主申报'>自主申报</Radio>
              <Radio value='设备采集'>设备采集</Radio>
            </Radio.Group>
          </Col>
        </Row>

        {(radiovalue==='自主申报')&&(
          <div>
          <Form.Item {...itemlayout} label='请选择核算周期(必选)'>
          {/* {getFieldDecorator('zizhutime')(<ControlledRangePicker onPanelChange={zhouqichange}/>)} */}
          {getFieldDecorator('zizhutime')(<RangePicker onChange={formatDate2}/>)}
          </Form.Item>
          <Form.Item {...itemlayout} label='请填写数据'>
          {getFieldDecorator('c', {
            rules: [
              {
                required: false,
                message: '请填写数据！'
              }
            ],
            // initialValue: info?.extra?.cname
          })( <Table columns={columns2} dataSource={data} pagination={false}/>)}
          </Form.Item>
          <Form.Item {...itemlayout} label='发电量结算单/辅助证明文件'>
          {getFieldDecorator('fuzhufile', {
            rules: [
              {
                required: false,
                message: '请上传发电量结算单/辅助证明文件！'
              }
            ],
            // initialValue: info?.extra?.cname
          })(<UploadNew
            minLength="0"
            length="10"
            // maxFileNum="10"
            size="20"
            extra="请上传其他附件"
            accept=".zip,.rar"
            listType="picture"
          >
            <UploadButton />
          </UploadNew>)}
        </Form.Item>
          </div>
        )}

        {(radiovalue==='设备采集')&&(
        <div>
          <Form.Item {...itemlayout} label='请选择核算周期'>
          {getFieldDecorator('stime')(<RangePicker onChange={formatDate}/>)}
          </Form.Item>

          <Form.Item {...itemlayout} label='请选择设备'>
          {getFieldDecorator('d', {
            // rules: [
            //   {
            //     required: true,
            //     message: '请选择设备！'
            //   }
            // ],
            // initialValue: info?.extra?.cname
          })( <PagingTable
              rowKey={(i) => i.bizNo}
              rowSelection={{
                type: selectionType,
                ...rowSelection
              }}
              columns={columns}
              {...tableProps}
            />)}
          </Form.Item>
          </div>
        )}

        {/* <Form.Item label=''>
          <div>
            <Radio.Group
              onChange={({ target: { value } }) => {
                setSelectionType(value)

              }}
              value={selectionType}
            >
              <Radio value='checkbox'>Checkbox</Radio>
              <Radio value='radio'>radio</Radio>
            </Radio.Group>

            <Divider />

            <PagingTable
              rowKey={(i) => i.bizNo}
              rowSelection={{
                type: selectionType,
                ...rowSelection
              }}
              columns={columns}
              {...tableProps}
            />
          </div>
        </Form.Item> */}

        <Form.Item {...buttonlayout} label=' '>
          <Button
            // loading={updateLoading || submitLoading}
            loading={submitLoading2}
            type='primary'
            htmlType='submit'
            // onClick={handleSubmit}
            onClick={handleSubmit2}
          >
            提交
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => props.history.goBack()}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Form.create()(Add)
