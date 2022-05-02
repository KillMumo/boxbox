import Card from '@/components/Card'
import React, { useEffect } from 'react'
import { Button, Typography, Col, Divider, List, Row, Statistic, Descriptions, Select, Input ,Form} from 'antd'
import style from './style.css'
import { useRequest } from '@dragon/hooks'
import { getCertInfo } from '@/services/carbonAccount/cert'
import router from 'umi/router'


const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const CertList = props => {
  const {
    form: { getFieldDecorator, validateFieldsAndScroll }
  } = props

  let {  data: certDetail = {}, start: fetchCert } = useRequest(
    getCertInfo,
    {
      manual: true
    }
  )
  useEffect(() => {
    fetchCert().then(res=>{
      certDetail=res
      // props.form.setFieldsValue({
      //   uid:certDetail?.green.uid
      // })
    })

  }, [fetchCert])


  const onBtnClick = (prefix) => {
    let item={}
    item.title=document.getElementById(prefix+"title").innerText
    item.uid=document.getElementById(prefix+"id").innerText
    item.hash=document.getElementById(prefix+"hash").innerText
    item.gdate=document.getElementById(prefix+"time").innerText
    item.data=document.getElementById("data").innerText
    console.log(item)
    localStorage.setItem("item",JSON.stringify(item))
    router.push('/cert/add')
  }
  return (
      <Card title={'绿色认证'} >
       {/* <h1>绿色认证</h1>*/}
        <Row type={'flex'} justify='space-around'>
          <Col span={4} style={{ textAlign: 'center' }}>
            <Statistic
              title='绿色证明(个)'
              value={certDetail?.gcount}
              valueStyle={{ fontWeight:'bold' }}

            />
          </Col>
          <Col span={4}>
            <Statistic
              title='碳中和证明(个）'
              value={certDetail?.ccount}
              valueStyle={{ fontWeight:'bold' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title='减排证明(个)'
              value={certDetail?.rcount}
              valueStyle={{ fontWeight:'bold' }}
            />

          </Col>
          <Col span={4} align={'center'}>
            <Button style={{ marginLeft: '10px' }} onClick={() =>router.push('/cert/records')} type={'primary'}>
              查看兑换记录
            </Button>
          </Col>
        </Row>
        <h1>当前可兑换减排量(吨)</h1>
        <div id={'data'} style={{fontWeight:'bold',fontSize:20,marginLeft:20}}>{certDetail?.data}</div>
        <Row type={'flex'} justify='space-around' align={'bottom'}>
          <Col span={6} style={{ border: '1px solid #000', height: '500px' }} >
            {/*<Form {...layout} name="ref">*/}
            {/*  <h1>绿币证明</h1>*/}
            {/*  <Form.Item label="编号">*/}
            {/*    {getFieldDecorator('uid', {*/}
            {/*      // rules: [*/}
            {/*      //   {*/}
            {/*      //     required: true,*/}
            {/*      //     message: '请输入字典码'*/}
            {/*      //   }*/}
            {/*      // ],*/}
            {/*      initialValue: certDetail?.green?.uid*/}
            {/*    })(<Input disabled id="code" />)}*/}
            {/*  </Form.Item>*/}
            {/*  <Form.Item label="编号">*/}
            {/*    {getFieldDecorator('hash', {*/}
            {/*      // rules: [*/}
            {/*      //   {*/}
            {/*      //     required: true,*/}
            {/*      //     message: '请输入字典码'*/}
            {/*      //   }*/}
            {/*      // ],*/}
            {/*      initialValue: certDetail?.green?.hash*/}
            {/*    })(<Input disabled />)}*/}
            {/*  </Form.Item>*/}

            <Row    style={{height:'460px',background:'skyblue'}}>
              {/*<DescriptionList column={1} title={'绿币证明'}>*/}
              {/*  <Description label="项目编号">测试</Description>*/}
              {/*  <Description label="项目编号">111</Description>*/}
              {/*  <Description label="项目编号">111</Description>*/}
              {/*  <Description label="项目编号">111</Description>*/}

              {/*</DescriptionList>*/}
              <div style={{padding:'30px'}}>
                <div className={style.container}>
                  <div><center><h2 id="gtitle">绿币证明</h2></center></div>
                  <span>证明编号：<span  id="gid">{certDetail?.green?.uid}</span></span><br/>
                  {/*<span>碳汇名称：杭州滨江分布式光伏</span><br/>*/}
                  <span  className={style.wrap}>证书哈希：<span id='ghash'> {certDetail?.green?.hash}</span></span><br/>
                  <span id='date'>核证日期：<span id='gtime'>{certDetail?.green?.time}</span></span><br/>
                </div>
              </div>
            </Row>

            <Row type={'flex'} justify={'space-around'} align={'middle'}  style={{height:'40px',background:'mediumpurple'}} >
              <Button  onClick={()=>{
                onBtnClick('g')
              }} type={'primary'} >
                兑换证明
              </Button>
            </Row>
            {/*</Form>*/}
          </Col>
          <Col span={6} style={{ border: '1px solid #000', height: '500px' }}>
            <Row    style={{height:'460px',background:'skyblue'}}>

              {/*</DescriptionList>*/}
              <div style={{padding:'30px'}}>
                <div className={style.container}>
                  <div><center><h2 id={'ctitle'}>碳中和证明</h2></center></div>
                  <span>证明编号：<span id={'cid'}>{certDetail?.carbon?.uid}</span></span><br/>
                  {/*<span>碳汇名称：杭州滨江分布式光伏</span><br/>*/}
                  <span className={style.wrap}>证书哈希： <span id={'chash'}>{certDetail?.carbon?.hash}</span></span><br/>
                  <span>核证日期：<span id={'ctime'}>{certDetail?.carbon?.time}</span></span><br/>
                </div>
              </div>
            </Row>

            <Row type={'flex'} justify={'space-around'} align={'middle'}  style={{height:'40px',background:'mediumpurple'}} >
              <Button  onClick={() =>onBtnClick('c')} type={'primary'}>
                兑换证明
              </Button>
            </Row>
          </Col>

          <Col span={6} style={{ border: '1px solid #000', height: '500px' }}>
            <Row    style={{height:'460px',background:'skyblue'}}>

              {/*</DescriptionList>*/}
              <div style={{padding:'30px'}}>
                <div className={style.container}>
                  <div><center><h2 id={'rtitle'}>减排证明</h2></center></div>
                  <span>证明编号：<span id={'rid'}> {certDetail?.reduction?.uid}</span></span><br/>
                  {/*<span>碳汇名称：杭州滨江分布式光伏</span><br/>*/}
                  <span className={style.wrap}>证书哈希： <span id={'rhash'}>{certDetail?.reduction?.hash}</span></span><br/>
                  <span>核证日期：<span id={'rtime'}>{certDetail?.reduction?.time}</span></span><br/>
                </div>
              </div>
            </Row>

            <Row type={'flex'} justify={'space-around'} align={'middle'}  style={{height:'40px',background:'mediumpurple'}} >
              <Button  onClick={() => onBtnClick('r')} type={'primary'}>
                兑换证明
              </Button>
            </Row>
          </Col>
        </Row>


      </Card>
  )
}

export default Form.create()(CertList)

