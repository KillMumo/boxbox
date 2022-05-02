import React, { useState, useEffect } from 'react'
import Link from 'umi/link'
import { Tag, Card, Descriptions, Modal } from 'antd'
import CardTitle from '../Components/CardTitle'
import ReportTable from '../Components/ReportTable'
import TitleLink from '../Components/TitleLink'
import IconFont from '@/components/IconFont'
import Statement from '../Components/Statement'
import SliderChart from '../Components/SliderChart'
import { scrollToAnchor } from '@/utils'
import { useRequest } from '@dragon/hooks'
import { fetchReportList, fetchReportDetail, fetchIndustry } from '@/services/microSubsidy/report'
// import G6 from '@antv/g6'
import EmptyReport from '../Components/EmptyReport'
import { formatDate } from '@/utils'
import styles from '../styles.less'

const DescriptionsItem = Descriptions.Item
const afbg = require('../../../../assets/af.png')

const AFReport = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  const [activeTab, setActiveTab] = useState('businessinfo')
  const [modalData, setModalData] = useState({})
  const [sx_OpenModal, setSxOpenModal] = useState(false)
  const [sshy_OpenModal, setSshyOpenModal] = useState(false)

  // 判断是否为Pc端
  const [isPc, setIsPc] = useState(false)

  useEffect(() => {
    isPC()
  }, [])

  const isPC = () => {
    //是否为PC端
    let userAgentInfo = navigator.userAgent
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    setIsPc(flag)
  }
  const { data: info = {} } = useRequest(() =>
    fetchReportList({ bizNo: id, reportType: 'FRAUD_REPORT' })
  )

  const { data: industryData = [] } = useRequest(() => fetchIndustry())
  const isEmpty = (val) => {
    return val ? val : '-'
  }

  if (!info) {
    return (
      <div className={styles.reportWrap}>
        <EmptyReport />
      </div>
    )
  }

  // 返回百度地图跳转地址
  const baiduAddress = (str) => {
    let city = ''
    // let aFlag = '省'
    let bFlag = '区'
    let aPos = str.indexOf('省')
    let bPos = str.indexOf('自治区')
    let cPos = str.indexOf('市')
    let dPos = str.indexOf('县')

    if (aPos > -1) {
      if (cPos > -1) {
        //查找市
        city = str.substr(aPos + 1, cPos - aPos)
      } else if (dPos > -1) {
        //查找县
        city = str.substr(aPos + 1, dPos - aPos)
      }
    } else if (bPos > -1) {
      let flagPos = str.indexOf(bFlag)
      if (cPos > -1) {
        //查找市
        city = str.substr(flagPos + 1, cPos - flagPos)
      } else if (dPos > -1) {
        //查找县
        city = str.substr(bPos + 1, dPos - flagPos)
      }
    } else {
      city = str.substr(0, cPos)
    }
    return `http://api.map.baidu.com/place/search?query=${str}&region=${city}&output=html&src=induschain.cn`
  }

  // 判断是否为自身企业
  // const isSelf = (origin, current) => {
  //   let arr = []
  //   if (current && current.indexOf(',') !== -1) {
  //     arr = current.split(',')
  //     return arr.map((item) => {
  //       return origin === item ? <div>{current}</div> : <TitleLink val={item} type="company" />
  //     })
  //   } else if (origin === current || current === '投资方未知') {
  //     return <div>{current}</div>
  //   } else {
  //     return <TitleLink val={current} type="company" />
  //   }
  // }

  const {
    basicInfo = {},
    czxx = [],
    ktgg = [],
    cpws = [],
    fygg = [],
    sx = [],
    gqdj = [],
    // gqct = {},
    bgjl = [],
    zyry = [],
    nsxy = [],
    jyyc = [],
    sfpm = [],
    hbcf = [],
    tddy = [],
    dcdy = [],
    yzwf = [],
    qsgg = [],
    qsxx = [],
    jyzx = [],
    ggcs = [],
    sswf = [],
    gqcz = [],
    xzcf = [],
    bzx = []
  } = info

  // 工商信息map
  const businessinfo = [
    {
      name: '投资人',
      amount: info.czxx?.length || 0,
      id: 'gsxx_czxx'
    },
    {
      name: '变更记录',
      amount: info.bgjl?.length || 0,
      id: 'gsxx_bgjl'
    },
    {
      name: '主要人员',
      amount: info.zyry?.length || 0,
      id: 'gsxx_zyry'
    },
    {
      name: '纳税信用等级',
      amount: info.nsxy?.length || 0,
      id: 'gsxx_nsxydj'
    }
  ]

  // 法律诉讼map
  const legalmap = [
    {
      name: '开庭公告',
      amount: info.ktgg?.length || 0,
      id: 'flss_ktgg'
    },
    {
      name: '裁判文书',
      amount: info.cpws?.length || 0,
      id: 'flss_cpws'
    },
    {
      name: '法院公告',
      amount: info.fygg?.length || 0,
      id: 'flss_fygg'
    },
    {
      name: '失信被执行人',
      amount: info.sx?.length || 0,
      id: 'flss_sx'
    },
    {
      name: '股权冻结',
      amount: info.gqdj?.length || 0,
      id: 'flss_gqdj'
    },
    {
      name: '被执行人',
      amount: info.bzx?.length || 0,
      id: 'flss_bzx'
    }
  ]

  // 经营风险map
  const riskmap = [
    {
      name: '经营异常',
      amount: info.jyyc?.length || 0,
      id: 'jyfx_jyyc'
    },
    {
      name: '司法拍卖',
      amount: info.sfpm?.length || 0,
      id: 'jyfx_sfpm'
    },
    {
      name: '土地抵押',
      amount: info.tddy?.length || 0,
      id: 'jyfx_tdzy'
    },
    {
      name: '环保处罚',
      amount: info.hbcf?.length || 0,
      id: 'jyfx_hbcf'
    },
    {
      name: '动产抵押',
      amount: info.dcdy?.length || 0,
      id: 'jyfx_dcdy'
    },
    {
      name: '严重违法',
      amount: info.yzwf?.length || 0,
      id: 'jyfx_yzwf'
    },
    {
      name: '欠税公告',
      amount: info.qsgg?.length || 0,
      id: 'jyfx_qsgg'
    },
    {
      name: '清算信息',
      amount: info.qsxx?.length || 0,
      id: 'jyfx_qsxx'
    },
    {
      name: '简易注销',
      amount: info.jyzx?.length || 0,
      id: 'jyfx_jyzx'
    },
    {
      name: '公示催告',
      amount: info.ggcs?.length || 0,
      id: 'jyfx_gscg'
    },
    {
      name: '税收违法',
      amount: info.sswf?.length || 0,
      id: 'jyfx_sswf'
    },
    {
      name: '股权出质',
      amount: info.gqcz?.length || 0,
      id: 'jyfx_gqcz'
    },
    {
      name: '行政处罚',
      amount: info.xzcf?.length || 0,
      id: 'jyfx_xzcf'
    }
  ]
  /* 工商信息 */
  // 投资人信息
  const investorColumns = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '股东',
      dataIndex: 'StockName',
      key: 'StockName',
      width: 160,
      render: (text) => <TitleLink val={text} type="company" />
    },
    {
      title: '股东类型',
      dataIndex: 'StockType',
      key: 'StockType',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '认缴出资金额(万元人民币)',
      dataIndex: 'ShouldCapi',
      key: 'ShouldCapi',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '出资比例',
      dataIndex: 'StockPercent',
      key: 'StockPercent',
      width: 160,
      render: (text) => text || '-'
    }
  ]

  // 变更记录-v1.2.2字段变更
  const updateColumns = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '变更项目',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '变更日期',
      dataIndex: 'ChangeDate',
      key: 'ChangeDate',
      width: 120,
      render: (text, record, index) => formatDate(text) || '-'
    },
    {
      title: '变更前',
      // dataIndex: 'BeforeContent',
      // key: 'BeforeContent',
      width: 300,
      render: (text, record) => {
        return record.BeforeList
          ? record.BeforeList?.map((item, index) => {
              return <div>{item}</div>
            })
          : '-'
      }
      // render: (text) => text || '-'
    },
    {
      title: '变更后',
      // dataIndex: 'AfterContent',
      // key: 'AfterContent',
      width: 300,
      render: (text, record) => {
        return record.AfterList
          ? record.AfterList?.map((item, index) => {
              return <div>{item}</div>
            })
          : '-'
      }
    }
  ]

  // 主要人员-全部为人名
  const mainStaffColumns = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '姓名',
      dataIndex: 'Name',
      key: 'Name',
      width: 160,
      render: (text, record) => {
        return text ? <TitleLink val={text} type="human" /> : '-'
      }
    },
    {
      title: '职务',
      dataIndex: 'Job',
      key: 'Job',
      width: 300,
      render: (text) => text || '-'
    }
  ]

  // 纳税信用等级
  const levelColumns = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '纳税人识别号',
      dataIndex: 'No',
      key: 'No',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '纳税人名称',
      dataIndex: 'Name',
      key: 'Name',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '评价年度',
      dataIndex: 'Year',
      key: 'Year',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '信用等级',
      dataIndex: 'Level',
      key: 'Level',
      width: 160,
      render: (text) => text || '-'
    }
  ]

  /* 法律诉讼 */
  // 开庭公告
  const CourtColumns = [
    {
      title: '序号',
      width: 40,
      render: (text, record) => `${record.index}`
    },
    {
      title: '案号',
      dataIndex: 'CaseNo',
      key: 'CaseNo',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '开庭时间',
      dataIndex: 'LianDate',
      key: 'LianDate',
      width: 160,
      render: (text, record, index) => isEmpty(formatDate(text))
    },
    {
      title: '案由',
      dataIndex: 'CaseReason',
      key: 'CaseReason',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '公诉人/原告/上诉人/申请人',
      width: 200,
      render: (text, record) => {
        return record.Prosecutorlist.length > 0
          ? record.Prosecutorlist.map((item) => {
              return <TitleLink val={item.Name} origin={info.name}></TitleLink>
            })
          : '-'
      }
    },
    {
      title: '被告人/被告/被上诉人/被申请人',
      width: 200,
      render: (text, record) => {
        return record.Defendantlist.length > 0
          ? record.Defendantlist.map((item) => {
              return <TitleLink val={item.Name} origin={info.name}></TitleLink>
            })
          : '-'
      }
    }
  ]

  // 裁判文书
  const RefereeColumns = [
    {
      title: '序号',
      width: 40,
      render: (text, record) => `${record.index}`
    },
    {
      title: '案号',
      dataIndex: 'CaseNo',
      key: 'CaseNo',
      width: 200,
      render: (text, record, index) => {
        return text ? (
          <div
            className={styles.news}
            onClick={() => {
              fetchReportDetail({ detailType: 'cpws', id: record.id })
            }}
          >
            <Link
              target="_blank"
              to={{ pathname: `/report/detail?detailType=cpws&id=${record.id}` }}
            >
              {text}
            </Link>
          </div>
        ) : (
          '-'
        )
      }
    },
    {
      title: '案件名称',
      dataIndex: 'CaseName',
      key: 'CaseName',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '案由',
      dataIndex: 'CaseReason',
      key: 'CaseReason',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '发布日期',
      dataIndex: 'SubmitDate',
      key: 'SubmitDate',
      width: 160,
      render: (text, record, index) => isEmpty(formatDate(text))
    },
    {
      title: '案件身份',
      dataIndex: 'IsDefendant',
      key: 'IsDefendant',
      render: (val) => (val ? '被告' : '原告') || '-',
      width: 80
    },
    {
      title: '执行法院',
      dataIndex: 'Court',
      key: 'Court',
      width: 160,
      render: (text) => isEmpty(text)
    }
  ]

  // 法院公告
  const PublicStatementColumns = [
    {
      title: '序号',
      width: 40,
      render: (text, record) => `${record.index}`
    },
    {
      title: '上诉人',
      // dataIndex: 'ProsecutorList',
      // key: 'ProsecutorList',
      width: 160,
      render: (text, record) => {
        return record.ProsecutorList.length > 0
          ? record.ProsecutorList.map((item) => {
              return <TitleLink val={item.Name} origin={info.name}></TitleLink>
            })
          : '-'
      }
    },
    {
      title: '被上诉人',
      // dataIndex: 'DefendantList',
      // key: 'DefendantList',
      width: 160,
      render: (text, record) => {
        return record.DefendantList.length > 0
          ? record.DefendantList.map((item) => {
              return <TitleLink val={item.Name} origin={info.name}></TitleLink>
            })
          : '-'
      }
    },
    {
      title: '公告类型',
      dataIndex: 'Category',
      key: 'Category',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '刊登日期',
      dataIndex: 'PublishedDate',
      key: 'PublishedDate',
      width: 160,
      render: (text, record, index) => formatDate(text) || '-'
    }
  ]

  // 失信被执行人
  const UntrustworthyExecutor = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '案件编号',
      dataIndex: 'Anno',
      key: 'Anno',
      width: 200,
      render: (text, record, index) => {
        return text ? (
          <div
            className={styles.clickStatus}
            onClick={() => {
              setModalData(info.sx[index])
              setSxOpenModal(true)
            }}
          >
            {text}
          </div>
        ) : (
          '-'
        )
      }
      // render: (text) => text || '-'
    },
    {
      title: '被执行人履行情况',
      dataIndex: 'Executestatus',
      key: 'Executestatus',
      width: 140,
      render: (text) => text || '-'
    },
    // {
    //   title: '法律生效文书确定的义务',
    //   dataIndex: 'Yiwu',
    //   key: 'Yiwu',
    //   width: 220,
    //   render: (text) => text || '-'
    // },
    {
      title: '执行法院',
      dataIndex: 'Executegov',
      key: 'Executegov',
      width: 100,
      render: (text) => text || '-'
    },
    {
      title: '做出执行依据单位',
      dataIndex: 'Executeunite',
      key: 'Executeunite',
      width: 120,
      render: (text) => text || '-'
    },
    {
      title: '发布时间',
      dataIndex: 'Publicdate',
      key: 'Publicdate',
      width: 160,
      render: (text, record, index) => formatDate(text) || '-'
    }
  ]

  // v1.2.2新增-被执行人
  const bzxColumns = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '案件编号',
      dataIndex: 'Anno',
      key: 'Anno',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '执行法院',
      dataIndex: 'ExecuteGov',
      key: 'ExecuteGov',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '执行标的(元)',
      dataIndex: 'Biaodi',
      key: 'Biaodi',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '立案日期',
      dataIndex: 'Liandate',
      key: 'Liandate',
      width: 160,
      render: (text, record, index) => isEmpty(formatDate(text))
    }
  ]

  // 股权冻结
  const StockFreeze = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '被执行人',
      dataIndex: 'ExecutedBy',
      key: 'ExecutedBy',
      width: 220,
      render: (text, record) => {
        return text ? <TitleLink val={text} type="company"></TitleLink> : '-'
      }
    },
    {
      title: '股权数额',
      dataIndex: 'EquityAmount',
      key: 'EquityAmount',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '执行通知文号',
      dataIndex: 'ExecutionNoticeNum',
      key: 'ExecutionNoticeNum',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '类型 | 状态',
      dataIndex: 'Status',
      key: 'Status',
      width: 160,
      render: (text) => isEmpty(text)
    }
  ]

  /* 经营风险 */
  // 经营异常-完成
  const Warning = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '列入经营异常原因',
      dataIndex: 'AddReason',
      key: 'AddReason',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '列入日期',
      dataIndex: 'AddDate',
      key: 'AddDate',
      width: 160,
      render: (text, record, index) => isEmpty(formatDate(text))
    },
    {
      title: '移出经营异常原因',
      dataIndex: 'RomoveReason',
      key: 'RomoveReason',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '移出日期',
      dataIndex: 'RemoveDate',
      key: 'RemoveDate',
      width: 160,
      render: (text, record, index) => isEmpty(formatDate(text))
    },
    {
      title: '作出决定机关',
      dataIndex: 'DecisionOffice',
      key: 'DecisionOffice',
      width: 200,
      render: (text) => isEmpty(text)
    }
  ]

  // 司法拍卖-完成
  const JudicialAuction = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
      width: 200,
      render: (text, record) => {
        return text ? (
          <div className={styles.news}>
            <Link
              target="_blank"
              to={{
                pathname: `/report/detail?detailType=sfpm&id=${record.id}&Name=${record.Name}&ActionRemark=${record.ActionRemark}`
              }}
            >
              {text}
            </Link>
          </div>
        ) : (
          '-'
        )
      }
    },
    {
      title: '起拍价',
      dataIndex: 'YiWu',
      key: 'YiWu',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '拍卖时间',
      dataIndex: 'ActionRemark',
      key: 'ActionRemark',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '委托法院',
      dataIndex: 'Executegov',
      key: 'Executegov',
      width: 200,
      render: (text) => isEmpty(text)
    }
  ]

  // 土地抵押-已完成
  const LandPledge = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '土地坐落',
      dataIndex: 'Address',
      key: 'Address',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '抵押时间',
      dataIndex: 'StartDate',
      key: 'StartDate',
      width: 100,
      render: (text, record, index) => isEmpty(formatDate(text))
    },
    {
      title: '行政区',
      dataIndex: 'AdministrativeArea',
      key: 'AdministrativeArea',
      width: 100,
      render: (text) => isEmpty(text)
    },
    {
      title: '抵押面积(公顷)',
      dataIndex: 'MortgageAcreage',
      key: 'MortgageAcreage',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '抵押土地用途',
      dataIndex: 'MortgagePurpose',
      key: 'MortgagePurpose',
      width: 160,
      render: (text) => isEmpty(text)
    }
  ]

  // 环保处罚-已完成
  const EnvironmentalPenalty = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '决定书文号',
      dataIndex: 'CaseNo',
      key: 'CaseNo',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '违法类型',
      dataIndex: 'IllegalType',
      key: 'IllegalType',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '处罚日期',
      dataIndex: 'PunishDate',
      key: 'PunishDate',
      width: 200,
      render: (text, record, index) => isEmpty(formatDate(text))
    },
    {
      title: '处罚单位',
      dataIndex: 'PunishGov',
      key: 'PunishGov',
      width: 200,
      render: (text) => isEmpty(text)
    }
  ]

  // 动产抵押-完成
  const ChattelMortgage = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '登记编号',
      dataIndex: 'RegisterNo',
      key: 'RegisterNo',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '登记时间',
      dataIndex: 'RegisterDate',
      key: 'RegisterDate',
      width: 160,
      render: (text, record, index) => isEmpty(formatDate(text))
    },
    {
      title: '公示时间',
      dataIndex: 'PublicDate',
      key: 'PublicDate',
      width: 160,
      render: (text, record, index) => isEmpty(formatDate(text))
    },
    {
      title: '登记机关',
      dataIndex: 'RegisterOffice',
      key: 'RegisterOffice',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '被担保债权数额',
      dataIndex: 'DebtSecuredAmount',
      key: 'DebtSecuredAmount',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      width: 100,
      render: (text) => isEmpty(text)
    }
  ]

  // 严重违法-完成
  const Violation = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 60
    },
    {
      title: '列入严重违法原因',
      dataIndex: 'AddReason',
      key: 'AddReason',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '列入日期',
      dataIndex: 'AddDate',
      key: 'AddDate',
      width: 160,
      render: (text, record, index) => formatDate(text) || '-'
    },
    {
      title: '移出严重违法原因',
      dataIndex: 'RemoveReason',
      key: 'RemoveReason',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '移出日期',
      dataIndex: 'RemoveDate',
      key: 'RemoveDate',
      width: 200,
      render: (text, record, index) => formatDate(text) || '-'
    },
    {
      title: '作出决定机关',
      dataIndex: 'RemoveOffice',
      key: 'RemoveOffice',
      width: 160,
      render: (text) => text || '-'
    }
  ]

  // 欠税公告-完成
  const TaxAnnouncement = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '欠税税种',
      dataIndex: 'Title',
      key: 'Title',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '欠税余额',
      dataIndex: 'Amount',
      key: 'Amount',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '当前新发生欠税',
      dataIndex: 'NewAmount',
      key: 'NewAmount',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '发布单位',
      dataIndex: 'IssuedBy',
      key: 'IssuedBy',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '发布日期',
      dataIndex: 'PublishDate',
      key: 'PublishDate',
      width: 160,
      render: (text, record, index) => formatDate(text) || '-'
    }
  ]

  // 清算信息-完成
  const Liquidation = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '清算组负责人',
      dataIndex: 'Leader',
      key: 'Leader',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '清算组成员',
      dataIndex: 'Member',
      key: 'Member',
      width: 200,
      render: (text) => text || '-'
    }
  ]

  // 简易注销-完成
  const logout = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '登记机关',
      dataIndex: 'Registration',
      key: 'Registration',
      width: 120,
      render: (text) => text || '-'
    },
    {
      title: '公告期',
      dataIndex: 'PublicDate',
      key: 'PublicDate',
      width: 120,
      render: (text) => text || '-'
    },
    {
      title: '异议申请人',
      dataIndex: 'DissentPerson',
      key: 'DissentPerson',
      width: 120,
      render: (text, record) => {
        return record.DissentPerson.length > 0
          ? record.DissentPerson.map((item) => {
              return item
            })
          : '-'
      }
    },
    {
      title: '异议时间',
      dataIndex: 'DissentDate',
      key: 'DissentDate',
      width: 120,
      render: (text, record) => {
        return record.DissentDate.length > 0
          ? record.DissentDate.map((item) => {
              return formatDate(item)
            })
          : '-'
      }
    },
    {
      title: '异议内容',
      dataIndex: 'DissentContent',
      key: 'DissentContent',
      width: 120,
      render: (text, record) => {
        return record.DissentContent.length > 0
          ? record.DissentContent.map((item) => {
              return item
            })
          : '-'
      }
    },
    {
      title: '简易注销结果',
      dataIndex: 'ResultContent',
      key: 'ResultContent',
      width: 120,
      render: (text, record) => {
        return record.ResultContent.length > 0
          ? record.ResultContent.map((item) => {
              return item
            })
          : '-'
      }
    },
    {
      title: '公告申请日期',
      dataIndex: 'ResultListPublicDate',
      key: 'ResultListPublicDate',
      width: 120,
      render: (text, record) => {
        return record.ResultListPublicDate.length > 0
          ? record.ResultListPublicDate.map((item) => {
              return item
            })
          : '-'
      }
    }
  ]

  // 公示催告-完成
  const PublicNotice = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '票号',
      dataIndex: 'BillNo',
      key: 'BillNo',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '票据类型',
      dataIndex: 'BillType',
      key: 'BillType',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '企业名称',
      dataIndex: 'Name',
      key: 'Name',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '票面金额',
      dataIndex: 'BillAmt',
      key: 'BillAmt',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '公告日期',
      dataIndex: 'PublishDate',
      key: 'PublishDate',
      width: 160,
      render: (text, record, index) => formatDate(text) || '-'
    }
  ]

  // 税收违法-完成
  const TaxViolation = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '发布时间',
      dataIndex: 'IllegalTime',
      key: 'IllegalTime',
      width: 160,
      render: (text, record, index) => isEmpty(formatDate(text))
    },
    {
      title: '所属税务机关',
      dataIndex: 'TaxGov',
      key: 'TaxGov',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '案件性质',
      dataIndex: 'CaseNature',
      key: 'CaseNature',
      width: 300,
      render: (text) => isEmpty(text)
    }
  ]

  // 股权出质-v1.2.2字段变更
  const EquityPledge = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '登记编号',
      dataIndex: 'RegistNo',
      key: 'RegistNo',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '质权人',
      // dataIndex: 'PledgeeInfo',
      // key: 'PledgeeInfo',
      width: 160,
      render: (text, record) => {
        return record.PledgeeInfo ? (
          <TitleLink val={record.PledgeeInfo.Name} origin={info.name}></TitleLink>
        ) : (
          '-'
        )
      }
    },
    {
      title: '出质人',
      dataIndex: 'PledgorInfo',
      key: 'PledgorInfo',
      width: 160,
      render: (text, record) => {
        return record.PledgorInfo ? (
          <TitleLink val={record.PledgorInfo.Name} origin={info.name}></TitleLink>
        ) : (
          '-'
        )
      }
    },
    {
      title: '出质股权数',
      dataIndex: 'PledgedAmount',
      key: 'PledgedAmount',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      width: 160,
      render: (text) => isEmpty(text)
    },
    {
      title: '登记日期',
      dataIndex: 'RegDate',
      key: 'RegDate',
      width: 160,
      render: (text, record, index) => isEmpty(formatDate(text))
    }
  ]

  // 行政处罚-已完成
  const AdministrativePenalties = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '决定书文号',
      dataIndex: 'DocNo',
      key: 'DocNo',
      width: 100,
      render: (text) => isEmpty(text)
    },
    {
      title: '违法行为类型',
      dataIndex: 'PenaltyType',
      key: 'PenaltyType',
      width: 100,
      render: (text) => isEmpty(text)
    },
    {
      title: '行政处罚内容',
      dataIndex: 'Content',
      key: 'Content',
      width: 400,
      render: (text) => isEmpty(text)
    },
    {
      title: '决定机关',
      dataIndex: 'OfficeName',
      key: 'OfficeName',
      width: 100,
      render: (text) => isEmpty(text)
    },
    {
      title: '决定日期',
      dataIndex: 'PenaltyDate',
      key: 'PenaltyDate',
      width: 100,
      render: (text, record, index) => isEmpty(formatDate(text))
    }
  ]

  const handleClick = (key) => {
    scrollToAnchor(key)
  }

  // 报告顶部
  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <div className={styles.headerTitle}>反欺诈报告</div>
          <div className={styles.generateTime}>
            {`生成时间:`}
            {info.createTime}
          </div>
        </div>
        <div className={styles.detailWrap}>
          <div className={styles.left}>
            <IconFont type="iconqiyegailan" className={styles.icon} />
            <div>
              <div className={styles.company}>{info.name}</div>
              <div className={styles.tagContainer}>
                <Tag color="orange" style={{ marginRight: 8 }}>
                  {info.status}
                </Tag>
                <Tag color="blue">{info.industry}</Tag>
              </div>
              <div className={styles.address}>
                {`地址: `}
                {info.address}
              </div>
            </div>
          </div>
          {/* <div
            className={styles.right}
            style={{ background: `url(${afbg}) `, backgroundSize: 'cover' }}
          > */}
          {/* <div className={styles.scoreTitle}>反欺诈评分</div>
            <div className={styles.score}>80</div> */}
          {/* </div> */}
          <div
            className={styles.right}
            style={{ background: `url(${afbg}) `, backgroundSize: 'cover' }}
          >
            <div className={styles.scoreTitle}>反欺诈评分</div>
            <div className={styles.score}>{info.score}</div>
          </div>
        </div>
      </div>
    )
  }

  const changeTab = (activeKey) => {
    setActiveTab(activeKey)
  }

  const tabList = [
    {
      tab: '工商信息',
      key: 'businessinfo'
    },
    {
      tab: '法律诉讼',
      key: 'legalmap'
    },
    {
      tab: '经营风险',
      key: 'riskmap'
    }
  ]

  const renderTabItem = () => {
    switch (activeTab) {
      case 'businessinfo':
        return (
          <div className={styles.subBlock}>
            {businessinfo.map((item, index) => {
              return (
                <div className={styles.block} onClick={() => handleClick(item.id)}>
                  {item.name}
                  <span className={styles.num}>{item.amount}</span>
                </div>
              )
            })}
          </div>
        )

      case 'legalmap':
        return (
          <div className={styles.subBlock}>
            {legalmap.map((item, index) => {
              return (
                <div className={styles.block} onClick={() => handleClick(item.id)}>
                  {item.name}
                  <span className={styles.num}>{item.amount}</span>
                </div>
              )
            })}
          </div>
        )

      case 'riskmap':
        return (
          <div className={styles.subBlock}>
            {riskmap.map((item, index) => {
              return (
                <div className={styles.block} onClick={() => handleClick(item.id)}>
                  {item.name}
                  <span className={styles.num}>{item.amount}</span>
                </div>
              )
            })}
          </div>
        )
      default:
        break
    }
  }

  const renderCardTab = () => (
    <Card
      style={{ width: '100%', marginTop: 16 }}
      className={styles.tabWrap}
      tabList={tabList}
      activeTabKey={activeTab}
      onTabChange={changeTab}
    >
      {renderTabItem()}
    </Card>
  )

  // 基本信息
  const renderBasicInfo = () => {
    return (
      <Descriptions
        title="基本信息"
        bordered
        column={2}
        className="desc"
        style={{ marginBottom: 30 }}
      >
        <DescriptionsItem label={<div style={{ width: 180 }}>企业名称</div>}>
          <div style={{ width: 260 }}>{basicInfo?.Name || '-'}</div>
        </DescriptionsItem>
        <DescriptionsItem label={<div style={{ width: 180 }}>工商注册号</div>}>
          {basicInfo?.No || '-'}
        </DescriptionsItem>
        <DescriptionsItem label="统一社会信用代码">{basicInfo?.CreditCode || '-'}</DescriptionsItem>
        <DescriptionsItem label="法人">
          {basicInfo?.OperName ? (
            <TitleLink val={basicInfo?.OperName} type="human"></TitleLink>
          ) : (
            '-'
          )}
        </DescriptionsItem>
        <DescriptionsItem label="组织机构代码">{basicInfo?.OrgNo || '-'}</DescriptionsItem>
        <DescriptionsItem label="注册资本">{basicInfo?.RegistCapi || '-'}</DescriptionsItem>
        <DescriptionsItem label="所属行业">
          <div
            className={styles.clickStatus}
            onClick={() => {
              setSshyOpenModal(true)
            }}
          >
            {basicInfo?.Industry || '-'}
          </div>
        </DescriptionsItem>
        <DescriptionsItem label="企业类型">{basicInfo?.EconKind || '-'}</DescriptionsItem>
        <DescriptionsItem label="经营状态">{basicInfo?.Status || '-'}</DescriptionsItem>
        <DescriptionsItem label="成立日期">
          {formatDate(basicInfo?.StartDate) || '-'}
        </DescriptionsItem>
        <DescriptionsItem label="核准日期">
          {formatDate(basicInfo?.CheckDate) || '-'}
        </DescriptionsItem>
        <DescriptionsItem label="营业期限">
          {formatDate(basicInfo?.TermStart)}
          {basicInfo?.TermStart ? '-' : ''}
          {formatDate(basicInfo?.TermEnd) || '长期有效'}
        </DescriptionsItem>
        <DescriptionsItem label="登记机关" span={3}>
          {basicInfo?.BelongOrg || '-'}
        </DescriptionsItem>
        <DescriptionsItem label="注册地址" span={3}>
          {basicInfo?.Address || '-'}
          {isPc ? (
            <a
              rel="noopener noreferrer"
              target="_blank"
              style={{ marginLeft: 30 }}
              className={styles.clickStatus}
              href={baiduAddress(basicInfo?.Address)}
              // href={baiduAddress('浙江省三门县健跳镇三门核电厂区')}
            >
              查看地图
            </a>
          ) : (
            <a
              rel="noopener noreferrer"
              target="_self"
              style={{ marginLeft: 30 }}
              className={styles.clickStatus}
              href={baiduAddress(basicInfo?.Address)}
              // href={baiduAddress('浙江省三门县健跳镇三门核电厂区')}
            >
              查看地图
            </a>
          )}
          {/* <a
            rel="noopener noreferrer"
            target="_blank"
            style={{ marginLeft: 30 }}
            className={styles.clickStatus}
            href={baiduAddress(basicInfo?.Address)}
          >
            查看地图
          </a> */}
        </DescriptionsItem>
        <DescriptionsItem label="经营范围">{basicInfo?.Scope || '-'}</DescriptionsItem>
      </Descriptions>
    )
  }

  // 工商信息
  const renderBusinessInfo = () => {
    return (
      <div>
        <Card
          style={{ marginTop: 16 }}
          title={<CardTitle title="工商信息" icon="icongongshangxinxi" />}
        >
          {renderBasicInfo()}
          <ReportTable
            id="gsxx_czxx"
            columns={investorColumns}
            data={czxx}
            title="投资人及出资人信息"
          />
          {/* <div style={{ marginTop: 16 }}>
            <div className={styles.tableTitle}>股权穿透</div>
            <div className={styles.container} id="container"></div>
          </div> */}
          <ReportTable id="gsxx_bgjl" columns={updateColumns} data={bgjl} title="变更记录" />
          <ReportTable id="gsxx_zyry" columns={mainStaffColumns} data={zyry} title="主要人员" />
          <ReportTable id="gsxx_nsxydj" columns={levelColumns} data={nsxy} title="纳税信用等级" />
        </Card>
      </div>
    )
  }

  // 法律诉讼
  const renderLegalProceedings = () => {
    return (
      <div>
        <Card
          style={{ marginTop: 16 }}
          title={<CardTitle title="法律诉讼" icon="iconfalvsusong" />}
        >
          <ReportTable
            id="flss_ktgg"
            columns={CourtColumns}
            data={ktgg}
            title="开庭公告"
            summary={true}
          />
          <ReportTable
            id="flss_cpws"
            columns={RefereeColumns}
            data={cpws}
            title="裁判文书"
            summary={true}
          />
          {/* <ReportTable id="flss_cpws" columns={RefereeColumns} data={cpws} title="裁判文书" defendantNum={1} notDefendantNum={1}/> */}
          <ReportTable
            id="flss_fygg"
            columns={PublicStatementColumns}
            data={fygg}
            title="法院公告"
          />
          <ReportTable
            id="flss_sx"
            columns={UntrustworthyExecutor}
            data={sx}
            title="失信被执行人"
          />
          <ReportTable id="flss_gqdj" columns={StockFreeze} data={gqdj} title="股权冻结" />
          <ReportTable id="flss_bzx" columns={bzxColumns} data={bzx} title="被执行人" />
        </Card>
      </div>
    )
  }

  // 经营风险
  const renderRiskInfo = () => {
    return (
      <div>
        <Card
          style={{ marginTop: 16 }}
          title={<CardTitle title="经营风险" icon="iconjingyingfengxian" />}
        >
          <ReportTable id="jyfx_jyyc" columns={Warning} data={jyyc} title="经营异常" />
          <ReportTable id="jyfx_sfpm" columns={JudicialAuction} data={sfpm} title="司法拍卖" />
          <ReportTable id="jyfx_tdzy" columns={LandPledge} data={tddy} title="土地抵押" />
          <ReportTable id="jyfx_hbcf" columns={EnvironmentalPenalty} data={hbcf} title="环保处罚" />
          <ReportTable id="jyfx_dcdy" columns={ChattelMortgage} data={dcdy} title="动产抵押" />
          <ReportTable id="jyfx_yzwf" columns={Violation} data={yzwf} title="严重违法" />
          <ReportTable id="jyfx_qsgg" columns={TaxAnnouncement} data={qsgg} title="欠税公告" />
          <ReportTable id="jyfx_qsxx" columns={Liquidation} data={qsxx} title="清算信息" />
          <ReportTable id="jyfx_jyzx" columns={logout} data={jyzx} title="简易注销" />
          <ReportTable id="jyfx_gscg" columns={PublicNotice} data={ggcs} title="公示催告" />
          <ReportTable id="jyfx_sswf" columns={TaxViolation} data={sswf} title="税收违法" />
          <ReportTable id="jyfx_gqcz" columns={EquityPledge} data={gqcz} title="股权出质" />
          <ReportTable
            id="jyfx_xzcf"
            columns={AdministrativePenalties}
            data={xzcf}
            title="行政处罚"
          />
        </Card>
      </div>
    )
  }

  const renderModal = () => {
    return (
      <React.Fragment>
        {/* 失信被执行人 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="失信被执行人详情"
          visible={sx_OpenModal}
          onOk={() => setSxOpenModal(false)}
          onCancel={() => setSxOpenModal(false)}
        >
          <div className={styles.descWrap}>
            <Descriptions bordered column={2} className="desc">
              <DescriptionsItem label={<div style={{ width: 160 }}>失信被执行人</div>}>
                <TitleLink val={modalData?.Name} origin={info.name}></TitleLink>
              </DescriptionsItem>
              <DescriptionsItem label={<div style={{ width: 160 }}>案号</div>}>
                {isEmpty(modalData?.Anno)}
              </DescriptionsItem>
              <DescriptionsItem label="履行情况">
                {isEmpty(modalData?.Executestatus)}
              </DescriptionsItem>
              <DescriptionsItem label="执行法院">{isEmpty(modalData?.Executegov)}</DescriptionsItem>
              <DescriptionsItem label="执行依据文号">
                {isEmpty(modalData?.Executeno)}
              </DescriptionsItem>
              <DescriptionsItem label="作出执行依据单位">
                {isEmpty(modalData?.Executeunite)}
              </DescriptionsItem>
              <DescriptionsItem label="立案日期">
                {isEmpty(formatDate(modalData?.Liandate))}
              </DescriptionsItem>
              <DescriptionsItem label="发布日期">
                {isEmpty(formatDate(modalData?.Publicdate))}
              </DescriptionsItem>
              <DescriptionsItem label="失信行为">{modalData?.Actionremark || '-'}</DescriptionsItem>
              <DescriptionsItem label="生效法律文书确定的义务">
                {isEmpty(modalData?.Yiwu)}
              </DescriptionsItem>
            </Descriptions>
          </div>
        </Modal>
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="行业数据"
          visible={sshy_OpenModal}
          onOk={() => setSshyOpenModal(false)}
          onCancel={() => setSshyOpenModal(false)}
        >
          {industryData.length > 0 && (
            <SliderChart currentIndustry={basicInfo?.Industry} data={industryData} />
          )}
        </Modal>
      </React.Fragment>
    )
  }

  const renderReport = () => {
    return (
      <>
        <Statement data={info} />
        {renderHeader()}
        {renderCardTab()}
        {renderBusinessInfo()}
        {renderLegalProceedings()}
        {renderRiskInfo()}
        {renderModal()}
      </>
    )
  }

  return <div className={styles.reportWrap}>{info.name && renderReport()}</div>
}

export default AFReport
