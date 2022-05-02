import React,{ useEffect, useState,useRef} from 'react'
import Card from '@/components/Card'
import Cardnopadding from '@/components/Card'
import { Link } from 'react-router-dom'
import styles from './style.less'
import echarts from 'echarts'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Row, Col,Icon } from 'antd'
import { useSelector } from 'react-redux'
import { getCount } from '@/services/carbonAccount/accountView'

const Home = () => {
  const firstRef = useRef(null)
  let firstInstance = null
  const secondRef = useRef(null)
  let secondInstance = null

  const role = useSelector(({ user }) => user.role)
  const codes = useSelector(({ authorities }) => authorities.button.buttons)

  const in_array=(stringToSearch, arrayToSearch)=> {
    for (let s = 0; s < arrayToSearch.length; s++) {
     let thisEntry = arrayToSearch[s].toString();
     if (thisEntry == stringToSearch) {
      return true;
     }
    }
    return false;
}

  // console.log('gshysj',codes)

  const renderFirst = () => {
    const renderedInstance = echarts.getInstanceByDom(firstRef.current)

    if (renderedInstance) {
      firstInstance = renderedInstance
    } else {
      firstInstance = echarts.init(firstRef.current)
    }
    firstInstance.setOption({
      grid: {
        containLabel: true,
        left: 20,
        top: 60,
        right: 10,
        bottom: 0,
      },
      xAxis: {
        type: 'category',
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
          },
        },
        axisLabel: {
          show: true,
          fontSize: 14,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)', // X轴文字颜色
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          alignWithLabel: true,
        },
        splitArea: {
          show: false,
        },
        data: [
          '08-24',
          '08-25',
          '08-26',
          '08-27',
          '08-28',
          '08-29',
        ],
        // data: Graphdata.monthChar,
      },
      yAxis: [
        {
          type: 'value',
          // interval: maxnum(weight1, oilweight1) / 4,
          interval: 200,
          min: 0,
          // max: maxnum(weight1, oilweight1),
          max: 1000,
          splitNumber: 5,
          name: '近7日销售情况',
          position: 'left',
          nameTextStyle: {
            fontSize: 18,
            color: 'rgba(0, 0, 0, 1)',
            fontWeight: '400',
            padding: [0, 0, 12, 0],
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: 'rgba(0, 0, 0, 0.06)',
            },
          },
          axisLabel: {
            show: true,
            margin: 14,
            fontSize: 14,
            textStyle: {
              color: 'rgba(0, 0, 0, 0.65)', // X轴文字颜色
            },
          },
        },
      ],
      series: [
        {
          name: '废油',
          showSymbol: false,
          // data: oilweight1,
          data: [
            610,
            900,
            500,
            500,
            250,
            730,
          ],
          // data: Graphdata.monthValue,
          color: 'rgba(57, 163, 98, 1)',
          type: 'line',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(57, 163, 98, 0.25)' },
              { offset: 1, color: 'rgba(57, 163, 98, 0.03)' },
            ]),
          },
        },
      ],
    })
  }

  const renderSecond = () => {
    const renderedInstance = echarts.getInstanceByDom(secondRef.current)

    if (renderedInstance) {
      secondInstance = renderedInstance
    } else {
      secondInstance = echarts.init(secondRef.current)
    }
    secondInstance.setOption({
      grid: {
        containLabel: true,
        left: 20,
        top: 70,
        right: 10,
        bottom: 0,
      },
      title:{
        text:'上海碳市场行情走势图'
      },
      xAxis: {
        type: 'category',
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
          },
        },
        axisLabel: {
          show: true,
          fontSize: 14,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)', // X轴文字颜色
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          alignWithLabel: true,
        },
        splitArea: {
          show: false,
        },
        data: [
          '2020-07',
          '2020-08',
          '2020-09',
          '2020-10',
          '2020-11',
          '2020-12',
          '2021-01',
          '2021-02',
          '2021-03',
          '2021-04',
          '2021-05',
          '2021-06',  
        ],
        // data: Graphdata.monthChar,
      },
      yAxis: [
        {
          type: 'value',
          // interval: maxnum(weight1, oilweight1) / 4,
          interval: 250,
          min: 0,
          // max: maxnum(weight1, oilweight1),
          max: 1000,
          splitNumber: 4,
          name: '成交价(元)',
          position: 'left',
          nameTextStyle: {
            fontSize: 14,
            color: 'rgba(0, 0, 0, 0.65)',
            fontWeight: '400',
            padding: [0, 0, 0, 0],
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: 'rgba(0, 0, 0, 0.06)',
            },
          },
          axisLabel: {
            show: true,
            margin: 14,
            fontSize: 14,
            textStyle: {
              color: 'rgba(0, 0, 0, 0.65)', // X轴文字颜色
            },
          },
        },
      ],
      series: [
        {
          name: '废油',
          showSymbol: false,
          // data: oilweight1,
          data: [
            500,
            540,
            180,
            270,
            800,
            90,
            750,
            550,
            760,
            300,
            320,
            520,
          ],
          // data: Graphdata.monthValue,
          color: 'rgba(90, 216, 166, 1)',
          type: 'line',
        },
      ],
    })
  }

  useEffect(() => {
    if (firstRef.current) {
      renderFirst()
    }
  }, [renderFirst])

  useEffect(() => {
    if (secondRef.current) {
      renderSecond()
    }
  }, [renderSecond])

  const [count, setcount] = useState([])

  const requestCount = () => {
    getCount({year:'2021'}).then((res) => {
      setcount(res)
    })
  }

  useEffect(() => {
    requestCount()
  }, [])

  const header=()=>{
    return(
      <Card className={styles.header}>
        <img src="头像.png" alt="" />
        <span className={styles.welcome}>欢迎登录包装盒型管理系统！</span>
        <span className={styles.welcome2}>很高兴见到你:）</span>
        <div className={styles.line}></div>
      </Card>
    )
  }

  const middlepart=()=>{

    const data=[
      {name:'账户概览',srcpic:'1.png',path:'/overview',auth:'entry_overview',view:0},
      {name:'核证管理',srcpic:'2.png',path:'/cert/list',auth:'entry_cert',view:0},
      {name:'减排管理',srcpic:'3.png',path:'/reduction',auth:'entry_reduction',view:0},
      {name:'碳汇管理',srcpic:'4.png',path:'/cs/list',auth:'entry_cs',view:0},
      {name:'诊断报告',srcpic:'5.png',path:'/dataManagement/dataReport',auth:'entry_datareport',view:0},
      {name:'设备管理',srcpic:'6.png',path:'/device',auth:'entry_device',view:0}
    ]

    data.map((el,index)=>{
      if(in_array(el.auth,codes)) el.view=1
    })

    console.log('pppp',data)

    const rightdata=[
      {name:'碳排放量(吨)',num:count?.carbonOutCount},
      {name:'碳减排量(吨)',num:count?.carbonReduceCount},
      {name:'购入减排证明(个)',num:count?.buyProveCount},
      {name:'绿币证明(个)',num:count?.greenCornProveCount},
      {name:'碳中和证明(个)',num:count?.neutralProveCount},
      {name:'减排证明(个)',num:count?.reduceProveCount},
    ]

    return(
      <div>
        <Row>
          <Col span={16}>
            <div>
              <span className={styles.subtitle}>快速入口</span>
              <Card style={{height:240,marginTop:8,marginBottom:8}}>
                <Row gutter={1}>
                {data.map((el, index)=>{
                  // if(index!==2&&index!==5&&el.view===1){
                  //   return(
                  //     <Col span={8}>
                  //       <Link to={el.path}>
                  //       <div className={styles.box} style={{borderRight: '1px solid rgb(219, 219, 219)'}}>
                  //       <span>{el.name}</span>
                  //       <img src={el.srcpic} alt="" />
                  //       </div>
                  //       </Link>
                  //     </Col>
                  //   )
                  // }
                  // else if(el.view===1){
                  // return(
                  //   <Col span={8}>
                  //     <Link to={el.path}>
                  //     <div className={styles.box}>
                  //     <span>{el.name}</span>
                  //     <img src={el.srcpic} alt="" />
                  //     </div>
                  //     </Link>
                  //   </Col>
                  // )}
                  if(el.view===1){
                    return(
                      <Col span={8}>
                        <Link to={el.path}>
                        <div className={styles.box} style={{borderRight: '1px solid rgb(219, 219, 219)'}}>
                        <span>{el.name}</span>
                        <img src={el.srcpic} alt="" />
                        </div>
                        </Link>
                      </Col>
                    )
                  }
                })}
                </Row>
              </Card>
              {/* <span className={styles.subtitle}>售出订单</span>
              <Card style={{height:300,marginTop:8,marginBottom:8}}>
                <Row>
                  <Col span={8}>
                    <div className={styles.middlepart2leftbox}>
                      <Link className={styles.llbox}>
                        <span className={styles.mpl2name}>待付款</span>
                        <span className={styles.mpl2num}>0</span>
                      </Link>
                      <Link className={styles.llbox}>
                        <span className={styles.mpl2name}>待确认</span>
                        <span className={styles.mpl2num}>0</span>
                      </Link>
                      <Link className={styles.llbox2}>
                        <span className={styles.mpl2name}>近7日售出订单</span>
                        <span className={styles.mpl2num}>0</span>
                      </Link>
                    </div>
                  </Col>
                  <Col span={16}>
                  <div id='chart1' ref={firstRef} style={{width: '100%', height: '260px'}}></div>
                  </Col>
                </Row>
              </Card> */}
              {/* <span className={styles.subtitle}>购入订单</span>
              <Card style={{height:100,marginTop:8,marginBottom:8}}>
                <Row >
                  <Col span={12}>
                    <Link className={styles.modules} to={{ pathname: `` }} style={{borderRight: '1px solid rgb(219, 219, 219)'}}>
                      <span className={styles.stitle}>待付款</span>
                      <span className={styles.snum}>0</span>
                    </Link>
                  </Col>
                  <Col span={12}>
                    <Link className={styles.modules} to={{ pathname: `` }}>
                      <span className={styles.stitle} style={{left:15}}>待确认</span>
                      <span className={styles.snum}>0</span>
                    </Link>
                  </Col>
                </Row>
              </Card> */}
            
            </div>
          </Col>
          <Col span={8}>
            <div>
              <span className={styles.subtitle2}>碳资产</span>
              <Card style={{height:714,marginLeft:0,marginTop:8,marginBottom:8}}>
                <div className={styles.middlerightpart1}>
                  <Row>
                    {rightdata.map((el)=>{
                      return(
                        <Col span={8}>
                          <div style={{height:'80px',position:'relative'}}>
                          <span className={styles.middlerightpart2title}>{el.name}</span>
                          <span className={styles.middlerightpart2num}>{el.num}</span>
                          </div>
                        </Col>
                      )
                    })}
                 </Row>
                </div>
                <div className={styles.middlerightpart2}>
                  <div><Icon type="exclamation-circle" /> <span className={styles.middlerightsubtitle}>关于绿色证明</span></div>
                  <div className={styles.middlerightsubsubtitle}>绿色认证</div>
                  <div className={styles.middlerightsubcontent}>通过对企业的能源消耗、碳排放量、减排量等数据进行测算分析，给出绿色企业的资质认证。资质认证分别有:绿币证明，用于绿币市场的交易;减排量证明，用于企业间转让减排量的交易;碳中和证明，用于证明企业达成碳中和。</div>
                  <div className={styles.middlerightsubsubtitle}>绿币证明</div>
                  <div className={styles.middlerightsubcontent}>绿币证明是企业用于兑换绿币的减排证明，企业将清洁能源或减排项目产生的减排量划出一部分兑换成绿币证明，一个绿币证明代表-定量的减排量，再将绿币证明直接兑换成绿币;兑换成绿币的证明仍反馈回企业账户内，但不能再次兑换绿币。</div>
                  <div className={styles.middlerightsubsubtitle}>减排量证明</div>
                  <div className={styles.middlerightsubcontent}>减排量证明是用于企业与企业之间流通的减排量转让证明，企业可以将多余的减排量兑换成减排量证明，在平台内出售给其他企业，获得经济收益，也可以购买其他企业的减排量证明来增加自身的减排量;一个减排量证明只能出售一次。</div>
                  <div className={styles.middlerightsubsubtitle}>碳中和证明</div>
                  <div className={styles.middlerightsubcontent}>碳中和证明是，用于企业达成碳中和的证明，当一个企业的碳排放量和减排量加购入的减排量证明相等时，则可以申请碳中和证明。</div>
                </div>
              </Card>
            </div>
          </Col>
      </Row>
      </div>
    )
  }

  const footer=()=>{
    return(
      <div>
        <span className={styles.subtitle}>碳行情走势</span>
        <Card style={{height:400,marginTop:8}}>
        <div id='chart2' ref={secondRef} style={{width: '100%', height: '360px'}}></div>
        </Card>
      </div>
    )
  }

  const adminpage=()=>{
    const data=[
      // {name:'账户概览',srcpic:'1.png',path:'/overview'},
      // {name:'核证管理',srcpic:'2.png',path:'/cert/list'},
      {name:'减排管理',srcpic:'3.png',path:'/reduction',auth:'entry_reduction',view:0},
      // {name:'碳汇管理',srcpic:'4.png',path:'/cs/list'},
      // {name:'诊断报告',srcpic:'5.png',path:'/dataManagement/dataReport'},
      // {name:'设备管理',srcpic:'6.png',path:'/device'},
      // {name:'数据驾驶舱',srcpic:'4.png',path:'/dashboard'},
      {name:'数据管理',srcpic:'6.png',path:'/dataManagement/allList',auth:'entry_data',view:0},
      {name:'诊断报告',srcpic:'5.png',path:'/dataManagement/dataReport',auth:'entry_datareport',view:0},
    ]

    data.map((el,index)=>{
      if(in_array(el.auth,codes)) el.view=1
    })

    console.log('ouishah',data)

    return(
      <div>
          <span className={styles.subtitle}>快速入口</span>
          <Card style={{height:160,marginTop:8,marginBottom:8}}>
        <Row gutter={1}>
        {data.map((el, index)=>{
          if(index!==2&&index!==5&&el.view===1){
            return(
              <Col span={8}>
                <Link to={el.path}>
                <div className={styles.box} style={{borderRight: '1px solid rgb(219, 219, 219)'}}>
                <span>{el.name}</span>
                <img src={el.srcpic} alt="" />
                </div>
                </Link>
              </Col>
            )
          }
          else if(el.view===1){
          return(
            <Col span={8}>
              <Link to={el.path}>
              <div className={styles.box}>
              <span>{el.name}</span>
              <img src={el.srcpic} alt="" />
              </div>
              </Link>
            </Col>
          )}
        })}
        </Row>
      </Card>
      </div>
      )
  }

  return (
    <Card transparent>
       {(role==='account_org')&&(
         <div>
          {header()}
          {middlepart()}
          {/* {footer()} */}
        </div>
        )}
       {(role==='account_admin'||role==='account_super_admin'||role==='SHOW')&&(
         <div>
           {header()}
         {/* {adminpage()} */}
         </div>
       )}
    </Card>
  )
}

export default Home
