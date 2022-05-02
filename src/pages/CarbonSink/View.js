import React, { useState,useEffect } from 'react'
import DescriptionList from '@/components/DescriptionList'
import Card from '@/components/Card'
import { Button, Descriptions, Select, Table,Row,Col,message,Modal} from 'antd'
import { useRequest, useTable } from '@dragon/hooks'
import {
  fetchDetail,
  getDevice,
  getDeviceFlow,
  getTotalDeviceFlow,
  fetchcarbonItem,
  gettabledata
} from '@/services/carbonAccount/carbonsink'
import PagingTable from '@/components/PagingTable'
import Tabs from '@/pages/AppMicroSubsides/components/Tabs'
import { useSelector } from 'react-redux'
import DownloadItem from '@/components/DownloadItem'
import { getreducdetail} from '@/services/carbonAccount/reduction'
import { getMethodList} from '@/services/carbonAccount/reduction'
import { handleOperation} from '@/services/carbonAccount/carbonsink'
import router from 'umi/router'

const Description = DescriptionList.Description
const View = (props) => {
  const {
    params: { id }
  } = props.match

  const role = useSelector(({ user }) => user.role)

  const columns = [
    {
      title: '发电量',
      dataIndex: 'jsonExtra.energyValue',
      width:300
      // key: 'data',
    },
    {
      title: '单位',
      dataIndex: 'jsonExtra.energyUnit',
      width:300
      // key: 'unit',
    },
    {
      title: '时间',
      dataIndex: 'time',
      width:300,
      render:(t, r)=>{
        return r.jsonExtra.year+'-'+r.jsonExtra.month+'-'+r.jsonExtra.date
      }
      // key: 'createTime',
    },
  ];
  const columns2 = [
    {
      title: '发电量',
      dataIndex: 'jsonExtra.energyValue',
      width:300
      // key: 'data',
    },
    {
      title: '单位',
      dataIndex: 'jsonExtra.energyUnit',
      width:300
      // key: 'unit',
    },
    {
      title: '时间',
      dataIndex: 'time',
      width:300,
      render:(t, r)=>{
        return r.jsonExtra.year+'-'+r.jsonExtra.month
      }
      // key: 'createTime',
    },
  ];
  const dataSource=[
    {
      shuju:'222',
      unit:'kwh',
      time:'sj'
    }
  ]

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

  const [detaildata,setdetaildata]= useState('')
  const [tabledata,settabledata]= useState('')

  const requestData=()=>{
    getreducdetail({bizNo:fetchcarbonItem().bizNo}).then((res)=>{
      // console.log(',,,,.',res)
      setdetaildata(res)
    })
  }

  const requesttabledata=()=>{
    gettabledata({uid:fetchcarbonItem().bizNo,current:1,size:20}).then((res)=>{
      // console.log(',,,,.',res)
      settabledata(res.records)
      // setdetaildata(res)
    })
  }

  useEffect(() => {
    requestData()
    requesttabledata()
  },[])

  const [methodfile,setmethodfile]=useState([])

  const requestMethod=()=>{
    getMethodList().then((res)=>{
      // console.log('mettttthod',res.records[0])
      setmethodfile(res.records[0])
    })
  }

  useEffect(() => {
    requestMethod()
  },[])

  const handleDelete = (uids) => {
    Modal.confirm({
      title: '确定驳回？',
      content: '驳回后不可恢复',
      onOk: () => {
        return handleOperation(uids).then((res) => {
          if (res instanceof Error) return
          message.success('操作成功')
          // refresh()
          router.push("/cs/list")
        })
      }
    })
  }

  return (
    <Card >
      <DescriptionList>
        <Descriptions title={"碳汇资产"}>
        <Description label="碳汇名称">{fetchcarbonItem().extra?.sinkName}</Description>
        {/* <Description label="方法学名称及版本">{info?.jsonExtra?.mname}</Description> */}
        </Descriptions>

        <Descriptions title={"减排项目"} >
          <Description.Item label="项目名称">{fetchcarbonItem().extra?.projectName}</Description.Item>
          <Description.Item label="描述">{detaildata?.extra?.desc}</Description.Item>
          <Description.Item label="碳汇类型">{detaildata?.extra?.carbonType}</Description.Item>
          <Description.Item label="建设规模(KWP)">{detaildata?.extra?.buildingScale}</Description.Item>
          <Description.Item label="备案文件号">{detaildata?.extra?.fileNum}</Description.Item>
          <Description.Item label="备案时间">{detaildata?.extra?.fileTime}</Description.Item>
          <Description.Item label="开始（并网）时间">{detaildata?.extra?.startTime}</Description.Item>
          <Description.Item label="投产规模(KWP)" whole>{detaildata?.extra?.scale}</Description.Item>
          <Description.Item label="项目备案证/产权证明文件" whole><DownloadItem list={detaildata?.extra?.attachment||[]} /></Description.Item>
          <Description.Item label="方法学下载" whole>
            {/* <DownloadItem list={methodfile?.extra?.methodFile||[]} /> */}
            <Button onClick={() => {
              localStorage.setItem("methoddetail", JSON.stringify('分布式光伏'))
              // router.push(`/methodMgr/view`,'_blank')
              window.open(`/methodMgr/view`, '_blank')
            }}>查看</Button></Description.Item>
          {/* <Description.Item label="附件"><a href={fetchcarbonItem().extra?.url}>{info?.jsonExtra?.project.attachment[0].name}</a></Description.Item> */}
        </Descriptions>
        <Descriptions title={"监测数据"}>
        <Description label="数据集成" whole>{fetchcarbonItem().extra?.inType}</Description>
        <Description label="碳减排量总量(吨)" whole>{fetchcarbonItem().extra?.sinkSum}</Description>
        {/* <Description whole></Description> */}
        {/* <Description label="方法学名称及版本">{info?.jsonExtra?.mname}</Description> */}
        </Descriptions>
        {(fetchcarbonItem().extra?.inType==='自主申报')&&(<Table columns={columns2} dataSource={tabledata} />)}
        {(fetchcarbonItem().extra?.inType!=='自主申报')&&(<Table columns={columns} dataSource={tabledata} />)}
        {/* <Table columns={columns} dataSource={tabledata} pagination={false}/> */}
        <Descriptions style={{marginTop:'10px'}}>
        <Description label="发电量结算单/辅助证明文件" whole><DownloadItem list={detaildata?.extra?.fuzhufile||[]} />
        </Description></Descriptions>


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
        {/* <Descriptions title="监测数据" bordered >
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
        </Descriptions> */}



        {/* <Descriptions title={'碳核证结论'}>
          <Descriptions.Item label="">
            `经核证， {info?.jsonExtra?.project.projectName} 于 {conclusion.startYear}年 {conclusion.startMonth}月 {conclusion.startDay}日 至 {conclusion.endYear}年 {conclusion.endMonth}月 {conclusion.endDay}日 产生的光伏核证减碳量为{Number(conclusion.total||0).toFixed(2)} 吨二氧化碳。
`
          </Descriptions.Item>
        </Descriptions> */}
      </DescriptionList>

      {(role==='account_admin'||role==='account_super_admin')&&(<Row>
        <Col span={10}></Col>
        <Col span={8}>
          <div>
            {

              (fetchcarbonItem()?.extra?.checkStatus===1|| fetchcarbonItem()?.extra?.checkStatus===2)&&(
                <Button
                  type='primary'
                  onClick={()=>{
                    router.push("/cs/list")
                  }}

                >
                  返回
                </Button>
              )
            }

            {
              (fetchcarbonItem()?.extra?.checkStatus===0)&&(
                <>
                  <Button
                    type='primary'
                    onClick={()=>{
                      handleOperation({
                        bizNo:fetchcarbonItem().bizNo,
                        checkStatus:1
                      }).then(res=>{
                        if(res instanceof  Error ) return;
                        message.success("操作成功")
                        router.push("/cs/list")
                      })
                    }}
                  >
                    通过
                  </Button>
                  {/* <Button style={{ marginLeft: '10px' }} onClick={()=>{
                    handleOperation({
                      bizNo:fetchcarbonItem().bizNo,
                      checkStatus:2
                    }).then(res=>{
                      if(res instanceof  Error ) return;
                      message.success("操作成功")
                      router.push("/cs/list")
                    })
                  }}>
                    驳回
                  </Button> */}
                  <Button style={{ marginLeft: '10px' }} onClick={() => handleDelete({ bizNo:fetchcarbonItem().bizNo,
                      checkStatus:2 })}>
                    驳回
                  </Button>
                </>

              )
            }

          </div></Col>
        <Col span={6}></Col>
      </Row>)}
    </Card>
  )
}

export default View
