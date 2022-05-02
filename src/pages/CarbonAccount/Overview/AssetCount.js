import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import router from 'umi/router'
import {Form, Row, Col, Select, Button, message,Icon} from 'antd'
import styles from './styles.less'
import {  getCount, getList,addCarbonConfig,getselectlist,saveYear,saveCompanyname,fetchCompanyname } from '@/services/carbonAccount/accountView'
import {Link} from "react-router-dom";
import useModalForm from "@/hooks/useModalForm";
import {useRequest} from "@dragon/hooks";
import CarbonConfigForm from "@/pages/CarbonAccount/Overview/modal/CarbonConfigForm";
import { useSelector } from 'react-redux'
import {tanpai} from './image/碳排放量.png'
import useSearchCompany from '@/hooks/useSearchCompany2'

const AssetCount = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props

  const role = useSelector(({ user }) => user.role)

  const { loading: addLoading, start: addReq } = useRequest(addCarbonConfig, { manual: true })
  const renderForms = () => {
    return (
      <React.Fragment>
        {/* 新建表单 */}
        <CarbonConfigForm {...addFormProps} />
      </React.Fragment>
    )
  }

  const { open: openForm, props: addFormProps } = useModalForm({
    title: '请配置',
    confirmLoading: addLoading,
    afterValidate: async (v, close) => {
      const res = await addReq({
        ...v
      })
      if (res instanceof Error) return
      message.success('配置成功')
      window.location.reload()
      router.push('/overview/count')
      // refresh()
    }
  })

  const yearchange=(e)=>{
    setyear(e)
    saveYear(year)
  }

  const [count, setcount] = useState([])
  const [selectlist, setselectlist] = useState([])
  const [year, setyear] = useState('2021')

  const requestCount = () => {
    getCount({year:year.toString(),companyName:fetchCompanyname()}).then((res) => {
      setcount(res)
    })
  }

  const requestSelect=()=>{
    getselectlist().then((res)=>{
      setselectlist(res.yearList)
    })
  }

  useEffect(() => {
    requestSelect()
    // if(role==='account_org'){
    //   saveCompanyname('')
    // }
    if(role!=='account_org'){
      saveCompanyname('无公司')
    }
  }, [])

  useEffect(() => {
    if(role==='account_org'){
      saveCompanyname('')
    }
    // if(role==='account_super_admin'){
    //   saveCompanyname('无公司')
    // }
    requestCount()
    saveYear(year)
  }, [year])


  const { props: selectProps } = useSearchCompany({
    onSearchSuccess: (data) => {
      // 若注册资本、公司地址、经营范围企查查中读取不到，则输入框允许用户自行输入
      // toggleCapital(!!data.capital)
      // toggleAddress(!!data.cmyOrgCode)
      // toggleScope(!!data.scope)
      // toggleOrgType(!!data.orgType)

      // setFieldsValue({
      //   socialCreditCode: data.companySocialcreditCode,
      //   orgType: data.orgType,
      //   scope: data.scope,
      //   capital: data.capital,
      //   cmyOrgCode: data.cmyOrgCode,
      //   legalPersonName: data.companyLegalerName
      // })
      setcount(data)
      console.log('llll',data)
    }
  })

  return (
    <Card>
      {renderForms()}
      <div style={{marginBottom: '16px',display: 'inline-block'}}>选择年份:<Select style={{width: '100px',marginLeft:'10px'}} defaultValue='2021' onChange={yearchange}>
          {selectlist.map((el)=>
            <Select.Option value={el}>
              {el}
            </Select.Option>
          )}
      </Select></div>   
      {(role!=='account_org')&&(<div style={{marginLeft: '16px',display: 'inline-block'}}>选择企业:<Select combobox placeholder="请输入" style={{width: '250px',marginLeft:'10px'}} {...selectProps}></Select></div> )}   
      <Row gutter={24} style={{ marginBottom: '16px' }}>
        <Col span={8}>
          <div className={styles.box}>
            <div className={styles.pic1}></div>
            <span className={styles.lt}>碳排放量(吨)<Link style={{marginLeft:'20px'}} to={{ pathname: `/overview/co2EmissionsList` }}><span style={{color:'rgba(0,0,0,0.25)'}}>查看流水></span></Link></span>
            {/* <span className={styles.rt}></span> */}
            <span className={styles.lb}>{count?.carbonOutCount}</span>
            {/* <span className={styles.rb}>碳配额{count?.carbonConfigValue} <Icon type="edit" style={{color:'rgba(57, 163, 98, 1)'}} onClick={openForm}/> */}
            {/* <button  onClick={openForm}>》</button> */}
            {/* </span> */}
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.box}>
          <div className={styles.pic2}></div>
            <span className={styles.lt}>碳减排量(吨)<Link style={{marginLeft:'20px'}}  to={{ pathname: `/overview/carbonReduceList/` }}><span style={{color:'rgba(0,0,0,0.25)'}}>查看流水></span></Link></span>
            {/* <span className={styles.rt}></span> */}
            <span className={styles.lb}>{count?.carbonReduceCount}</span>
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.box}>
          <div className={styles.pic3}></div>
            <span className={styles.lt}>购入减排证明(个)<Link style={{marginLeft:'20px'}} to={{ pathname: `/overview/list/` }}><span style={{color:'rgba(0,0,0,0.25)'}}>查看流水></span></Link></span>
            {/* <span className={styles.rt}></span> */}
            <span className={styles.lb}>{count?.buyProveCount}</span>
          </div>
        </Col>
      </Row>
      <Row gutter={24} style={{ marginBottom: '16px' }}>
        <Col span={8}>
          <div className={styles.box}>
          <div className={styles.pic4}></div>
            <span className={styles.lt}>绿币证明(个)<Link style={{marginLeft:'20px'}} to={{ pathname: `/overview/greenCornProveWaterList/` }}><span style={{color:'rgba(0,0,0,0.25)'}}>查看流水></span></Link></span>
            {/* <span className={styles.rt}> </span> */}
            <span className={styles.lb}>{count?.greenCornProveCount}</span>
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.box}>
          <div className={styles.pic4}></div>
            <span className={styles.lt}>碳中和证明(个)<Link style={{marginLeft:'20px'}} to={{ pathname: `/overview/carbonNeutralWaterList/` }}><span style={{color:'rgba(0,0,0,0.25)'}}>查看流水></span></Link></span>
            {/* <span className={styles.rt}></span> */}
            <span className={styles.lb}>{count?.neutralProveCount}</span>
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.box}>
          <div className={styles.pic4}></div>
            <span className={styles.lt}>减排证明(个)<Link style={{marginLeft:'20px'}} to={{ pathname: `/overview/reduceProveWaterList/` }}><span style={{color:'rgba(0,0,0,0.25)'}}>查看流水></span></Link></span>
            {/* <span className={styles.rt}></span> */}
            <span className={styles.lb}>{count?.reduceProveCount}</span>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default Form.create()(AssetCount)
