import React, { useState, useEffect, useMemo,useRef } from 'react'
import { Form, Row, Col, Button, Input, InputNumber, Radio, Select, message,Menu } from 'antd'
import router from 'umi/router'
import echarts from 'echarts'
import Card from '@/components/Card'
import { getDataDetail, submitData } from '@/services/carbon/dataManage'
import ButtonGroup from '@/components/ButtonGroup'
import { getreportlistdata,getpart1,getpart2,getpart3,getpart4} from '@/services/carbon/common'
import PagingTable from '@/components/PagingTable'
import { useTable, useRequest } from '@dragon/hooks'
import styles from './style.less'

const View = (props) => {
  const {
    match: {
      params: { companyName, year,industry}
    },
    form: { getFieldDecorator, resetFields, validateFieldsAndScroll }
  } = props

  //part1
  const [part1data, setpart1data] = useState([]);
  //part2
  const [energyType, setenergyType] = useState('碳排');
  const [energyType2, setenergyType2] = useState('碳排');
  const [part1Graphdata, setpart1Graphdata] = useState([]);
  const [danwei, setdanwei] = useState('单位:吨');
  const [current, setcurrent] = useState(1);
  //part3
  const [part3data, setpart3data] = useState([]);
  const [piedata, setpiedata] = useState([]);
  const [piedata2, setpiedata2] = useState([]);
  const [menunum, setmenu] = useState(2);
  const [columns2,setcolumn]=useState([
    {
      title: '排名',
      width: 100,
      render: (t, r, index) => {
            // console.log('yyyytt',index,current)
            return (index + 1)+(current-1)*10;
          },
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      width: 800,
    },
    {
      title: '碳排放量(吨)',
      dataIndex: 'total',
      width: 100,
    },
  ])

  const { searchBy, submit, exportExcel, excelLoading, tableProps } = useTable(
    getreportlistdata,
    {
      defaultFilters: {energyType: energyType2,industry:industry,year:year},
      form: props.form
    }
  )

  useEffect(()=>{
    setcurrent(tableProps.setting.current)
    // setcolumn([
    //   {
    //     title: '排名',
    //     width: 100,
    //     render: (t, r, index) => {
    //           // console.log('yyyytt',index,current)
    //           return (index + 1)+(tableProps.setting.current-1)*10;
    //         },
    //   },
    //   {
    //     title: '企业名称',
    //     dataIndex: 'companyName',
    //     width: 800,
    //   },
    //   {
    //     title: '碳排放量(吨)',
    //     dataIndex: 'total',
    //     width: 100,
    //   },
    // ])
  },[tableProps.setting.current])

  // console.log('ooooo',current)

  useEffect(()=>{
    searchBy({energyType: energyType2,year:year})
  },[energyType2])

  const requestPart1Data = () => {
    getpart1({ companyName: companyName,year:year }).then((res) => {
      setpart1data(res);
    });
  };

  const requestPart3Data = () => {
    getpart3({ companyName: companyName,year:year,industry:industry }).then((res) => {
      setpart3data(res);
    });
  };

  const requestpieData = () => {
    getpart4({ companyName: companyName,year:year }).then((res) => {
      setpiedata(res);
      // console.log('jhjhj',res)
    });
    getpart4({ industry: industry,year:year }).then((res) => {
      setpiedata2(res);
      // console.log('jhjhj',res)
    });
  };

  const requestpart2GraphData = () => {
    getpart2({ energyType: energyType, companyName:companyName,year:year }).then((res) => {
        setpart1Graphdata(res);
      });
  };

  useEffect(() => {
    requestPart1Data();
    requestPart3Data();
  }, []);

  useEffect(() => {
    requestpart2GraphData();
  }, [energyType]);

  useEffect(() => {
    requestpieData();
  }, []);

  const [menu1, setmenu1] = useState(0)

  const firstRef = useRef(null)
  let firstInstance = null
  const pieRef = useRef(null)
  let pieInstance = null
  const pieRef2 = useRef(null)
  let pieInstance2 = null

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
        // data: [
        //   '01月',
        //   '02月',
        //   '03月',
        //   '04月',
        //   '05月',
        //   '06月',
        //   '07月',
        //   '08月',
        //   '09月',
        //   '10月',
        //   '11月',
        //   '12月',
        // ],
        data: part1Graphdata.monthChar,
      },
      yAxis: [
        {
          type: 'value',
          // interval: maxnum(weight1, oilweight1) / 4,
          // interval: 2500,
          // min: 0,
          // max: maxnum(weight1, oilweight1),
          // max: 10000,
          splitNumber: 4,
          name: danwei,
          position: 'left',
          nameTextStyle: {
            fontSize: 14,
            color: 'rgba(0, 0, 0, 0.65)',
            fontWeight: '400',
            padding: [0, 0, 12, 50],
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
          // showSymbol: false,
          // data: oilweight1,
          // data: [
          //   1200,
          //   1600,
          //   1800,
          //   2200,
          //   2600,
          //   2800,
          //   3900,
          //   5000,
          //   6000,
          //   7100,
          //   8700,
          //   9600,
          // ],
          data: part1Graphdata.monthValue,
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

  const seriesData = [
    { value: piedata.coalData, name: '煤', percent: piedata.coalPercent },
    { value: piedata.oilData, name: '油', percent: piedata.oliPercent },
    { value: piedata.waterData, name: '水', percent: piedata.waterPercent },
    { value: piedata.electricData, name: '电', percent: piedata.electricPercent },
    { value: piedata.gasData, name: '气', percent: piedata.gasPercent },
    { value: piedata.otherData, name: '其他', percent: piedata.otherPercent },
  ];

  const seriesData2 = [
    { value: piedata2.coalData, name: '煤', percent: piedata2.coalPercent },
    { value: piedata2.oilData, name: '油', percent: piedata2.oliPercent },
    { value: piedata2.waterData, name: '水', percent: piedata2.waterPercent },
    { value: piedata2.electricData, name: '电', percent: piedata2.electricPercent },
    { value: piedata2.gasData, name: '气', percent: piedata2.gasPercent },
    { value: piedata2.otherData, name: '其他', percent: piedata2.otherPercent },
  ];

  const renderPie = () => {
    const renderedInstance = echarts.getInstanceByDom(pieRef.current);

    if (renderedInstance) {
      pieInstance = renderedInstance;
    } else {
      pieInstance = echarts.init(pieRef.current);
    }
    pieInstance.setOption({
      color: [
        'rgba(57, 163, 98, 1)',
        'rgba(90, 216, 166, 1)',
        'rgba(109, 200, 236, 1)',
        'rgba(252, 192, 72, 1)',
        'rgba(255, 157, 77, 1)',
        'rgba(191, 191, 191, 1)',
      ],
      grid: {
        left: 'left',
      },
      title: {
        text: '总碳排放量(吨)',
        left: '26%',
        top: '38%',
        textAlign: 'center',
        // subtext: '241,234,00',
        subtext: piedata.sum,
        // subtext: datatotal() || '0',
        subtextStyle: {
          fontSize: 14,
          color: 'rgba(0,0,0,1)',
          verticalAlign: 'middle',
          align: 'center',
          fontWeight: 'bold',
        },
        textStyle: {
          fontSize: 14,
          color: 'rgba(0,0,0,0.65)',
        },
      },
      // tooltip: {
      //   trigger: 'item',
      // },
      legend: {
        orient: 'vertical',
        top: '15%',
        left: '55%',
        itemGap: 24,
        itemWidth: 10,
        itemHeight: 10,
        icon: 'circle',
        formatter: function (name) {
          const item = seriesData.filter((item) => item.name === name)[0];
          return `${name}    ${item.percent}     ${item.value}吨`;
        },
        textStyle: {
          color: '#000',
          fontSize: 12,
        },
        data: ['煤', '油', '水', '电', '气', '其他'],
      },
      series: [
        {
          // name: '城市',
          type: 'pie',
          center: ['26%', '46%'],
          radius: ['50%', '80%'],
          // avoidLabelOverlap: false,
          itemStyle: {
            // borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 1,
          },
          label: {
            show: false,
            text: '总数量',
            // position: 'center'
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: '40',
          //     fontWeight: 'bold'
          //   }
          // },
          labelLine: {
            show: false,
          },
          data: [
            { value: piedata.coalData, name: '煤' },
            { value: piedata.oilData, name: '油' },
            { value: piedata.waterData, name: '水' },
            { value: piedata.electricData, name: '电' },
            { value: piedata.gasData, name: '气' },
            { value: piedata.otherData, name: '其他' },
          ],
        },
      ],
    });
  };

  const renderPie2 = () => {
    const renderedInstance = echarts.getInstanceByDom(pieRef2.current);

    if (renderedInstance) {
      pieInstance2 = renderedInstance;
    } else {
      pieInstance2 = echarts.init(pieRef2.current);
    }
    pieInstance2.setOption({
      color: [
        'rgba(57, 163, 98, 1)',
        'rgba(90, 216, 166, 1)',
        'rgba(109, 200, 236, 1)',
        'rgba(252, 192, 72, 1)',
        'rgba(255, 157, 77, 1)',
        'rgba(191, 191, 191, 1)',
      ],
      grid: {
        left: 'left',
      },
      title: {
        text: '总碳排放量(吨)',
        left: '26%',
        top: '38%',
        textAlign: 'center',
        // subtext: '241,234,00',
        subtext: piedata2.sum,
        // subtext: datatotal() || '0',
        subtextStyle: {
          fontSize: 14,
          color: 'rgba(0,0,0,1)',
          verticalAlign: 'middle',
          align: 'center',
          fontWeight: 'bold',
        },
        textStyle: {
          fontSize: 14,
          color: 'rgba(0,0,0,0.65)',
        },
      },
      // tooltip: {
      //   trigger: 'item',
      // },
      legend: {
        orient: 'vertical',
        top: '15%',
        left: '55%',
        itemGap: 24,
        itemWidth: 10,
        itemHeight: 10,
        icon: 'circle',
        formatter: function (name) {
          const item = seriesData2.filter((item) => item.name === name)[0];
          return `${name}    ${item.percent}     ${item.value}吨`;
        },
        textStyle: {
          color: '#000',
          fontSize: 12,
        },
        data: ['煤', '油', '水', '电', '气', '其他'],
      },
      series: [
        {
          // name: '城市',
          type: 'pie',
          center: ['26%', '46%'],
          radius: ['50%', '80%'],
          // avoidLabelOverlap: false,
          itemStyle: {
            // borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 1,
          },
          label: {
            show: false,
            text: '总数量',
            // position: 'center'
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: '40',
          //     fontWeight: 'bold'
          //   }
          // },
          labelLine: {
            show: false,
          },
          data: [
            { value: piedata2.coalData, name: '煤' },
            { value: piedata2.oilData, name: '油' },
            { value: piedata2.waterData, name: '水' },
            { value: piedata2.electricData, name: '电' },
            { value: piedata2.gasData, name: '气' },
            { value: piedata2.otherData, name: '其他' },
          ],
        },
      ],
    });
  };

  useEffect(() => {
    if (firstRef.current) {
      renderFirst()
    }
  }, [renderFirst])

  useEffect(() => {
    if (pieRef.current) {
      renderPie()
    }
  }, [renderPie])

  useEffect(() => {
    if (pieRef2.current) {
      renderPie2()
    }
  }, [renderPie2])

  const part1=()=>{
    const data = [
      { name: '碳排放量(吨)', num: part1data.carbonOutCount },
      { name: '碳减排量(吨)', num: part1data.carbonReduceCount },
      { name: '购入减排证明(个)', num: part1data.buyProveCount },
      { name: '碳中和证明(个)', num: part1data.neutralProveCount },
      { name: '绿币证明(个)', num: part1data.greenCornProveCount },
      { name: '减排证明(个)', num: part1data.reduceProveCount },
    ];
    return(
      // <div className={styles.part1container}>
      <Row>
        {data.map((el, index) => {
        return (
          <Col span={8}>
          <div className={styles.part1box}>
            <div className={styles.part1name}>{el.name}</div>
            <div className={styles.part1num}>{el.num}</div>
          </div>
          </Col>
        );
      })}
      </Row>
      // </div>
    )
  }

  const part2=()=>{
    const showfirstRef = () => {
      setenergyType('碳排')
      setdanwei('单位:吨')
    }
    const showfirstrRef = () => {
      setdanwei('单位:吨')
      setenergyType('碳减排')
    }
    const showthirdRef = () => {
      setdanwei('单位:吨/万元')
      setenergyType('碳强度')
    }

    return(
      <div>
         <div className={styles.part2container}>
        <div className={styles.part2box}>
          <div className={styles.pic1}></div>
          <div className={styles.part2name}>碳排放量(吨)</div>
          <div className={styles.part2num}>{part1data.carbonOutCount}</div>
        </div>
        <div className={styles.part2box}>
          <div className={styles.pic2}></div>
          <div className={styles.part2name}>碳减排量(吨)</div>
          <div className={styles.part2num}>{part1data.carbonReduceCount}</div>
        </div>
        <div className={styles.part2box}>
          <div className={styles.pic3}></div>
          <div className={styles.part2name}>碳强度(吨/万元)</div>
          <div className={styles.part2num}>{part1data.carbonGrade}</div>
        </div>
      </div>
      <Menu mode="horizontal" defaultSelectedKeys="one" className={styles.ant}>
          <Menu.Item key="one" onClick={showfirstRef}>
            碳排放量
          </Menu.Item>
          <Menu.Item key="two" onClick={showfirstrRef}>
            碳减排量
          </Menu.Item>
          <Menu.Item key="three" onClick={showthirdRef}>
            碳强度
          </Menu.Item>
        </Menu>
        <div id='chart1' ref={firstRef} style={{width: '100%', height: '300px'}}></div>
      </div>
    )
  }

  const part3=()=>{

    const data1 = [
      {
        name: '碳排放量行业排名',
        num: part3data.outRank?.sumTotal,
        num2: part3data.outRank?.percent,
      },
      {
        name: '碳减排量行业排名',
        num: part3data.reduceRank?.sumTotal,
        num2: part3data.reduceRank?.percent,
      },
      { name: '碳强度',
        num: part3data.gradeRank?.sumTotal,
        num2: part3data.gradeRank?.percent,
      },
    ];

    // console.log('eeeeee',current)

    const showfirsttable=()=>{
      setmenu(0)
      setenergyType2('碳排')
      setcolumn([
        {
          title: '排名',
          width: 100,
          render: (t, r, index) => {
            // console.log('yyyytt111',index,tableProps)
                return (index + 1)+(current-1)*10;
              },
        },
        {
          title: '企业名称',
          dataIndex: 'companyName',
          width: 500,
        },
        {
          title: '碳排放量(吨)',
          dataIndex: 'total',
          width: 100,
        },
      ])
    }

    const showsecondtable=()=>{
      setmenu(1)
      setenergyType2('碳减排')
      setcolumn([
        {
          title: '排名',
          width: 100,
          render: (t, r, index) => {
            // console.log('yyyytt222',index,tableProps)
                return (index + 1)+(current-1)*10;
              },
        },
        {
          title: '企业名称',
          dataIndex: 'companyName',
          width: 800,
        },
        {
          title: '碳减排量(吨)',
          dataIndex: 'total',
          width: 100,
        },
      ])
    }

    const showthirdtable=()=>{
      setmenu(2)
      setenergyType2('碳强度')
      setcolumn([
        {
          title: '排名',
          width: 100,
          render: (t, r, index) => {
                return (index + 1)+(current-1)*10;
              },
        },
        {
          title: '企业名称',
          dataIndex: 'companyName',
          width: 800,
        },
        {
          title: '碳强度(吨/万元)',
          dataIndex: 'orgIncome',
          width: 100,
        },
      ])
    }

    return(
      <div>
        <div className={styles.part3container}>
        {data1.map((el, index) => {
        return (
          <div className={styles.part3box}>
            <div className={styles.part3name}>{el.name}</div>
            <div className={styles.part3num}>
              {el.num} <span className={styles.baifenbi}>{el.num2}</span>
            </div>
          </div>
        );
      })}</div>
      <Menu mode="horizontal" defaultSelectedKeys="one" className={styles.ant}>
          <Menu.Item key="one" onClick={showfirsttable}>
            碳排放量
          </Menu.Item>
          <Menu.Item key="two" onClick={showsecondtable}>
            碳减排量
          </Menu.Item>
          <Menu.Item key="three" onClick={showthirdtable}>
            碳强度
          </Menu.Item>
        </Menu>
        {/* {(menunum===0)&&(<PagingTable rowKey={(i) => i.id}  columns={columns} {...tableProps} />)} */}
        <PagingTable rowKey={(i) => i.id}  columns={columns2} {...tableProps} />
        {/* {(menunum===1)&&(<PagingTable rowKey={(i) => i.id}  columns={columns2} {...tableProps2} />)} */}
        {/* {(menunum===2)&&(<PagingTable rowKey={(i) => i.id}  columns={columns3} {...tableProps3} />)} */}
      </div>
    )
  }

  const part4=()=>{
    return(
    <div>
       <div id='chartpie' ref={pieRef} style={{width: '90%', height: '300px'}}></div>
    </div>)
  }

  const part5=()=>{
    return(
      <div>
        <div id='chartpie2' ref={pieRef2} style={{width: '90%', height: '300px'}}></div>
      </div>
    )
  }

 return (
   <Card transparent >
     <Card style={{marginBottom:'16px'}} className={styles.companyname}> <div className={styles.pic4}></div>{companyName}</Card>
     <Card title="账户概览" style={{marginBottom:'16px'}}>{part1()}</Card>
     <Card title="碳诊断报告" >{part2()}</Card>
     <Card title="本行业碳排分析">{part3()}</Card>
     <Row>
       <Col span={12}><Card title="碳排来源分布" style={{marginBottom:'16px',marginRight:0}}>{part4()}</Card></Col>
       <Col span={12}><Card title="本行业碳排来源分布" style={{marginBottom:'16px',marginLeft:0}}>{part5()}</Card></Col>
     </Row>
   </Card>
 )
}

export default Form.create()(View)
