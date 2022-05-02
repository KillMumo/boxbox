import React, { useCallback, useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Button, Input, message, Select, DatePicker, Row, Col, InputNumber } from 'antd'
import { useRequest } from '@dragon/hooks'
import router from 'umi/router'
import style from './style.css'
import { addCertInfo, getItem } from '@/services/carbonAccount/cert'
import moment from 'moment/moment'



const { RangePicker } = DatePicker;
const Hist = (props) => {
  const formLayout = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 15 },
    colon: false
  }
const [item,setItem]=useState({})
  useEffect(() => {
    setItem( JSON.parse(localStorage.getItem('item')))
    console.log(item)
  }, [])


  // 申请添加
  const { loading: submitLoading, start: submitReq } = useRequest(addCertInfo, {
    manual: true,
    onSuccess: () => {
      router.push('/cert/records')
      message.success('添加成功')
    }
  })


  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          const params = {
            ...values,
            // hash:getItem().hash(),
            // time:moment(new Date()).format('YYYY-MM-DD')
          }
          console.log(params)
         await submitReq(params)
        }
      })
    },
    [validateFields, submitReq]
  )

  const {
    form: { getFieldDecorator, validateFields }
  } = props

  const [cname,setCName]= useState("")
  return (
    <Card>
      <Form {...formLayout} >
        <Form.Item label="">
          {getFieldDecorator('title', {
            initialValue:getItem().title
          })(<Input style={{ width: 300 }} type={'hidden'} placeholder="0" />)}
        </Form.Item>
        <Form.Item label="">
          {getFieldDecorator('hash', {
            initialValue:getItem().hash
          })(<Input style={{ width: 300 }} type={'hidden'} />)}
        </Form.Item>
        <Form.Item label="">
          {getFieldDecorator('time', {
            initialValue:moment(new Date()).format('YYYY-MM-DD')
          })(<Input style={{ width: 300 }} type={'hidden'} />)}
        </Form.Item>
        <Form.Item label="证件编号">
          {getFieldDecorator('uid', {
            rules: [
              {
                required: true,
                message: '请输入证件编码！'
              }
            ],
            initialValue:getItem().uid
          })(<Input style={{ width: 300 }} disabled placeholder="0" />)}
        </Form.Item>
        <Form.Item label="减排量">
          {getFieldDecorator('reduction', {
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入减排量！'
            //   }
            // ],
          })(<InputNumber style={{ width: 300 }} disabled placeholder="0" />)}
        </Form.Item>

        <Form.Item label="碳汇名称">
          {getFieldDecorator('cname', {
            rules: [
              {
                required: true,
                message: '请输入碳汇名称！'
              }
            ]
          })(<Input style={{ width: 300 }} placeholder="请输入" onChange={(e)=>setCName(e.target.value)} />)}
        </Form.Item>

        <Form.Item label="核算周期">

          {getFieldDecorator('period',{
            rules: [
              {
                required: true,
                message: '核算周期！'
              }
            ]
          })(
            <RangePicker />
            // <Select placeholder="请选择" style={{ width: 300 }}>
            //   {Object.keys(carbonModle).map((key) => (
            //     <Select.Option key={key} value={carbonModle[key]}>
            //       {carbonModle[key]}
            //     </Select.Option>
            //   ))}
            // </Select>
          )}

        </Form.Item>

        <Form.Item label="兑换数量" >
          {getFieldDecorator('count', {
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入兑换数量！'
            //   }
            // ]
          })(<InputNumber style={{ width: 300 }} placeholder="请输入" onBlur={(e)=>{
            console.log(e.target.value)
            props.form.setFieldsValue({ reduction:e.target.value })
           // let form = props.form
           //  let count = form.getFieldsValue('count')
           //  console.log(111)
            // console.log(count)
          }} />)}
        </Form.Item>
        <Form.Item label="查看证书">
          {getFieldDecorator('cert', {
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入兑换数量！'
            //   }
            // ]
          })(
            <Col span={12} style={{ border: '1px solid #000' }}  >
              <Row    style={{height:'460px',background:'skyblue'}}>
                {/*<DescriptionList column={1} title={'绿币证明'}>*/}
                {/*  <Description label="项目编号">测试</Description>*/}
                {/*  <Description label="项目编号">111</Description>*/}
                {/*  <Description label="项目编号">111</Description>*/}
                {/*  <Description label="项目编号">111</Description>*/}

                {/*</DescriptionList>*/}
                <div style={{padding:'30px'}}>
                  <div className={style.container}>
                    <div><center><h2>{getItem().title}</h2></center></div>
                    <span>证明编号：{getItem().uid}</span><br/>
                    <span>碳汇名称：{cname}</span><br/>
                    <span className={style.wrap}>证书哈希： {getItem().hash}</span><br/>
                    <span>核证日期：{moment(new Date()).format('YYYY-MM-DD')}</span><br/>
                  </div>
                </div>
              </Row>
            </Col>

          )}
        </Form.Item>
        <Form.Item label=" ">
          <Button loading={submitLoading} type="primary" htmlType="submit" onClick={handleSubmit}>
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

export default Form.create()(Hist)
