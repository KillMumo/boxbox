import React, { useState } from 'react'
import DescriptionList from '@/components/DescriptionList'
import Card from '@/components/Card'
import { Button, Descriptions, Select, Table } from 'antd'
import { useRequest, useTable } from '@dragon/hooks'
import {
  fetchDetail,
  getDevice,
  getDeviceFlow,
  getTotalDeviceFlow
} from '@/services/carbonAccount/carbonsink'
import PagingTable from '@/components/PagingTable'
import Tabs from '@/pages/AppMicroSubsides/components/Tabs'
const { Option } = Select;
const {TabPane} = Tabs
const Description = DescriptionList.Description
const View = (props) => {
  const {
    params: { id }
  } = props.match

  const { loading, data: info = {} } = useRequest(() => fetchDetail({ uid:id }))
  const {  data: deviceList = [], start: getDeviceList } = useRequest(
    getDevice,
    {
      enhanceResponse: (data) => {
        console.log(data)
      }
    }
  )

  let {  data: flowList = [], start: getFlow } = useRequest(
    getDeviceFlow,
    {
      enhanceResponse: (data) => {
        // console.log(data)
      }
    }
  )
  let {  data: totalList = [], start: getTotal } = useRequest(
    getTotalDeviceFlow,
    {
      enhanceResponse: (data) => {
        // console.log(data)
      }
    }
  )


  const buttonlayout = {
    labelAlign: 'right',
    labelCol: { span: 11 },
    wrapperCol: { span: 13 },
    colon: false
  }
  const [dataSource,setDataSource] = useState([])
  const [dataSource1,setDataSource1] = useState([])
  const [conclusion,setConclusion] = useState({})
  function handleChange(value) {
    console.log(`selected ${value}`);
    getFlow({ deviceId: value }).then(r  =>{
        setDataSource(
          (r.deviceFlow||[]).map((item,index)=>{
            return item
          })
        )
      setDataSource1(
        (r.totalDeviceFlow||[]).map((item,index)=>{
          return item
        })
      )
      setConclusion(r.conclusion)
    })
    //   .finally(
    //   ()=>{
    //     getTotal({ deviceId: value }).then(r => {
    //       setDataSource1(
    //         (r||[]).map((item,index)=>{
    //           return item
    //         })
    //       )
    //     })
    //   }
    // )

  }


  // const dataSource = [
  //   {
  //     key: '1',
  //     data: '胡彦斌',
  //     unit: 'kg',
  //     createTime: '2021-10-01',
  //   },
  //   {
  //     key: '2',
  //     data: '胡彦斌',
  //     unit: 'kg',
  //     createTime: '2021-10-01',
  //   },
  // ];

  const columns = [
    {
      title: '数据',
      dataIndex: 'jsonExtra.data',
      key: 'data',
    },
    {
      title: '单位',
      dataIndex: 'jsonExtra.unit',
      key: 'unit',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];


  const columns1 = [
    {
      title: '减碳量',
      dataIndex: 'jsonExtra.data',
      key: 'reduction',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];

  return (
    <Card >
      <DescriptionList loading={{loading}}>
        <Descriptions title={"碳汇资产"}>
        <Description label="碳汇名称">{info?.jsonExtra?.cname}</Description>
        <Description label="方法学名称及版本">{info?.jsonExtra?.mname}</Description>
        </Descriptions>

        <Descriptions title={"减排项目"} >
          <Description.Item label="项目名称">{info?.jsonExtra?.project.projectName}</Description.Item>
          <Description.Item label="描述">{info?.jsonExtra?.project.desc}</Description.Item>
          <Description.Item label="建设规模">{info?.jsonExtra?.project.buildingScale}</Description.Item>
          <Description.Item label="备案文件号">{info?.jsonExtra?.project.fileNum}</Description.Item>
          <Description.Item label="备案时间">{info?.jsonExtra?.project.fileTime}</Description.Item>
          <Description.Item label="开始（并网）时间">{info?.jsonExtra?.project.startTime}</Description.Item>
          <Description.Item label="投产规模">{info?.jsonExtra?.project.scale}</Description.Item>
          <Description.Item label="附件"><a href={info?.jsonExtra?.project.attachment[0].url}>{info?.jsonExtra?.project.attachment[0].name}</a></Description.Item>

        </Descriptions>
       {/* <Descriptions title={'测试'}>
          <Descriptions.Item >
            <Tabs defaultActiveKey="1" >
              <TabPane tab="Tab 1" key="1">
                Content of Tab Pane 1
              </TabPane>
              <TabPane tab="Tab 2" key="2">
                Content of Tab Pane 2
              </TabPane>
              <TabPane tab="Tab 3" key="3">
                Content of Tab Pane 3
              </TabPane>
            </Tabs>
          </Descriptions.Item>
        </Descriptions>*/}
        <Descriptions title="监测数据" bordered >
          <Descriptions.Item label="设备" spam={1}>
            <Select  style={{ width: 120 }} onChange={handleChange}>
              {
                deviceList.map((item, index) => (
                  <Select.Option key={{ index }} value={item.deviceId}>{item.deviceName}</Select.Option>
                ))
              }
            </Select>
          </Descriptions.Item>
          <Descriptions.Item>
            <Table rowKey={(i) => i.id} columns={columns} dataSource={dataSource} pagination={{
              defaultCurrent:1,
              total:dataSource.length
            }}/>
          </Descriptions.Item>
          <Descriptions.Item label="减碳量计算结果">
            <Table rowKey={(i) => i.id} columns={columns1}  dataSource={dataSource1} pagination={{total:dataSource1.length}}/>;
          </Descriptions.Item>
        </Descriptions>



        <Descriptions title={'碳核证结论'}>
          <Descriptions.Item label="">
            `经核证， {info?.jsonExtra?.project.projectName} 于 {conclusion.startYear}年 {conclusion.startMonth}月 {conclusion.startDay}日 至 {conclusion.endYear}年 {conclusion.endMonth}月 {conclusion.endDay}日 产生的光伏核证减碳量为{Number(conclusion.total||0).toFixed(2)} 吨二氧化碳。
`
          </Descriptions.Item>
        </Descriptions>
      </DescriptionList>

    </Card>
  )
}

export default View
