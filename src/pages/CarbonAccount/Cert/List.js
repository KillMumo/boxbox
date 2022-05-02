import Card from '@/components/Card'
import React, {useEffect, useState,useMemo} from 'react'
import {Button, Typography, Col, Divider, List, Row, Statistic, Descriptions, Select, Input, Form,Modal} from 'antd'
import style from './style.css'
import {useRequest} from '@dragon/hooks'
import { useSelector } from 'react-redux'
import { getcount} from '@/services/carbonAccount/cert'
import router from 'umi/router'
import { useTable } from '@dragon/hooks'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { fetchList } from '@/services/carbonAccount/cert'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const searchFormLayout = {
  colon: true,
  labelAlign: 'right',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const CertList = props => {
  const {
    form: {getFieldDecorator, resetFields }
  } = props

  const { searchBy, submit, tableProps } = useTable(fetchList, {
    // defaultFilters: { bizStatus: type },
    form: props.form
  })

  const columns = useMemo(() => {
    return [
      {
        title: '企业名称',
        dataIndex: 'jsonExtra.companyName',
        width: 180
      },
      {
        title: '证明编号',
        dataIndex: 'jsonExtra.certNo',
        width: 180
      },
      {
        title: '证明类型',
        dataIndex: 'jsonExtra.certType',
        width: 120
      },
      {
        title: '碳汇名称',
        dataIndex: 'jsonExtra.sinkName',
        width: 120,
        ellipsis: true
      },
      {
        title: '核算周期',
        dataIndex: 'jsonExtra.certCycle',
        width: 120,
        // render: formatTime
      },
      {
        title: '核证日期',
        dataIndex: 'createTime',
        width: 120,
        // render: (t) => formatTime(t)
      },
    ]
  }, [])

  const renderSearchForm = () => {
    const handleReset = () => {
      searchBy()
      resetFields()
    }
    return (
      <Card style={{ paddingRight: 20 }}>
      <Form {...searchFormLayout} onSubmit={submit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="企业名称">
              {getFieldDecorator('companyName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}></Col>
          <Col span={8}>
            <ButtonGroup type="form" align="right">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
      </Card>
    )
  }

  // let {data: certDetail = {}, start: fetchCert} = useRequest(
  //   getCertInfo,
  //   {
  //     manual: true
  //   }
  // )
  // useEffect(() => {
  //   fetchCert().then(res => {
  //     certDetail = res
  //     // props.form.setFieldsValue({
  //     //   uid:certDetail?.green.uid
  //     // })
  //   })
  // }, [fetchCert])

  const [count, setcount] = useState([])

  const role = useSelector(({ user }) => user.role)

  const requestcount = () => {
    getcount().then((res) => {
      setcount(res)
      console.log('count', res)
    })
  }

  useEffect(() => {
    requestcount()
  }, [])

  const onjudge=()=>{
    if(count?.convertSum===0){
      Modal.info({
        title: '当前可兑换减排量:0',
        content: '',
        onOk: () => {}
      })
    }else{
      router.push('/cert/add')
      localStorage.setItem("certType", "减排证明")
    }
  }

  const onBtnClick = (prefix) => {
    let item = {}
    item.title = document.getElementById(prefix + "title").innerText
    item.uid = document.getElementById(prefix + "id").innerText
    item.hash = document.getElementById(prefix + "hash").innerText
    item.gdate = document.getElementById(prefix + "time").innerText
    item.data = document.getElementById("data").innerText
    console.log(item)
    localStorage.setItem("item", JSON.stringify(item))
    router.push('/cert/add')
  }
  return (
    <Card transparent>
      {(role!=='account_org')&&(<Card title='兑换记录'>
          {renderSearchForm()}
          <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
      </Card>)}
      {(role==='account_org')&&(<Card>
      {/* <h1>绿色认证</h1>*/}
      <div className={style.box1}>
        <div className={style.title}>绿色认证</div>
        <Row>
          <Col span={6}>
            <div className={style.smallbox}>
              <span className={style.name}>绿色证明(个)</span>
              <span className={style.num}>{count?.greenSum}</span>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.smallbox}>
              <span className={style.name}>碳中和证明(个)</span>
              <span className={style.num}>{count?.zhongheSum}</span>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.smallbox}>
              <span className={style.name}>减排证明(个)</span>
              <span className={style.num}>{count?.reduceProveSum}</span>
            </div>
          </Col>
          <Col span={6}>
            <div style={{paddingTop: '28px'}}>
              <Button style={{marginLeft: '10px'}} onClick={() => router.push('/cert/records')} type={'primary'}>
                查看兑换记录
              </Button></div>
          </Col>
        </Row>
        <div className={style.pic1}></div>
      </div>

      {/* <h1>当前可兑换减排量(吨)</h1> */}
      <div className={style.box2}>当前可兑换碳减排量(kg)</div>
      <div className={style.box2num}>{count?.convertSum}</div>
      {/* <div id={'data'} style={{fontWeight:'bold',fontSize:20,marginLeft:20}}>{certDetail?.data}</div> */}

      <div className={style.box3}>
        <div className={style.carbonpic1}></div>
        <div className={style.carbonpic2}></div>
        <div className={style.carbonpic3}></div>
        <Button className={style.carbonbutton1} onClick={() => {
          // onBtnClick('g')
          router.push('/cert/add')
          localStorage.setItem("certType", "绿币证明")
        }} type={'primary'} disabled>
          兑换证明
        </Button>
        <Button className={style.carbonbutton2} onClick={() => {
          // onBtnClick('c')
          router.push('/cert/add')
          localStorage.setItem("certType", "碳中和证明")
        }} type={'primary'} disabled>
          兑换证明
        </Button>
        <Button className={style.carbonbutton3} onClick={() => onjudge()
        // {
        //   // onBtnClick('r')

        //   router.push('/cert/add')
        //   localStorage.setItem("certType", "减排证明")
        // }
        } type={'primary'}>
          兑换证明
        </Button>
      </div></Card>)}
    </Card>
  )
}

export default Form.create()(CertList)

