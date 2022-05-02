import React, { useState, useEffect } from 'react'
import { Tag, Card, Modal, Descriptions, Spin } from 'antd'
import CardTitle from '../Components/CardTitle'
import IconFont from '@/components/IconFont'
import ReportTable from '../Components/ReportTable'
import ModalTable from '../Components/ModalTable'
import Statement from '../Components/Statement'
import TitleLink from '../Components/TitleLink'
import { useRequest } from '@dragon/hooks'
import { scrollToAnchor, formatTime } from '@/utils'
import { fetchReportList, fetchReportDetail } from '@/services/microSubsidy/report'
import EmptyReport from '../Components/EmptyReport'
import { formatDate } from '@/utils'
import styles from '../styles.less'

const DescriptionsItem = Descriptions.Item
const riskbg = require('../../../../assets/risk.png')

const RiskReport = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  const [activeTab, setActiveTab] = useState('statusMap')
  const [modalData, setModalData] = useState({})
  // 债券信息弹框
  const [zqxx_OpenModal, setZqxxOpenModal] = useState(false)
  // 弹框对应公司
  const [modalCompany, setModalCompany] = useState('')
  // 关联人风险弹框
  const [glrfx_frbg_OpenModal, setGlrFrbgOpenModal] = useState(false)
  const [glrfx_gdbg_OpenModal, setGlrGdbgOpenModal] = useState(false)
  const [glrfx_sx_OpenModal, setGlrSxOpenModal] = useState(false)
  const [glrfx_bzx_OpenModal, setGlrBzxOpenModal] = useState(false)
  const [glrfx_ktgg_OpenModal, setGlrKtggOpenModal] = useState(false)
  const [glrfx_cpws_OpenModal, setGlrCpwsOpenModal] = useState(false)
  const [glrfx_sfpm_OpenModal, setGlrSfpmOpenModal] = useState(false)
  const [glrfx_jyyc_OpenModal, setGlrJyycOpenModal] = useState(false)
  const [glrfx_gqcz_OpenModal, setGlrGqczOpenModal] = useState(false)
  const [glrfx_dcdy_OpenModal, setGlrDcdyOpenModal] = useState(false)
  const [glrfx_gqdj_OpenModal, setGlrGqdjOpenModal] = useState(false)

  // 关联企业风险弹框
  const [glqyfx_frbg_OpenModal, setGlqyFrbgOpenModal] = useState(false)
  const [glqyfx_gdbg_OpenModal, setGlqyGdbgOpenModal] = useState(false)
  const [glqyfx_sx_OpenModal, setGlqySxOpenModal] = useState(false)
  const [glqyfx_bzx_OpenModal, setGlqyBzxOpenModal] = useState(false)
  const [glqyfx_ktgg_OpenModal, setGlqyKtggOpenModal] = useState(false)
  const [glqyfx_cpws_OpenModal, setGlqyCpwsOpenModal] = useState(false)
  const [glqyfx_sfpm_OpenModal, setGlqySfpmOpenModal] = useState(false)
  const [glqyfx_jyyc_OpenModal, setGlqyJyycOpenModal] = useState(false)
  const [glqyfx_gqcz_OpenModal, setGlqyGqczOpenModal] = useState(false)
  const [glqyfx_dcdy_OpenModal, setGlqyDcdyOpenModal] = useState(false)
  const [glqyfx_gqdj_OpenModal, setGlqyGqdjOpenModal] = useState(false)
  const [glqyfx_tddy_OpenModal, setGlqyTddyOpenModal] = useState(false)
  const [glqyfx_xzcf_OpenModal, setGlqyXzcfOpenModal] = useState(false)
  const [glqyfx_hbcf_OpenModal, setGlqyHbcfOpenModal] = useState(false)
  const [glqyfx_sswf_OpenModal, setGlqySswfOpenModal] = useState(false)
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

  const { data: info = {}, loading: fetching } = useRequest(() =>
    fetchReportList({ bizNo: id, reportType: 'RISK_REPORT' })
  )

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

  // 判断是否为自身企业
  const isSelf = (origin, current) => {
    let arr = []
    if (current && current.indexOf(',') !== -1) {
      arr = current.split(',')
      return arr.map((item) => {
        return origin === item ? <div>{current}</div> : <TitleLink val={item} type="company" />
      })
    } else if (origin === current || current === '投资方未知') {
      return <div>{current}</div>
    } else {
      return <TitleLink val={current} type="company" />
    }
  }

  // 跳转公司
  const linkToComapny = (origin, current) => {
    let arr = []
    if (current && current.indexOf(',') !== -1) {
      arr = current.split(',')
      return arr.map((item) => {
        return origin === item ? <div>{current}</div> : <TitleLink val={item} type="company" />
      })
    } else if (origin === current || current === '投资方未知') {
      return <div>{current}</div>
    } else {
      return <TitleLink val={current} type="company" />
    }
  }

  // 获取招聘信息Url
  const handleTitleLink = (id) => {
    fetchReportDetail({ detailType: 'zpxx', id: id }).then((res) => {
      if (res instanceof Error) return
      window.open(res.detail.Url)
    })
  }

  // 经营风险map
  const statusMap = [
    {
      name: '融资信息',
      amount: info.rzxx?.length || 0,
      id: 'jyzk_rzxx'
    },
    {
      name: '地块公示',
      amount: info.dkgs?.length || 0,
      id: 'jyzk_dkgs'
    },
    {
      name: '购地信息',
      amount: info.gdxx?.length || 0,
      id: 'jyzk_gdxx'
    },
    {
      name: '土地转让',
      amount: info.tdzr?.length || 0,
      id: 'jyzk_tdzr'
    },
    {
      name: '债券信息',
      amount: info.zqxx?.length || 0,
      id: 'jyzk_zqxx'
    },
    {
      name: '行政许可',
      amount: info.xzxk?.length || 0,
      id: 'jyzk_xzxkgsj'
    },
    {
      name: '抽查检查',
      amount: info.ccjc?.length || 0,
      id: 'jyzk_ccjc'
    },
    {
      name: '税务信用',
      amount: info.swxy?.length || 0,
      id: 'jyzk_swxy'
    },
    {
      name: '招投标信息',
      amount: info.ztbxx?.length || 0,
      id: 'jyzk_ztbxx'
    },
    {
      name: '客户',
      amount: info.khcx?.length || 0,
      id: 'jyzk_khcx'
    },
    {
      name: '供应商',
      amount: info.gyscx?.length || 0,
      id: 'jyzk_gyscx'
    }
  ]

  // 经营风险表格
  const jyfxColumns = {
    // 融资信息
    jyfx_rzxx: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '产品名称',
        dataIndex: 'ProductName',
        key: 'ProductName',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '融资轮次',
        dataIndex: 'Round',
        key: 'Round',
        width: 100,
        render: (text) => text || '-'
      },
      {
        title: '融资金额',
        dataIndex: 'Amount',
        key: 'Amount',
        width: 120,
        render: (text) => text || '-'
      },
      {
        title: '投资方',
        dataIndex: 'Investment',
        key: 'Investment',
        width: 200,
        render: (text, record) => {
          return text ? <div>{linkToComapny(info.name, text)}</div> : '-'
        }
        // render: (text) => text || '-'
      },
      {
        title: '投资日期',
        dataIndex: 'Date',
        key: 'Date',
        width: 80,
        render: (text, record, index) => formatDate(text) || '-'
      }
    ],
    // 地块公示
    jyfx_dkgs: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '地块位置',
        dataIndex: 'Address',
        key: 'Address',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '发布机关',
        dataIndex: 'PublishGov',
        key: 'PublishGov',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '行政区',
        dataIndex: 'AdminArea',
        key: 'AdminArea',
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
    ],
    // 购地信息
    jyfx_gdxx: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '项目位置',
        dataIndex: 'Address',
        key: 'Address',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '土地用途',
        dataIndex: 'LandUse',
        key: 'LandUse',
        width: 200,
        render: (text) => text || '-'
      },
      {
        title: '总面积(公顷)',
        dataIndex: 'Area',
        key: 'Area',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '行政区',
        dataIndex: 'AdminArea',
        key: 'AdminArea',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '供应方式',
        dataIndex: 'SupplyWay',
        key: 'SupplyWay',
        width: 80,
        render: (text) => text || '-'
      },
      {
        title: '签订日期',
        dataIndex: 'SignTime',
        key: 'SignTime',
        width: 80,
        render: (text, record, index) => formatDate(text) || '-'
      }
    ],
    // 土地转让
    jyfx_tdzr: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '土地坐落',
        dataIndex: 'Address',
        key: 'Address',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '行政区',
        dataIndex: 'AdminArea',
        key: 'AdminArea',
        width: 200,
        render: (text) => text || '-'
      },
      {
        title: '原土地使用人',
        dataIndex: 'OldOwner.Name',
        key: 'OldOwner.Name',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '现有土地使用人',
        dataIndex: 'NewOwner.Name',
        key: 'NewOwner.Name',
        width: 160,
        render: (text) => text || '-'
      }
    ],
    // 债券信息
    jyfx_zqxx: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '债券简称',
        dataIndex: 'ShortName',
        key: 'ShortName',
        width: 160,
        render: (text, record, index) => {
          return (
            <div className={styles.clickStatus} onClick={() => getZqxxData(record.id)}>
              {text}
            </div>
          )
        }
      },
      {
        title: '债券代码',
        dataIndex: 'BondCode',
        key: 'BondCode',
        width: 200,
        render: (text) => text || '-'
      },
      {
        title: '债券类型',
        dataIndex: 'BondType',
        key: 'BondType',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '发行日期',
        dataIndex: 'ReleaseDate',
        key: 'ReleaseDate',
        width: 160,
        render: (text, record, index) => formatDate(text) || '-'
      },
      {
        title: '上市日期',
        dataIndex: 'LaunchDate',
        key: 'LaunchDate',
        width: 160,
        render: (text, record, index) => formatDate(text) || '-'
      }
    ],
    // 行政许可
    jyfx_xzxk: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '许可文件编号',
        dataIndex: 'LicensDocNo',
        key: 'LicensDocNo',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '许可文件名称',
        dataIndex: 'LicensDocName',
        key: 'LicensDocName',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '有效期自',
        dataIndex: 'ValidityFrom',
        key: 'ValidityFrom',
        width: 120,
        render: (text, record, index) => formatDate(text) || '-'
      },
      {
        title: '有效期至',
        dataIndex: 'ValidityTo',
        key: 'ValidityTo',
        width: 120,
        render: (text, record, index) => formatDate(text) || '-'
      },
      {
        title: '许可机关',
        dataIndex: 'LicensOffice',
        key: 'LicensOffice',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '许可内容',
        dataIndex: 'LicensContent',
        key: 'LicensContent',
        width: 240,
        render: (text) => text || '-'
      }
    ],
    // 抽查检查
    jyfx_ccjc: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '类型',
        dataIndex: 'Type',
        key: 'Type',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '结果',
        dataIndex: 'Consequence',
        key: 'Consequence',
        width: 200,
        render: (text) => text || '-'
      },
      {
        title: '检查实施机关',
        dataIndex: 'ExecutiveOrg',
        key: 'ExecutiveOrg',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '日期',
        dataIndex: 'Date',
        key: 'Date',
        width: 160,
        render: (text, record, index) => formatDate(text) || '-'
      }
    ],
    // 税务信用
    jyfx_swxy: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '纳税人识别号',
        dataIndex: 'No',
        key: 'No',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '公司名称',
        dataIndex: 'Name',
        key: 'Name',
        width: 200,
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
        title: '纳税信用等级',
        dataIndex: 'Level',
        key: 'Level',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '评价单位',
        dataIndex: 'Org',
        key: 'Org',
        width: 160,
        render: (text) => text || '-'
      }
    ],
    // 招投标信息
    jyfx_ztbxx: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '描述',
        dataIndex: 'Title',
        key: 'Title',
        width: 200,
        render: (text) => text || '-'
      },
      {
        title: '所属地区',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '项目分类',
        dataIndex: 'ChannelName',
        key: 'ChannelName',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '发布日期',
        dataIndex: 'Pubdate',
        key: 'Pubdate',
        width: 160,
        render: (text, record, index) => formatDate(text) || '-'
      }
    ],
    // 客户
    jyfx_khcx: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '年份',
        dataIndex: 'Year',
        key: 'Year',
        width: 100,
        render: (text) => text || '-'
      },
      {
        title: '客户名称',
        dataIndex: 'Name',
        key: 'Name',
        width: 200,
        render: (text) => <TitleLink val={text} type="company" />
      },
      {
        title: '销售金额(万元)',
        dataIndex: 'SalesAmount',
        key: 'SalesAmount',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '关联关系',
        dataIndex: 'Relationship',
        key: 'Relationship',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '来源',
        dataIndex: 'Source',
        key: 'Source',
        width: 200,
        render: (text) => text || '-'
      }
    ],
    // 供应商
    jyfx_gyscx: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '年份',
        dataIndex: 'Year',
        key: 'Year',
        width: 100,
        render: (text) => text || '-'
      },
      {
        title: '供应商名称',
        dataIndex: 'Name',
        key: 'Name',
        width: 200,
        render: (text) => <TitleLink val={text} type="company" />
      },
      {
        title: '采购金额(万元)',
        dataIndex: 'PurchaseAmount',
        key: 'PurchaseAmount',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '关联关系',
        dataIndex: 'Relationship',
        key: 'Relationship',
        width: 160,
        render: (text) => text || '-'
      },
      {
        title: '来源',
        dataIndex: 'Source',
        key: 'Source',
        width: 160,
        render: (text) => text || '-'
      }
    ]
  }

  // 企业关联人风险map
  const relateMap = [
    {
      name: '法人变更',
      amount: info.glrfx?.frbg?.length || 0,
      id: 'relate_frbg'
    },
    {
      name: '股东变更',
      amount: info.glrfx?.gdbg?.length || 0,
      id: 'relate_gdbg'
    },
    {
      name: '失信被执行人',
      amount: info.glrfx?.sx?.length || 0,
      id: 'relate_sx'
    },
    {
      name: '被执行人',
      amount: info.glrfx?.bzx?.length || 0,
      id: 'relate_bzx'
    },
    {
      name: '开庭公告',
      amount: info.glrfx?.ktgg?.length || 0,
      id: 'relate_ktgg'
    },
    {
      name: '裁判文书',
      amount: info.glrfx?.cpws?.length || 0,
      id: 'relate_cpws'
    },
    {
      name: '司法拍卖',
      amount: info.glrfx?.sfpm?.length || 0,
      id: 'relate_sfpm'
    },
    {
      name: '经营异常',
      amount: info.glrfx?.jyyc?.length || 0,
      id: 'relate_jyyc'
    },
    {
      name: '股权出质',
      amount: info.glrfx?.gqcz?.length || 0,
      id: 'relate_gqcz'
    },
    {
      name: '动产抵押',
      amount: info.glrfx?.dcdy?.length || 0,
      id: 'relate_dcdy'
    },
    {
      name: '股权冻结',
      amount: info.glrfx?.gqdj?.length || 0,
      id: 'relate_gqdj'
    },
    {
      name: '行政处罚',
      amount: info.glrfx?.xzcf?.length || 0,
      id: 'relate_xzcf'
    }
  ]

  // 关联人风险表格
  const glrfxColumns = {
    // 法人变更
    glrfx_frgb: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 80,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        render: (t) => t || '-',
        width: 100
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 160,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '变更次数',
        width: 160,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrFrbgOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 股东变更
    glrfx_gdbg: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 80,
        render: (text) => {
          return text ? <TitleLink val={text}></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        render: (text) => isEmpty(text),
        width: 80
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 160,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '变更次数',
        width: 160,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrGdbgOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 失信被执行人
    glrfx_sx: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 100,
        render: (text) => {
          return text ? <TitleLink val={text}></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        width: 180,
        render: (text) => isEmpty(text)
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 200,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 80,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrSxOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 被执行人
    glrfx_bzx: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 100,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        width: 180,
        render: (text) => isEmpty(text)
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 200,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 80,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrBzxOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 开庭公告
    glrfx_ktgg: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 100,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        width: 180,
        render: (text) => isEmpty(text)
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 200,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 80,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrKtggOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 裁判文书
    glrfx_cpws: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 100,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        width: 180,
        render: (text) => isEmpty(text)
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 200,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 80,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrCpwsOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 司法拍卖
    glrfx_sfpm: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 100,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        width: 180,
        render: (text) => isEmpty(text)
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 200,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 80,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrSfpmOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 经营异常
    glrfx_jyyc: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 100,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        width: 180,
        render: (text) => isEmpty(text)
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 200,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 80,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrJyycOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 股权出质
    glrfx_gqcz: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 100,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        width: 180,
        render: (text) => isEmpty(text)
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 200,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 80,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrGqczOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 动产抵押
    glrfx_dcdy: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 100,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        width: 180,
        render: (text) => isEmpty(text)
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 200,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 80,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrDcdyOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 股权冻结
    glrfx_gqdj: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 80,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        width: 100,
        render: (text) => isEmpty(text)
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 200,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 180,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 80,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlrGqdjOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 行政处罚
    glrfx_xzcf: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        width: 80,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '与本公司关系',
        dataIndex: 'SelfCompanyRoleDesc',
        key: 'SelfCompanyRoleDesc',
        width: 80,
        render: (text) => isEmpty(text)
      },
      {
        title: '风险公司',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 100,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '与风险公司关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 100,
        render: (text) => isEmpty(text)
      },
      {
        title: '总数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 60,
        render: (text) => isEmpty(text)
      },
      {
        title: '案由',
        dataIndex: 'CaseReason',
        key: 'CaseReason',
        width: 200,
        render: (text) => isEmpty(text)
      }
    ]
  }

  // 关联企业风险map
  const companyMap = [
    {
      name: '法人变更',
      amount: info.glqyfx?.frbg?.length || 0,
      id: 'company_frbg'
    },
    {
      name: '股东变更',
      amount: info.glqyfx?.gdbg?.length || 0,
      id: 'company_gdbg'
    },
    {
      name: '失信被执行人',
      amount: info.glqyfx?.sx?.length || 0,
      id: 'company_sx'
    },
    {
      name: '被执行人',
      amount: info.glqyfx?.bzx?.length || 0,
      id: 'company_bzx'
    },
    {
      name: '开庭公告',
      amount: info.glqyfx?.ktgg?.length || 0,
      id: 'company_ktgg'
    },
    {
      name: '裁判文书',
      amount: info.glqyfx?.cpws?.length || 0,
      id: 'company_cpws'
    },
    {
      name: '司法拍卖',
      amount: info.glqyfx?.sfpm?.length || 0,
      id: 'company_sfpm'
    },
    {
      name: '经营异常',
      amount: info.glqyfx?.jyyc?.length || 0,
      id: 'company_jyyc'
    },
    {
      name: '股权出质',
      amount: info.glqyfx?.gqcz?.length || 0,
      id: 'company_gqcz'
    },
    {
      name: '动产抵押',
      amount: info.glqyfx?.dcdy?.length || 0,
      id: 'company_dcdy'
    },
    {
      name: '股权冻结',
      amount: info.glqyfx?.gqdj?.length || 0,
      id: 'company_gqdj'
    },
    {
      name: '行政处罚',
      amount: info.glqyfx?.xzcf?.length || 0,
      id: 'company_xzcf'
    },
    {
      name: '土地抵押',
      amount: info.glqyfx?.tddy?.length || 0,
      id: 'company_tdzy'
    },
    {
      name: '环保处罚',
      amount: info.glqyfx?.hbcf?.length || 0,
      id: 'company_hbcf'
    },

    {
      name: '税收违法',
      amount: info.glqyfx?.sswf?.length || 0,
      id: 'company_sswf'
    }
  ]

  // 关联企业风险表格
  const glqyfxColumns = {
    // 法人变更
    glqyfx_frbg: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '变更次数',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyFrbgOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 股东变更
    glqyfx_gdbg: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '变更次数',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyGdbgOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 失信被执行人
    glqyfx_sx: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqySxOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 被执行人
    glqyfx_bzx: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyBzxOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 开庭公告
    glqyfx_ktgg: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setGlqyKtggOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 裁判文书
    glqyfx_cpws: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyCpwsOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 司法拍卖
    glqyfx_sfpm: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqySfpmOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 经营异常
    glqyfx_jyyc: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyJyycOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 股权出质
    glqyfx_gqcz: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyGqczOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 动产抵押
    glqyfx_dcdy: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyDcdyOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 股权冻结
    glqyfx_gqdj: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyGqdjOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 行政处罚
    glqyfx_xzcf: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 160,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 80,
        render: (text) => isEmpty(text)
      },
      {
        title: '案由',
        dataIndex: 'CaseReason',
        key: 'CaseReason',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 80,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyXzcfOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 土地抵押
    glqyfx_tddy: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyTddyOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 环保处罚
    glqyfx_hbcf: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqyHbcfOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ],
    // 税收违法
    glqyfx_sswf: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        width: 300,
        render: (text) => {
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
        }
      },
      {
        title: '关系',
        dataIndex: 'RoleDesc',
        key: 'RoleDesc',
        width: 200,
        render: (text) => isEmpty(text)
      },
      {
        title: '数量',
        dataIndex: 'Count',
        key: 'Count',
        width: 200,
        render: (text, record, index) => {
          return record.detail?.length > 0 ? (
            <div
              className={styles.clickStatus}
              onClick={() => {
                setModalData(record.detail)
                setModalCompany(record.CompanyName)
                setGlqySswfOpenModal(true)
              }}
            >
              {record.detail?.length}
            </div>
          ) : (
            '0'
          )
        }
      }
    ]
  }

  // 知识产权map
  const propertyMap = [
    {
      name: '商标',
      amount: info.sb?.length || 0,
      id: 'property_brand'
    },
    {
      name: '软件著作权',
      amount: info.rjzzq?.length || 0,
      id: 'property_zzqrz'
    },
    {
      name: '公司网站信息',
      amount: info.gswz?.length || 0,
      id: 'property_gswz'
    },
    {
      name: '专利',
      amount: info.zl?.length || 0,
      id: 'property_zl'
    }
  ]

  // 其他map
  const othersMap = [
    {
      name: '新闻舆情',
      amount: info.xwyq?.length || 0,
      id: 'others_xwyq'
    },
    {
      name: '招聘信息',
      amount: info.zpxx?.length || 0,
      id: 'others_zpxx'
    }
  ]

  // 获取债券信息详情
  const getZqxxData = (id) => {
    fetchReportDetail({ detailType: 'zqxx', id: id }).then((res) => {
      if (res instanceof Error) return
      setModalData(res.detail)
      setZqxxOpenModal(true)
    })
  }

  /* 知识产权 */
  // 知识产权_商标-完成
  const property_brand = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '商标',
      dataIndex: 'ImageUrl',
      key: 'ImageUrl',
      width: 100,
      render: (text) => <img src={text} className={styles.logo} alt="" />
    },
    {
      title: '注册号',
      dataIndex: 'RegNo',
      key: 'RegNo',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '流程状态',
      dataIndex: 'FlowStatusDesc',
      key: 'FlowStatusDesc',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '申请日期',
      dataIndex: 'AppDate',
      key: 'AppDate',
      width: 160,
      render: (text, record, index) => formatDate(text) || '-'
    }
  ]

  // 知识产权_著作权软著-完成
  const property_zzqrz = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '软件全称',
      dataIndex: 'Name',
      key: 'Name',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '登记号',
      dataIndex: 'RegisterNo',
      key: 'RegisterNo',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '登记批准日期',
      dataIndex: 'RegisterAperDate',
      key: 'RegisterAperDate',
      width: 200,
      render: (text, record, index) => formatDate(text) || '-'
    },
    {
      title: '版本号',
      dataIndex: 'VersionNo',
      key: 'VersionNo',
      width: 160,
      render: (text) => text || '-'
    }
  ]

  // 知识产权_公司网站信息-完成
  const property_gswzxx = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '域名',
      dataIndex: 'YuMing',
      key: 'YuMing',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '网址',
      dataIndex: 'HomeSite',
      key: 'HomeSite',
      width: 200,
      render: (text) => {
        return text ? (
          <div className={styles.news}>
            {isPc ? (
              <a rel="noopener noreferrer" target="_blank" href={`http://${text}`}>
                {text}
              </a>
            ) : (
              <a rel="noopener noreferrer" target="_self" href={`http://${text}`}>
                {text}
              </a>
            )}
            {/* <a rel="noopener noreferrer" target="_blank" href={`http://${text}`}>
              {text}
            </a> */}
          </div>
        ) : (
          '-'
        )
      }
    },
    {
      title: '网站备案/许可证号',
      dataIndex: 'BeiAn',
      key: 'BeiAn',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '网站名称',
      dataIndex: 'Title',
      key: 'Title',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '审核日期',
      dataIndex: 'SDate',
      key: 'SDate',
      width: 160,
      render: (text, record, index) => formatDate(text) || '-'
    }
  ]

  // 知识产权_专利-完成
  const property_zl = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '名称',
      dataIndex: 'Title',
      key: 'Title',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '专利类型',
      dataIndex: 'KindCodeDesc',
      key: 'KindCodeDesc',
      width: 100
    },
    {
      title: '申请号/专利号',
      dataIndex: 'ApplicationNumber',
      key: 'ApplicationNumber',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '法律状态',
      dataIndex: 'LegalStatusDesc',
      key: 'LegalStatusDesc',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '申请日期',
      dataIndex: 'ApplicationDate',
      key: 'ApplicationDate',
      width: 160,
      render: (text, record, index) => formatDate(text) || '-'
    },
    {
      title: '公开(公告)日期',
      dataIndex: 'PublicationDate',
      key: 'PublicationDate',
      width: 160,
      render: (text, record, index) => formatDate(text) || '-'
    }
  ]

  /* 其他 */
  // 其他_新闻舆情-完成
  const others_xwyq = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
      width: 300,
      render: (text, record) => {
        return record.Url ? (
          <div className={styles.news}>
            {isPc ? (
              <a rel="noopener noreferrer" target="_blank" href={`${record.Url}`}>
                {text}
              </a>
            ) : (
              <a rel="noopener noreferrer" target="_self" href={`${record.Url}`}>
                {text}
              </a>
            )}
            {/* <a rel="noopener noreferrer" target="_blank" href={`${record.Url}`}>
              {text}
            </a> */}
          </div>
        ) : (
          text || '-'
        )
      }
    },
    {
      title: '来源',
      dataIndex: 'Source',
      key: 'Source',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '时间',
      dataIndex: 'PublishTime',
      key: 'PublishTime',
      width: 200,
      render: (text, record, index) => formatDate(text) || '-'
    }
  ]

  // 其他_招聘信息-完成
  const others_zpxx = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '职位名称',
      dataIndex: 'Title',
      key: 'Title',
      width: 300,
      render: (text, record, index) => {
        return text ? (
          <div className={styles.clickStatus} onClick={() => handleTitleLink(record.id)}>
            {text}
          </div>
        ) : (
          '-'
        )
      }
    },
    {
      title: '工作地点',
      dataIndex: 'ProvinceDesc',
      key: 'ProvinceDesc',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '月薪',
      dataIndex: 'Salary',
      key: 'Salary',
      width: 200,
      render: (text) => isEmpty(text)
    },
    {
      title: '发布日期',
      dataIndex: 'PublishDate',
      key: 'PublishDate',
      width: 200,
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
          <div className={styles.headerTitle}>风控报告</div>
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
          <div
            className={styles.right}
            style={{ background: `url(${riskbg}) `, backgroundSize: 'cover' }}
          >
            <div className={styles.scoreTitle}>风控评分</div>
            <div className={styles.score}>{info.score}</div>
          </div>
          {/* <div>
            <img src={riskbg} alt='' />
            <div className={styles.scoreTitle}>风控评分</div>
            <div className={styles.score}>{info.score}</div>
          </div> */}
        </div>
      </div>
    )
  }

  const changeTab = (activeKey) => {
    setActiveTab(activeKey)
  }

  const tabList = [
    {
      tab: '经营状况',
      key: 'statusMap'
    },
    {
      tab: '企业关联人风险',
      key: 'relateMap'
    },
    {
      tab: '关联企业风险',
      key: 'companyMap'
    },
    {
      tab: '知识产权',
      key: 'propertyMap'
    },
    {
      tab: '其他',
      key: 'othersMap'
    }
  ]

  const renderTabItem = () => {
    switch (activeTab) {
      case 'statusMap':
        return (
          <div className={styles.subBlock}>
            {statusMap.map((item, index) => {
              return (
                <div className={styles.block} onClick={() => handleClick(item.id)}>
                  {item.name}
                  <span className={styles.num}>{item.amount}</span>
                </div>
              )
            })}
          </div>
        )

      case 'relateMap':
        return (
          <div className={styles.subBlock}>
            {relateMap.map((item, index) => {
              return (
                <div className={styles.block} onClick={() => handleClick(item.id)}>
                  {item.name}
                  <span className={styles.num}>{item.amount}</span>
                </div>
              )
            })}
          </div>
        )

      case 'companyMap':
        return (
          <div className={styles.subBlock}>
            {companyMap.map((item, index) => {
              return (
                <div className={styles.block} onClick={() => handleClick(item.id)}>
                  {item.name}
                  <span className={styles.num}>{item.amount}</span>
                </div>
              )
            })}
          </div>
        )

      case 'propertyMap':
        return (
          <div className={styles.subBlock}>
            {propertyMap.map((item, index) => {
              return (
                <div className={styles.block} onClick={() => handleClick(item.id)}>
                  {item.name}
                  <span className={styles.num}>{item.amount}</span>
                </div>
              )
            })}
          </div>
        )

      case 'othersMap':
        return (
          <div className={styles.subBlock}>
            {othersMap.map((item, index) => {
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

  // 经营风险
  const renderStatus = () => {
    return (
      <div>
        <Card
          style={{ marginTop: 16 }}
          title={<CardTitle title="经营状况" icon="iconjingyingzhuangkuang" />}
        >
          <ReportTable
            id="jyzk_rzxx"
            columns={jyfxColumns.jyfx_rzxx}
            title="融资信息"
            data={info.rzxx}
          />
          <ReportTable
            id="jyzk_dkgs"
            columns={jyfxColumns.jyfx_dkgs}
            title="地块公示"
            data={info.dkgs}
          />
          <ReportTable
            id="jyzk_gdxx"
            columns={jyfxColumns.jyfx_gdxx}
            title="购地信息"
            data={info.gdxx}
          />
          <ReportTable
            id="jyzk_tdzr"
            columns={jyfxColumns.jyfx_tdzr}
            title="土地转让"
            data={info.tdzr}
          />
          <ReportTable
            id="jyzk_zqxx"
            columns={jyfxColumns.jyfx_zqxx}
            title="债券信息"
            data={info.zqxx}
          />
          <ReportTable
            id="jyzk_xzxkgsj"
            columns={jyfxColumns.jyfx_xzxk}
            title="行政许可"
            data={info.xzxk}
          />
          <ReportTable
            id="jyzk_ccjc"
            columns={jyfxColumns.jyfx_ccjc}
            title="抽查检查"
            data={info.ccjc}
          />
          <ReportTable
            id="jyzk_swxy"
            columns={jyfxColumns.jyfx_swxy}
            title="税务信用"
            data={info.swxy}
          />
          <ReportTable
            id="jyzk_ztbxx"
            columns={jyfxColumns.jyfx_ztbxx}
            title="招投标信息"
            data={info.ztbxx}
          />
          <ReportTable
            id="jyzk_khcx"
            columns={jyfxColumns.jyfx_khcx}
            title="客户"
            data={info.khcx}
          />
          <ReportTable
            id="jyzk_gyscx"
            columns={jyfxColumns.jyfx_gyscx}
            title="供应商"
            data={info.gyscx}
          />
        </Card>
      </div>
    )
  }

  // 关联人风险
  const renderRelateRisk = () => {
    return (
      <div>
        <Card
          style={{ marginTop: 16 }}
          title={<CardTitle title="关联人风险" icon="iconguanlianren" />}
        >
          <ReportTable
            id="relate_frbg"
            columns={glrfxColumns.glrfx_frgb}
            title="法人变更"
            data={
              info.glrfx?.frbg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_gdbg"
            columns={glrfxColumns.glrfx_gdbg}
            title="股东变更"
            data={
              info.glrfx?.gdbg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_sx"
            columns={glrfxColumns.glrfx_sx}
            title="失信被执行人"
            data={
              info.glrfx?.sx?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_bzx"
            columns={glrfxColumns.glrfx_bzx}
            title="被执行人"
            data={
              info.glrfx?.bzx?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_ktgg"
            columns={glrfxColumns.glrfx_ktgg}
            title="开庭公告"
            data={
              info.glrfx?.ktgg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_cpws"
            columns={glrfxColumns.glrfx_cpws}
            title="裁判文书"
            data={
              info.glrfx?.cpws?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_sfpm"
            columns={glrfxColumns.glrfx_sfpm}
            title="司法拍卖"
            data={
              info.glrfx?.sfpm?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_jyyc"
            columns={glrfxColumns.glrfx_jyyc}
            title="经营异常"
            data={
              info.glrfx?.jyyc?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_gqcz"
            columns={glrfxColumns.glrfx_gqcz}
            title="股权出质"
            data={
              info.glrfx?.gqcz?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_dcdy"
            columns={glrfxColumns.glrfx_dcdy}
            title="动产抵押"
            data={
              info.glrfx?.dcdy?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_gqdj"
            columns={glrfxColumns.glrfx_gqdj}
            title="股权冻结"
            data={
              info.glrfx?.gqdj?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_xzcf"
            columns={glrfxColumns.glrfx_xzcf}
            title="行政处罚"
            data={
              info.glrfx?.xzcf?.map((item) => {
                return item
              }) || []
            }
          />
        </Card>
      </div>
    )
  }

  // 关联企业风险
  const renderCompanyRisk = () => {
    return (
      <div>
        <Card
          style={{ marginTop: 16 }}
          title={<CardTitle title="关联企业风险" icon="iconguanlianqiye" />}
        >
          <ReportTable
            id="company_frbg"
            columns={glqyfxColumns.glqyfx_frbg}
            title="法人变更"
            data={
              info.glqyfx?.frbg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_gdbg"
            columns={glqyfxColumns.glqyfx_gdbg}
            title="股东变更"
            data={
              info.glqyfx?.gdbg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_sx"
            columns={glqyfxColumns.glqyfx_sx}
            title="失信被执行人"
            data={
              info.glqyfx?.sx?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_bzx"
            columns={glqyfxColumns.glqyfx_bzx}
            title="被执行人"
            data={
              info.glqyfx?.bzx?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_ktgg"
            columns={glqyfxColumns.glqyfx_ktgg}
            title="开庭公告"
            data={
              info.glqyfx?.ktgg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_cpws"
            columns={glqyfxColumns.glqyfx_cpws}
            title="裁判文书"
            data={
              info.glqyfx?.cpws?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_sfpm"
            columns={glqyfxColumns.glqyfx_sfpm}
            title="司法拍卖"
            data={
              info.glqyfx?.sfpm?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_jyyc"
            columns={glqyfxColumns.glqyfx_jyyc}
            title="经营异常"
            data={
              info.glqyfx?.jyyc?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_gqcz"
            columns={glqyfxColumns.glqyfx_gqcz}
            title="股权出质"
            data={
              info.glqyfx?.gqcz?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_dcdy"
            columns={glqyfxColumns.glqyfx_dcdy}
            title="动产抵押"
            data={
              info.glqyfx?.dcdy?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_gqdj"
            columns={glqyfxColumns.glqyfx_gqdj}
            title="股权冻结"
            data={
              info.glqyfx?.gqdj?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_tdzy"
            columns={glqyfxColumns.glqyfx_tddy}
            title="土地抵押"
            data={
              info.glqyfx?.tddy?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_xzcf"
            columns={glqyfxColumns.glqyfx_xzcf}
            title="行政处罚"
            data={
              info.glqyfx?.xzcf?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_hbcf"
            columns={glqyfxColumns.glqyfx_hbcf}
            title="环保处罚"
            data={
              info.glqyfx?.hbcf?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_sswf"
            columns={glqyfxColumns.glqyfx_sswf}
            title="税收违法"
            data={
              info.glqyfx?.sswf?.map((item) => {
                return item
              }) || []
            }
          />
        </Card>
      </div>
    )
  }

  // 知识产权
  const renderProperty = () => {
    return (
      <div>
        <Card style={{ marginTop: 16 }} title={<CardTitle title="知识产权" />}>
          <ReportTable id="property_brand" columns={property_brand} title="商标" data={info.sb} />
          <ReportTable
            id="property_zzqrz"
            columns={property_zzqrz}
            title="软件著作权"
            data={info.rjzzq}
          />
          <ReportTable
            id="property_gswz"
            columns={property_gswzxx}
            title="公司网站信息"
            data={info.gswz}
          />
          <ReportTable id="property_zl" columns={property_zl} title="专利" data={info.zl} />
        </Card>
      </div>
    )
  }

  // 其他
  const renderOthers = () => {
    return (
      <div>
        <Card style={{ marginTop: 16 }} title={<CardTitle title="其他" />}>
          <ReportTable id="others_xwyq" columns={others_xwyq} title="新闻舆情" data={info.xwyq} />
          <ReportTable id="others_zpxx" columns={others_zpxx} title="招聘信息" data={info.zpxx} />
        </Card>
      </div>
    )
  }

  // 关联人弹框
  const modalGlrfxColumns = {
    // 法人变更
    frbgColumns: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '变更前法人信息',
        dataIndex: 'BeforeOper.Name',
        key: 'BeforeOper.Name',
        width: 160,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '变更后法人信息',
        dataIndex: 'AfterOper.Name',
        key: 'AfterOper.Name',
        width: 160,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '变更日期',
        dataIndex: 'ChangeDate',
        key: 'ChangeDate',
        width: 160,
        render: (text) => isEmpty(formatDate(text))
      }
    ],
    // 股东变更
    gdbgColumns: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '变更前法人信息',
        width: 160,
        render: (text, record) => {
          return record.OldPartners.length > 0
            ? record.OldPartners.map((item) => {
                return (
                  <TitleLink
                    val={item.Name}
                    num={item.StockPercent}
                    origin={modalCompany}
                  ></TitleLink>
                )
              })
            : '-'
        }
      },
      {
        title: '变更后法人信息',
        width: 160,
        render: (text, record) => {
          return record.NewPartners.length > 0
            ? record.NewPartners.map((item) => {
                return (
                  <TitleLink
                    val={item.Name}
                    num={item.StockPercent}
                    origin={modalCompany}
                  ></TitleLink>
                )
              })
            : '-'
        }
      },
      {
        title: '变更日期',
        dataIndex: 'ChangeDate',
        key: 'ChangeDate',
        width: 160,
        render: (text) => isEmpty(formatDate(text))
      }
    ],
    // 失信被执行人
    sxColumns: [
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
        title: '被执行人履行情况',
        dataIndex: 'Executestatus',
        key: 'Executestatus',
        width: 140,
        render: (text) => isEmpty(text)
      },
      {
        title: '执行法院',
        dataIndex: 'Executegov',
        key: 'Executegov',
        width: 100,
        render: (text) => isEmpty(text)
      },
      {
        title: '做出执行依据单位',
        dataIndex: 'Executeunite',
        key: 'Executeunite',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '发布时间',
        dataIndex: 'Publicdate',
        key: 'Publicdate',
        width: 160,
        render: (text) => isEmpty(formatDate(text))
      }
    ],
    // 被执行人
    bzxColumns: [
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
    ],
    // 开庭公告
    ktggColumns: [
      {
        title: '序号',
        width: 40,
        render: (text, record) => `${record.index}`
      },
      {
        title: '案号',
        dataIndex: 'CaseNo',
        key: 'CaseNo',
        width: 80,
        render: (text) => isEmpty(text)
      },
      {
        title: '开庭时间',
        dataIndex: 'LianDate',
        key: 'LianDate',
        width: 80,
        render: (text, record, index) => isEmpty(formatDate(text))
      },
      {
        title: '案由',
        dataIndex: 'CaseReason',
        key: 'CaseReason',
        width: 80,
        render: (text) => isEmpty(text)
      },
      {
        title: '公诉人/原告/上诉人/申请人',
        dataIndex: 'Prosecutorlist',
        key: 'Prosecutorlist',
        width: 200,
        render: (text, record) => {
          return record.Prosecutorlist.length > 0
            ? record.Prosecutorlist.map((item) => {
                return <TitleLink val={item.Name} origin={modalCompany}></TitleLink>
              })
            : '-'
        }
      },
      {
        title: '被告人/被告/被上诉人/被申请人',
        dataIndex: 'Defendantlist',
        key: 'Defendantlist',
        width: 200,
        render: (text, record) => {
          return record.Defendantlist.length > 0
            ? record.Defendantlist.map((item) => {
                return <TitleLink val={item.Name} origin={modalCompany}></TitleLink>
              })
            : '-'
        }
      }
    ],
    // 裁判文书
    cpwsColumns: [
      {
        title: '序号',
        width: 40,
        render: (text, record) => `${record.index}`
      },
      {
        title: '案号',
        dataIndex: 'CaseNo',
        key: 'CaseNo',
        width: 150,
        render: (text) => isEmpty(text)
      },
      {
        title: '案件名称',
        dataIndex: 'CaseName',
        key: 'CaseName',
        width: 150,
        render: (text) => isEmpty(text)
      },
      {
        title: '案由',
        dataIndex: 'CaseReason',
        key: 'CaseReason',
        width: 100,
        render: (text) => isEmpty(text)
      },
      {
        title: '发布日期',
        dataIndex: 'SubmitDate',
        key: 'SubmitDate',
        width: 120,
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
    ],
    // 司法拍卖
    sfpmColumns: [
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
        render: (text) => isEmpty(text)
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
    ],
    // 经营异常
    jyycColumns: [
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
    ],
    // 股权出质
    gqczColumns: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '登记编号',
        dataIndex: 'RegistNo',
        key: 'RegistNo',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '质权人',
        width: 160,
        render: (text, record) => {
          return record.PledgeeInfo ? (
            <TitleLink val={record.PledgeeInfo.Name} origin={modalCompany}></TitleLink>
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
            <TitleLink val={record.PledgorInfo.Name} origin={modalCompany}></TitleLink>
          ) : (
            '-'
          )
        }
      },
      {
        title: '出质股权数',
        dataIndex: 'PledgedAmount',
        key: 'PledgedAmount',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '状态',
        dataIndex: 'Status',
        key: 'Status',
        width: 100,
        render: (text) => isEmpty(text)
      },
      {
        title: '登记日期',
        dataIndex: 'RegDate',
        key: 'RegDate',
        width: 120,
        render: (text, record, index) => isEmpty(formatDate(text))
      }
    ],
    // 动产抵押
    dcdyColumns: [
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
    ],
    // 股权冻结
    gqdjColumns: [
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
        // render: (text) => isEmpty(text)
        render: (text, record) => {
          return text ? <TitleLink val={text} origin={modalCompany}></TitleLink> : '-'
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
  }

  // 关联企业弹框
  const modalGlqyfxColumns = {
    // 法人变更
    frbgColumns: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '变更前法人信息',
        dataIndex: 'BeforeOper.Name',
        key: 'BeforeOper.Name',
        width: 160,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '变更后法人信息',
        dataIndex: 'AfterOper.Name',
        key: 'AfterOper.Name',
        width: 160,
        render: (text) => {
          return text ? <TitleLink val={text} type="human"></TitleLink> : '-'
        }
      },
      {
        title: '变更日期',
        dataIndex: 'ChangeDate',
        key: 'ChangeDate',
        width: 160,
        render: (text) => isEmpty(formatTime(text, 'ymd'))
      }
    ],
    // 股东变更
    gdbgColumns: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '变更前法人信息',
        width: 160,
        render: (text, record) => {
          return record.OldPartners.length > 0
            ? record.OldPartners.map((item) => {
                return (
                  <TitleLink
                    val={item.Name}
                    num={item.StockPercent}
                    origin={modalCompany}
                  ></TitleLink>
                )
              })
            : '-'
        }
      },
      {
        title: '变更后法人信息',
        width: 160,
        render: (text, record) => {
          return record.NewPartners.length > 0
            ? record.NewPartners.map((item) => {
                return (
                  <TitleLink
                    val={item.Name}
                    num={item.StockPercent}
                    origin={modalCompany}
                  ></TitleLink>
                )
              })
            : '-'
        }
      },
      {
        title: '变更日期',
        dataIndex: 'ChangeDate',
        key: 'ChangeDate',
        width: 160,
        render: (text) => isEmpty(formatDate(formatTime(text)))
      }
    ],
    // 失信被执行人
    sxColumns: [
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
        title: '被执行人履行情况',
        dataIndex: 'Executestatus',
        key: 'Executestatus',
        width: 140,
        render: (text) => isEmpty(text)
      },
      {
        title: '执行法院',
        dataIndex: 'Executegov',
        key: 'Executegov',
        width: 100,
        render: (text) => isEmpty(text)
      },
      {
        title: '做出执行依据单位',
        dataIndex: 'Executeunite',
        key: 'Executeunite',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '发布时间',
        dataIndex: 'Publicdate',
        key: 'Publicdate',
        width: 160,
        render: (text) => isEmpty(formatDate(text))
      }
    ],
    // 被执行人
    bzxColumns: [
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
    ],
    // 开庭公告
    ktggColumns: [
      {
        title: '序号',
        width: 40,
        render: (text, record) => `${record.index}`
      },
      {
        title: '案号',
        dataIndex: 'CaseNo',
        key: 'CaseNo',
        width: 80,
        render: (text) => isEmpty(text)
      },
      {
        title: '开庭时间',
        dataIndex: 'LianDate',
        key: 'LianDate',
        width: 80,
        render: (text, record, index) => isEmpty(formatDate(text))
      },
      {
        title: '案由',
        dataIndex: 'CaseReason',
        key: 'CaseReason',
        width: 80,
        render: (text) => isEmpty(text)
      },
      {
        title: '公诉人/原告/上诉人/申请人',
        dataIndex: 'Prosecutorlist',
        key: 'Prosecutorlist',
        width: 200,
        render: (text, record) => {
          return record.Prosecutorlist.length > 0
            ? record.Prosecutorlist.map((item) => {
                return <TitleLink val={item.Name} origin={modalCompany}></TitleLink>
              })
            : '-'
        }
      },
      {
        title: '被告人/被告/被上诉人/被申请人',
        dataIndex: 'Defendantlist',
        key: 'Defendantlist',
        width: 200,
        render: (text, record) => {
          return record.Defendantlist.length > 0
            ? record.Defendantlist.map((item) => {
                return <TitleLink val={item.Name} origin={modalCompany}></TitleLink>
              })
            : '-'
        }
      }
    ],
    // 裁判文书
    cpwsColumns: [
      {
        title: '序号',
        width: 40,
        render: (text, record) => `${record.index}`
      },
      {
        title: '案号',
        dataIndex: 'CaseNo',
        key: 'CaseNo',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '案件名称',
        dataIndex: 'CaseName',
        key: 'CaseName',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '案由',
        dataIndex: 'CaseReason',
        key: 'CaseReason',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '发布日期',
        dataIndex: 'SubmitDate',
        key: 'SubmitDate',
        width: 120,
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
        width: 120,
        render: (text) => isEmpty(text)
      }
    ],
    // 司法拍卖
    sfpmColumns: [
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
        render: (text) => isEmpty(text)
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
    ],
    // 经营异常
    jyycColumns: [
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
        width: 120,
        render: (text, record, index) => isEmpty(formatDate(text))
      },
      {
        title: '移出经营异常原因',
        dataIndex: 'RomoveReason',
        key: 'RomoveReason',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '移出日期',
        dataIndex: 'RemoveDate',
        key: 'RemoveDate',
        width: 120,
        render: (text, record, index) => isEmpty(formatDate(text))
      },
      {
        title: '作出决定机关',
        dataIndex: 'DecisionOffice',
        key: 'DecisionOffice',
        width: 120,
        render: (text) => isEmpty(text)
      }
    ],
    // 股权出质
    gqczColumns: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '登记编号',
        dataIndex: 'RegistNo',
        key: 'RegistNo',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '质权人',
        width: 120,
        render: (text, record) => {
          return record.PledgeeInfo ? (
            <TitleLink val={record.PledgeeInfo.Name} origin={modalCompany}></TitleLink>
          ) : (
            '-'
          )
        }
      },
      {
        title: '出质人',
        dataIndex: 'PledgorInfo',
        key: 'PledgorInfo',
        width: 120,
        render: (text, record) => {
          return record.PledgorInfo ? (
            <TitleLink val={record.PledgorInfo.Name} origin={modalCompany}></TitleLink>
          ) : (
            '-'
          )
        }
      },
      {
        title: '出质股权数',
        dataIndex: 'PledgedAmount',
        key: 'PledgedAmount',
        width: 120,
        render: (text) => isEmpty(text)
      },
      {
        title: '状态',
        dataIndex: 'Status',
        key: 'Status',
        width: 80,
        render: (text) => isEmpty(text)
      },
      {
        title: '登记日期',
        dataIndex: 'RegDate',
        key: 'RegDate',
        width: 120,
        render: (text, record, index) => isEmpty(formatDate(text))
      }
    ],
    // 动产抵押
    dcdyColumns: [
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
    ],
    // 股权冻结
    gqdjColumns: [
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
          return text ? <TitleLink val={text} origin={modalCompany}></TitleLink> : '-'
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
    ],
    // 土地抵押
    tddyColumns: [
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
    ],
    // 行政处罚
    xzcfColumns: [
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
        width: 150,
        render: (text) => isEmpty(text)
      },
      {
        title: '行政处罚内容',
        dataIndex: 'Content',
        key: 'Content',
        width: 100,
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
        width: 80,
        render: (text, record, index) => isEmpty(formatDate(text))
      }
    ],
    // 环保处罚
    hbcfColumns: [
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
    ],
    // 税收违法
    sswfColumns: [
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
  }

  const renderModal = () => {
    return (
      <React.Fragment>
        {/* 债券信息详情 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="债券信息详情"
          visible={zqxx_OpenModal}
          onOk={() => setZqxxOpenModal(false)}
          onCancel={() => setZqxxOpenModal(false)}
          destroyOnClose={true}
        >
          <div className={styles.descWrap}>
            <Descriptions bordered column={2} className="desc">
              <DescriptionsItem label="债券名称" span={3}>
                {isEmpty(modalData?.FullName)}
              </DescriptionsItem>
              <DescriptionsItem label="债券简称" span={3}>
                {isEmpty(modalData?.ShortName)}
              </DescriptionsItem>
              <DescriptionsItem label={<div style={{ width: 120 }}>债券代码</div>}>
                {isEmpty(modalData?.BondCode)}
              </DescriptionsItem>
              <DescriptionsItem label={<div style={{ width: 120 }}>债券类型</div>}>
                {isEmpty(modalData?.BondType)}
              </DescriptionsItem>
              <DescriptionsItem label="债券面值">{isEmpty(modalData?.BondValue)}</DescriptionsItem>
              <DescriptionsItem label="债券年限(年)">
                {isEmpty(modalData?.YearLimit)}
              </DescriptionsItem>
              <DescriptionsItem label="票面利率(%)">
                {isEmpty(modalData?.InterestRate)}
              </DescriptionsItem>
              <DescriptionsItem label="到期日">
                {isEmpty(formatDate(modalData?.MaturityDate))}
              </DescriptionsItem>
              <DescriptionsItem label="兑付日">
                {isEmpty(formatDate(modalData?.MaturityDate))}
              </DescriptionsItem>
              <DescriptionsItem label="摘牌日">
                {isEmpty(formatDate(modalData?.DelistDate))}
              </DescriptionsItem>
              <DescriptionsItem label="利率说明" span={3}>
                {isEmpty(modalData?.RateIntroduce)}
              </DescriptionsItem>
              <DescriptionsItem label="计息方式">
                {isEmpty(modalData?.PlanBreathWay)}
              </DescriptionsItem>
              <DescriptionsItem label="付息方式">
                {isEmpty(modalData?.ServicingWay)}
              </DescriptionsItem>
              <DescriptionsItem label="起息日期">{isEmpty(modalData?.PayoutDate)}</DescriptionsItem>
              <DescriptionsItem label="止息日期">{isEmpty(modalData?.CeaseDate)}</DescriptionsItem>
              <DescriptionsItem label="年付息次数">
                {isEmpty(modalData?.AnnualInterestRate)}
              </DescriptionsItem>
              <DescriptionsItem label="付息日期">
                {isEmpty(modalData?.InterestPaymentDate)}
              </DescriptionsItem>
              <DescriptionsItem label="发行价格(元)">
                {isEmpty(modalData?.OfferingPrice)}
              </DescriptionsItem>
              <DescriptionsItem label="发行规模(元)">
                {isEmpty(modalData?.Issuance)}
              </DescriptionsItem>
              <DescriptionsItem label="发行日期">
                {isEmpty(modalData?.ReleaseDate)}
              </DescriptionsItem>
              <DescriptionsItem label="上市日期">{isEmpty(modalData?.LaunchDate)}</DescriptionsItem>
              <DescriptionsItem label="上市场所">
                {isEmpty(modalData?.PublicPlaces)}
              </DescriptionsItem>
              <DescriptionsItem label="信用等级">
                {isEmpty(modalData?.CreditRating)}
              </DescriptionsItem>
            </Descriptions>
          </div>
        </Modal>
        {/* 关联人风险-法人变更 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="法人变更信息"
          visible={glrfx_frbg_OpenModal}
          onOk={() => setGlrFrbgOpenModal(false)}
          onCancel={() => setGlrFrbgOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_frbg_tk"
            columns={modalGlrfxColumns.frbgColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联人风险-股东变更 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="股东变更信息"
          visible={glrfx_gdbg_OpenModal}
          onOk={() => setGlrGdbgOpenModal(false)}
          onCancel={() => setGlrGdbgOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_gdbg_tk"
            columns={modalGlrfxColumns.gdbgColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联人风险-失信被执行人 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="失信被执行人信息"
          visible={glrfx_sx_OpenModal}
          onOk={() => setGlrSxOpenModal(false)}
          onCancel={() => setGlrSxOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_sx_tk"
            columns={modalGlrfxColumns.sxColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联人风险-被执行人 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="被执行人信息"
          visible={glrfx_bzx_OpenModal}
          onOk={() => setGlrBzxOpenModal(false)}
          onCancel={() => setGlrBzxOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_bzx_tk"
            columns={modalGlrfxColumns.bzxColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联人风险-开庭公告 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="开庭公告信息"
          visible={glrfx_ktgg_OpenModal}
          onOk={() => setGlrKtggOpenModal(false)}
          onCancel={() => setGlrKtggOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_ktgg_tk"
            columns={modalGlrfxColumns.ktggColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联人风险-裁判文书 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="裁判文书信息"
          visible={glrfx_cpws_OpenModal}
          onOk={() => setGlrCpwsOpenModal(false)}
          onCancel={() => setGlrCpwsOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_cpws_tk"
            columns={modalGlrfxColumns.cpwsColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联人风险-司法拍卖 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="司法拍卖信息"
          visible={glrfx_sfpm_OpenModal}
          onOk={() => setGlrSfpmOpenModal(false)}
          onCancel={() => setGlrSfpmOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_sfpm_tk"
            columns={modalGlrfxColumns.sfpmColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联人风险-经营异常 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="经营异常信息"
          visible={glrfx_jyyc_OpenModal}
          onOk={() => setGlrJyycOpenModal(false)}
          onCancel={() => setGlrJyycOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_jyyc_tk"
            columns={modalGlrfxColumns.jyycColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联人风险-股权出质 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="股权出质信息"
          visible={glrfx_gqcz_OpenModal}
          onOk={() => setGlrGqczOpenModal(false)}
          onCancel={() => setGlrGqczOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_gqcz_tk"
            columns={modalGlrfxColumns.gqczColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联人风险-动产抵押 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="动产抵押信息"
          visible={glrfx_dcdy_OpenModal}
          onOk={() => setGlrDcdyOpenModal(false)}
          onCancel={() => setGlrDcdyOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_dcdy_tk"
            columns={modalGlrfxColumns.dcdyColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联人风险-股权冻结 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="股权冻结信息"
          visible={glrfx_gqdj_OpenModal}
          onOk={() => setGlrGqdjOpenModal(false)}
          onCancel={() => setGlrGqdjOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glrfx_gqdj_tk"
            columns={modalGlrfxColumns.gqdjColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>

        {/* 关联企业风险 */}
        {/* 关联企业风险-法人变更 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="法人变更信息"
          visible={glqyfx_frbg_OpenModal}
          onOk={() => setGlqyFrbgOpenModal(false)}
          onCancel={() => setGlqyFrbgOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_frbg_tk"
            columns={modalGlqyfxColumns.frbgColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-股东变更 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="股东变更信息"
          visible={glqyfx_gdbg_OpenModal}
          onOk={() => setGlqyGdbgOpenModal(false)}
          onCancel={() => setGlqyGdbgOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_gdbg_tk"
            columns={modalGlqyfxColumns.gdbgColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-失信被执行人 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="失信被执行人信息"
          visible={glqyfx_sx_OpenModal}
          onOk={() => setGlqySxOpenModal(false)}
          onCancel={() => setGlqySxOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_sx_tk"
            columns={modalGlqyfxColumns.sxColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-被执行人 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="被执行人信息"
          visible={glqyfx_bzx_OpenModal}
          onOk={() => setGlqyBzxOpenModal(false)}
          onCancel={() => setGlqyBzxOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_bzx_tk"
            columns={modalGlqyfxColumns.bzxColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-开庭公告 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="开庭公告信息"
          visible={glqyfx_ktgg_OpenModal}
          onOk={() => setGlqyKtggOpenModal(false)}
          onCancel={() => setGlqyKtggOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_ktgg_tk"
            columns={modalGlqyfxColumns.ktggColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-裁判文书 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="裁判文书信息"
          visible={glqyfx_cpws_OpenModal}
          onOk={() => setGlqyCpwsOpenModal(false)}
          onCancel={() => setGlqyCpwsOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_cpws_tk"
            columns={modalGlqyfxColumns.cpwsColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-司法拍卖 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="司法拍卖信息"
          visible={glqyfx_sfpm_OpenModal}
          onOk={() => setGlqySfpmOpenModal(false)}
          onCancel={() => setGlqySfpmOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_sfpm_tk"
            columns={modalGlqyfxColumns.sfpmColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-经营异常 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="经营异常信息"
          visible={glqyfx_jyyc_OpenModal}
          onOk={() => setGlqyJyycOpenModal(false)}
          onCancel={() => setGlqyJyycOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_jyyc_tk"
            columns={modalGlqyfxColumns.jyycColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-股权出质 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="股权出质信息"
          visible={glqyfx_gqcz_OpenModal}
          onOk={() => setGlqyGqczOpenModal(false)}
          onCancel={() => setGlqyGqczOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_gqcz_tk"
            columns={modalGlqyfxColumns.gqczColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-动产抵押 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="动产抵押信息"
          visible={glqyfx_dcdy_OpenModal}
          onOk={() => setGlqyDcdyOpenModal(false)}
          onCancel={() => setGlqyDcdyOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_dcdy_tk"
            columns={modalGlqyfxColumns.dcdyColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-股权冻结 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="股权冻结信息"
          visible={glqyfx_gqdj_OpenModal}
          onOk={() => setGlqyGqdjOpenModal(false)}
          onCancel={() => setGlqyGqdjOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_gqdj_tk"
            columns={modalGlqyfxColumns.gqdjColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-土地抵押 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="土地抵押信息"
          visible={glqyfx_tddy_OpenModal}
          onOk={() => setGlqyTddyOpenModal(false)}
          onCancel={() => setGlqyTddyOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_tddy_tk"
            columns={modalGlqyfxColumns.tddyColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-行政处罚 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="行政处罚信息"
          visible={glqyfx_xzcf_OpenModal}
          onOk={() => setGlqyXzcfOpenModal(false)}
          onCancel={() => setGlqyXzcfOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_xzcf_tk"
            columns={modalGlqyfxColumns.xzcfColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-环保处罚 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="环保处罚信息"
          visible={glqyfx_hbcf_OpenModal}
          onOk={() => setGlqyHbcfOpenModal(false)}
          onCancel={() => setGlqyHbcfOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_hbcf_tk"
            columns={modalGlqyfxColumns.hbcfColumns}
            data={modalData}
            companyName={modalCompany}
          />
        </Modal>
        {/* 关联企业风险-税收违法 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="税收违法信息"
          visible={glqyfx_sswf_OpenModal}
          onOk={() => setGlqySswfOpenModal(false)}
          onCancel={() => setGlqySswfOpenModal(false)}
          destroyOnClose={true}
        >
          <ModalTable
            id="glqyfx_sswf_tk"
            columns={modalGlqyfxColumns.sswfColumns}
            data={modalData}
            companyName={modalCompany}
          />
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
        {renderStatus()}
        {renderRelateRisk()}
        {renderCompanyRisk()}
        {renderProperty()}
        {renderOthers()}
        {renderModal()}
      </>
    )
  }

  return (
    // <Spin spinning={fetching}>
    <div className={styles.reportWrap}>{info.name && renderReport()}</div>
    /* </Spin> */
  )
}

export default RiskReport
