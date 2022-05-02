import React, { useState, useEffect } from 'react'
import Link from 'umi/link'
import { useRequest } from '@dragon/hooks'
import { Tag, Card, Modal, Descriptions, Spin } from 'antd'
import IconFont from '@/components/IconFont'
import CardTitle from '../Components/CardTitle'
import ModalTable from '../Components/ModalTable'
import ReportTable from '../Components/ReportTable'
import Statement from '../Components/Statement'
import GlobalMenu from '../Components/GlobalMenu'
import SliderChart from '../Components/SliderChart'
import TitleLink from '../Components/TitleLink'
import {
  fetchReportList,
  fetchReportDetail,
  fetchIndustry,
  fetchBizStatus
} from '@/services/microSubsidy/report'
import EmptyReport from '../Components/EmptyReport'
import { formatTime, formatDate, formatMoney, windowOpen } from '@/utils'
import riskbg from '@/assets/risk.png'
import styles from '../styles.less'

const DescriptionsItem = Descriptions.Item

const Report = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  // const info = {}
  // const fetching = false
  // const industryData = []
  // 获取报告详情
  const { data: info = {}, loading: fetching } = useRequest(() =>
    fetchReportList({ bizNo: id, reportType: 'RISK_REPORT' })
  )

  useEffect(() => {
    isPC()
  }, [])

  // 获取行业数据
  const { data: industryData = [] } = useRequest(() => fetchIndustry())

  const isEmpty = (val) => {
    return val !== '' && val !== null && val !== undefined ? val : '-'
  }

  // 判断数据是否存在&上限
  const isZero = (val) => {
    const max = 50
    return val ? (val === max ? `${max}+` : val) : '0'
  }

  // 业务评估数据判断
  const isEmptyForBusiness = (val) => {
    if (val) {
      return formatMoney(val)
    }
    return '-'
  }

  const [isPc, setIsPc] = useState(false) // 判断是否为PC端
  const [modalData, setModalData] = useState({}) // 设置弹框数据
  const [zqxx_OpenModal, setZqxxOpenModal] = useState(false) // 债券信息弹框
  const [sx_OpenModal, setSxOpenModal] = useState(false) // 失信被执行人弹框
  const [sshy_OpenModal, setSshyOpenModal] = useState(false) // 所属行业弹框
  const [modalCompany, setModalCompany] = useState('') // 弹框对应公司
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

  if (!info) {
    return (
      <div>
        <EmptyReport />
      </div>
    )
  }

  const {
    qyxx = {}, // 企业信息
    jyxx = {}, // 经营信息
    zcxx = {}, // 财务状况
    xyzk = {}, // 信用状况
    fdbxx = {}, // 反担保信息
    frxx = {} // 法人信息
  } = info

  const menuMap = [
    // 企业信息(4+2)
    {
      name: '企业信息',
      key: '0',
      id: 'qyxx',
      children: [
        {
          name: '工商信息',
          id: 'gsxx',
          children: [
            {
              // 列表形式,无数据条数
              name: '基本信息',
              id: 'gsxx_jbxx',
              amount: ''
            },
            {
              name: '变更记录',
              id: 'gsxx_bgjl',
              amount: isZero(qyxx?.gsxx?.bgjl?.length)
            },
            {
              name: '投资人及出资信息',
              id: 'gsxx_czxx',
              amount: isZero(qyxx?.gsxx?.czxx?.length)
            },
            {
              name: '主要人员',
              id: 'gsxx_zyry',
              amount: isZero(qyxx?.gsxx?.zyry?.length)
            }
          ]
        },
        {
          name: '银行账户信息',
          children: [
            {
              name: '基本户',
              id: 'yhzhxx_jbh',
              amount: qyxx?.yhzh?.jbh?.length
            },
            {
              name: '一般户',
              id: 'yhzhxx_ybh',
              amount: qyxx?.yhzh?.ybh?.length
            }
          ]
        }
      ]
    },
    // 经营信息(13+13+2(2)+2)
    {
      name: '经营信息',
      key: '1',
      id: 'jyxx',
      children: [
        {
          name: '经营状况',
          id: 'jyxx_jyzk',
          children: [
            {
              name: '融资信息',
              id: 'jyzk_rzxx',
              amount: isZero(jyxx?.jyzk?.rzxx?.length)
            },
            {
              name: '地块公示',
              id: 'jyzk_dkgs',
              amount: isZero(jyxx?.jyzk?.dkgs?.length)
            },
            {
              name: '购地信息',
              id: 'jyzk_gdxx',
              amount: isZero(jyxx?.jyzk?.gdxx?.length)
            },
            {
              name: '土地转让',
              id: 'jyzk_tdzr',
              amount: isZero(jyxx?.jyzk?.tdzr?.length)
            },
            {
              name: '债券信息',
              id: 'jyzk_zqxx',
              amount: isZero(jyxx?.jyzk?.zqxx?.length)
            },
            {
              name: '行政许可',
              id: 'jyzk_xzxkgsj',
              amount: isZero(jyxx?.jyzk?.xzxk?.length)
            },
            {
              name: '抽查检查',
              id: 'jyzk_ccjc',
              amount: isZero(jyxx?.jyzk?.ccjc?.length)
            },
            {
              name: '招投标信息',
              id: 'jyzk_ztbxx',
              amount: isZero(jyxx?.jyzk?.ztbxx?.length)
            },
            {
              name: '纳税信用等级', // 源-反欺诈-工商信息
              id: 'jyzk_nsxydj',
              amount: isZero(jyxx?.jyzk?.nsxy?.length)
            },
            {
              name: '纳税信息', //add
              id: 'jyzk_nsxx',
              amount: isZero(jyxx?.jyzk?.nsxx?.length)
            },
            {
              name: '对公流水', //add
              id: 'jyzk_dgls',
              amount: isZero(jyxx?.jyzk?.dgls?.length)
            },
            {
              name: '新闻舆情',
              id: 'jyzk_xwyq',
              amount: isZero(jyxx?.jyzk?.xwyq?.length)
            },
            {
              name: '招聘信息',
              id: 'jyzk_zpxx',
              amount: isZero(jyxx?.jyzk?.zpxx?.length)
            }
          ]
        },
        {
          name: '经营风险',
          id: 'jyxx_jyfx',
          children: [
            {
              name: '经营异常',
              id: 'jyfx_jyyc',
              amount: isZero(jyxx?.jyfx?.jyyc?.length)
            },
            {
              name: '司法拍卖',
              id: 'jyfx_sfpm',
              amount: isZero(jyxx?.jyfx?.sfpm?.length)
            },
            {
              name: '土地抵押',
              id: 'jyfx_tddy',
              amount: isZero(jyxx?.jyfx?.tddy?.length)
            },
            {
              name: '环保处罚',
              id: 'jyfx_hbcf',
              amount: isZero(jyxx?.jyfx?.hbcf?.length)
            },
            {
              name: '动产抵押',
              id: 'jyfx_dcdy',
              amount: isZero(jyxx?.jyfx?.dcdy?.length)
            },
            {
              name: '严重违法',
              id: 'jyfx_yzwf',
              amount: isZero(jyxx?.jyfx?.yzwf?.length)
            },
            {
              name: '欠税公告',
              id: 'jyfx_qsgg',
              amount: isZero(jyxx?.jyfx?.qsgg?.length)
            },
            {
              name: '清算信息',
              id: 'jyfx_qsxx',
              amount: isZero(jyxx?.jyfx?.qsxx?.length)
            },
            {
              name: '简易注销',
              id: 'jyfx_jyzx',
              amount: isZero(jyxx?.jyfx?.jyzx?.length)
            },
            {
              name: '公示催告',
              id: 'jyfx_ggcs',
              amount: isZero(jyxx?.jyfx?.ggcs?.length)
            },
            {
              name: '税收违法',
              id: 'jyfx_sswf',
              amount: isZero(jyxx?.jyfx?.sswf?.length)
            },
            {
              name: '股权出质',
              id: 'jyfx_gqcz',
              amount: isZero(jyxx?.jyfx?.gqcz?.length)
            },
            {
              name: '行政处罚',
              id: 'jyfx_xzcf',
              amount: isZero(jyxx?.jyfx?.xzcf?.length)
            }
          ]
        },
        {
          name: '供销关系',
          id: 'jyxx_gxgx',
          children: [
            {
              name: '供应商',
              id: 'gxgx_gys',
              amount: jyxx?.gxgx?.gys?.useGfsq
                ? isZero(jyxx?.gxgx?.gys?.gfsq?.length)
                : isZero(jyxx?.gxgx?.gys?.zzsb?.length)
            },
            {
              name: '客户',
              id: 'gxgx_kh',
              amount: jyxx?.gxgx?.gys?.useGfsq
                ? isZero(jyxx?.gxgx?.kh?.gfsq?.length)
                : isZero(jyxx?.gxgx?.kh?.zzsb?.length)
            }
          ]
        },
        {
          name: '财务信息',
          id: 'jyxx_cwxx',
          children: [
            {
              name: '财务状况',
              id: 'cwxx_cwzk',
              amount: isZero(jyxx?.cwxx?.cwzk?.length)
            },
            {
              name: '偿债能力',
              id: 'cwxx_cznl',
              amount: isZero(jyxx?.cwxx?.cznl?.length)
            }
          ]
        }
      ]
    },
    // 资产信息(3+4)
    {
      name: '资产信息',
      key: '2',
      id: 'zcxx',
      children: [
        {
          name: '固定资产',
          id: 'zcxx_gdzc',
          children: [
            {
              name: '房产',
              id: 'gdzc_fc',
              amount: isZero(zcxx.gdzc?.fc?.length)
            },
            {
              name: '车辆',
              id: 'gdzc_cl',
              amount: isZero(zcxx.gdzc?.cl?.length)
            },
            {
              name: '其他',
              id: 'gdzc_qt',
              amount: isZero(zcxx.gdzc?.qt?.length)
            }
          ]
        },
        {
          name: '知识产权',
          id: 'zcxx_zscq',
          children: [
            {
              name: '商标',
              id: 'zscq_sb',
              amount: isZero(zcxx.zscq?.sb?.length)
            },
            {
              name: '软件著作权',
              id: 'zscq_rjzzq',
              amount: isZero(zcxx.zscq?.rjzzq?.length)
            },
            {
              name: '公司网站信息',
              id: 'zscq_gswz',
              amount: isZero(zcxx.zscq?.gswz?.length)
            },
            {
              name: '专利',
              id: 'zscq_zl',
              amount: isZero(zcxx.zscq?.zl?.length)
            }
          ]
        }
      ]
    },
    // 信用状况(2+6+15+10)
    {
      name: '信用状况',
      key: '3',
      id: 'xyzk',
      children: [
        // 企业征信
        {
          name: '企业征信',
          id: 'xyzk_qyzx',
          children: [
            {
              name: '信贷信息',
              id: 'qyzx_xdxx',
              amount: isZero(xyzk?.qyzx?.xdxx?.length)
            },
            {
              name: '其余借款情况',
              id: 'qyzx_jkxx',
              amount: isZero(xyzk?.qyzx?.qyjk?.length)
            }
          ]
        },
        // 涉诉信息
        {
          name: '涉诉信息',
          id: 'xyzk_ssxx',
          children: [
            {
              name: '开庭公告',
              id: 'ssxx_ktgg',
              amount: isZero(xyzk.ssxx?.ktgg?.length)
            },
            {
              name: '裁判文书',
              id: 'ssxx_cpws',
              amount: isZero(xyzk.ssxx?.cpws?.length)
            },
            {
              name: '法院公告',
              id: 'ssxx_fygg',
              amount: isZero(xyzk.ssxx?.fygg?.length)
            },
            {
              name: '失信被执行人',
              id: 'ssxx_sx',
              amount: isZero(xyzk.ssxx?.sx?.length)
            },
            {
              name: '被执行人',
              id: 'ssxx_bzx',
              amount: isZero(xyzk.ssxx?.bzx?.length)
            },
            {
              name: '股权冻结',
              id: 'ssxx_gqdj',
              amount: isZero(xyzk.ssxx?.gqdj?.length)
            }
          ]
        },
        // 股权关联企业风险
        {
          name: '股权关联企业风险',
          id: 'xyzk_glqyfx',
          children: [
            {
              name: '法人变更',
              amount: isZero(xyzk.glqyfx?.frbg?.length),
              id: 'company_frbg'
            },
            {
              name: '大股东变更',
              amount: isZero(xyzk.glqyfx?.gdbg?.length),
              id: 'company_gdbg'
            },
            {
              name: '失信被执行人',
              amount: isZero(xyzk.glqyfx?.sx?.length),
              id: 'company_sx'
            },
            {
              name: '被执行人',
              amount: isZero(xyzk.glqyfx?.bzx?.length),
              id: 'company_bzx'
            },
            {
              name: '开庭公告',
              amount: isZero(xyzk.glqyfx?.ktgg?.length),
              id: 'company_ktgg'
            },
            {
              name: '裁判文书',
              amount: isZero(xyzk.glqyfx?.cpws?.length),
              id: 'company_cpws'
            },
            {
              name: '司法拍卖',
              amount: isZero(xyzk.glqyfx?.sfpm?.length),
              id: 'company_sfpm'
            },
            {
              name: '经营异常',
              amount: isZero(xyzk.glqyfx?.jyyc?.length),
              id: 'company_jyyc'
            },
            {
              name: '股权出质',
              amount: isZero(xyzk.glqyfx?.gqcz?.length),
              id: 'company_gqcz'
            },
            {
              name: '动产抵押',
              amount: isZero(xyzk.glqyfx?.dcdy?.length),
              id: 'company_dcdy'
            },
            {
              name: '股权冻结',
              amount: isZero(xyzk.glqyfx?.gqdj?.length),
              id: 'company_gqdj'
            },
            {
              name: '行政处罚',
              amount: isZero(xyzk.glqyfx?.xzcf?.length),
              id: 'company_xzcf'
            },
            {
              name: '土地抵押',
              amount: isZero(xyzk.glqyfx?.tddy?.length),
              id: 'company_tddy'
            },
            {
              name: '环保处罚',
              amount: isZero(xyzk.glqyfx?.hbcf?.length),
              id: 'company_hbcf'
            },
            {
              name: '税收违法',
              amount: isZero(xyzk.glqyfx?.sswf?.length),
              id: 'company_sswf'
            }
          ]
        },
        // 股权关联人风险
        {
          name: '股权关联人风险',
          id: 'xyzk_glrfx',
          children: [
            {
              name: '法人变更',
              amount: isZero(xyzk.glrfx?.frbg?.length),
              id: 'relate_frbg'
            },
            {
              name: '大股东变更',
              amount: isZero(xyzk.glrfx?.gdbg?.length),
              id: 'relate_gdbg'
            },
            {
              name: '失信被执行人',
              amount: isZero(xyzk.glrfx?.sx?.length),
              id: 'relate_sx'
            },
            {
              name: '被执行人',
              amount: isZero(xyzk.glrfx?.bzx?.length),
              id: 'relate_bzx'
            },
            {
              name: '开庭公告',
              amount: isZero(xyzk.glrfx?.ktgg?.length),
              id: 'relate_ktgg'
            },
            {
              name: '裁判文书',
              amount: isZero(xyzk.glrfx?.cpws?.length),
              id: 'relate_cpws'
            },
            {
              name: '司法拍卖',
              amount: isZero(xyzk.glrfx?.sfpm?.length),
              id: 'relate_sfpm'
            },
            {
              name: '经营异常',
              amount: isZero(xyzk.glrfx?.jyyc?.length),
              id: 'relate_jyyc'
            },
            {
              name: '股权出质',
              amount: isZero(xyzk.glrfx?.gqcz?.length),
              id: 'relate_gqcz'
            },
            {
              name: '动产抵押',
              amount: isZero(xyzk.glrfx?.dcdy?.length),
              id: 'relate_dcdy'
            },
            {
              name: '股权冻结',
              amount: isZero(xyzk.glrfx?.gqdj?.length),
              id: 'relate_gqdj'
            },
            {
              name: '行政处罚',
              amount: isZero(xyzk.glrfx?.xzcf?.length),
              id: 'relate_xzcf'
            }
          ]
        }
      ]
    },
    // 反担保企业(2)
    {
      name: '反担保信息',
      key: '4',
      id: 'fdbxx',
      children: [
        {
          name: '反担保企业',
          id: 'fdbxx_fdbqy',
          children: [
            {
              name: '反担保记录',
              id: 'fdbqy_fdbjl',
              amount: isZero(fdbxx?.qy?.length)
            }
          ]
        },
        {
          name: '反担保个人',
          id: 'fdbxx_fdbgr',
          children: [
            {
              name: '反担保记录',
              id: 'fdbgr_fdbjl',
              amount: isZero(fdbxx?.gr?.length)
            }
          ]
        }
      ]
    },
    // 法人/实控人及其关联人信息
    {
      name: '法人/实控人及其关联人信息',
      key: '5',
      id: 'frxx',
      children: [
        {
          name: '人员信息',
          id: 'frxx_ryxx',
          children: [
            {
              name: '基本信息',
              id: 'ryxx_jbxx',
              amount: isZero(frxx.ryxx?.jbxx?.length)
            }
          ]
        },
        {
          name: '个人流水',
          id: 'frxx_grls',
          children: [
            {
              name: '流水信息',
              id: 'grls_lsxx',
              amount: isZero(frxx.grls?.lsxx?.length)
            }
          ]
        },
        {
          name: '固定资产',
          id: 'frxx_gdzc',
          children: [
            {
              name: '房产',
              id: 'frxx_gdzc_fc',
              amount: isZero(frxx.gdzc?.fc?.length)
            },
            {
              name: '车辆',
              id: 'frxx_gdzc_cl',
              amount: isZero(frxx.gdzc?.cl?.length)
            },
            {
              name: '其他',
              id: 'frxx_gdzc_qt',
              amount: isZero(frxx.gdzc?.qt?.length)
            }
          ]
        },
        {
          name: '信用状况',
          id: 'frxx_xyzk',
          children: [
            {
              name: '信用卡信息',
              id: 'xyzk_xykxx',
              amount: isZero(frxx.xyzk?.xykxx?.length)
            },
            {
              name: '信贷信息',
              id: 'xyzk_xdxx',
              amount: isZero(frxx.xyzk?.xdxx?.length)
            },
            {
              name: '其余借款情况',
              id: 'xyzk_qyjk',
              amount: isZero(frxx.xyzk?.qyjk?.length)
            }
          ]
        }
      ]
    }
  ]

  // 判断是否为PC端
  const isPC = () => {
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

  // 计算数额
  const test = (n) => {
    n = n * 100
    if (!isNaN(n) && n !== Infinity) {
      return n.toFixed(2) + '%'
    } else {
      return '-'
    }
  }

  // 获取债券信息详情
  const getZqxxData = (id) => {
    fetchReportDetail({ detailType: 'zqxx', id: id }).then((res) => {
      if (res instanceof Error) return
      setModalData(res.detail)
      setZqxxOpenModal(true)
    })
  }

  // 获取招聘信息Url
  const handleTitleLink = (id) => {
    fetchReportDetail({ detailType: 'zpxx', id: id }).then((res) => {
      if (res instanceof Error) return
      // window.open(res.detail.Url)
      windowOpen(res.detail.Url)
    })
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

  // 融资编号跳转
  const handleBizLink = (bizNo) => {
    fetchBizStatus({ bizNo: bizNo }).then((res) => {
      if (res instanceof Error) return
      let url = ''
      // res：true=贷后
      url = res ? `/msPostLoan/management/view/${bizNo}` : `/msFinance/view/${bizNo}`
      // isPc ? window.open(url) : window.open(url, '_self')
      isPc ? windowOpen(url) : window.open(url, '_self')
    })
  }

  // 企业信息-(add: 银行账户信息-基本户&一般户)
  const qyxxTable = {
    // 工商信息(变更记录&投资人及出资信息&主要人员)
    gsxxColumns: {
      // 变更记录
      bgjlColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '变更日期',
          dataIndex: 'ChangeDate',
          key: 'ChangeDate',
          width: 120,
          render: (text, record, index) => isEmpty(formatDate(text))
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
      ],
      // 投资人及出资信息
      tzrColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '认缴出资金额(万元人民币)',
          dataIndex: 'ShouldCapi',
          key: 'ShouldCapi',
          width: 160,
          align: 'right',
          render: (text) => isEmpty(text)
        },
        {
          title: '出资比例',
          dataIndex: 'StockPercent',
          key: 'StockPercent',
          width: 160,
          render: (text) => isEmpty(text)
        }
      ],
      // 主要人员
      zyryColumns: [
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
          render: (text) => isEmpty(text)
        }
      ]
    },
    // 知识产权(商标&软件著作权&公司网站信息&专利)
    zscqColumns: {
      // 商标
      sbColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '流程状态',
          dataIndex: 'FlowStatusDesc',
          key: 'FlowStatusDesc',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '申请日期',
          dataIndex: 'AppDate',
          key: 'AppDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 软件著作权
      rjzzqColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '登记号',
          dataIndex: 'RegisterNo',
          key: 'RegisterNo',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '登记批准日期',
          dataIndex: 'RegisterAperDate',
          key: 'RegisterAperDate',
          width: 200,
          render: (text, record, index) => isEmpty(formatDate(text))
        },
        {
          title: '版本号',
          dataIndex: 'VersionNo',
          key: 'VersionNo',
          width: 160,
          render: (text) => isEmpty(text)
        }
      ],
      // 公司网站信息
      gswzColumns: [
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
          render: (text) => isEmpty(text)
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
          render: (text) => isEmpty(text)
        },
        {
          title: '网站名称',
          dataIndex: 'Title',
          key: 'Title',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '审核日期',
          dataIndex: 'SDate',
          key: 'SDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 专利
      zlColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '专利类型',
          dataIndex: 'KindCodeDesc',
          key: 'KindCodeDesc',
          width: 100,
          render: (text) => isEmpty(text)
        },
        {
          title: '申请号/专利号',
          dataIndex: 'ApplicationNumber',
          key: 'ApplicationNumber',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '法律状态',
          dataIndex: 'LegalStatusDesc',
          key: 'LegalStatusDesc',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '申请日期',
          dataIndex: 'ApplicationDate',
          key: 'ApplicationDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        },
        {
          title: '公开(公告)日期',
          dataIndex: 'PublicationDate',
          key: 'PublicationDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ]
    },
    // add-银行账户信息(基本户&一般户)
    yhzhColumns: {
      // 基本户(add)
      jbzhColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '银行账号',
          dataIndex: 'bankNumber',
          key: 'bankNumber',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '开户银行',
          dataIndex: 'openBank',
          key: 'openBank',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '开户省市',
          width: 120,
          render: (text, record) => {
            return (
              <div>
                {record.openProvince} {record.openCity}
              </div>
            )
          }
        },
        {
          title: '所属支行',
          dataIndex: 'openSubBranch',
          key: 'openSubBranch',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 一般户(add)
      ybzhColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '银行账号',
          dataIndex: 'bankNumber',
          key: 'bankNumber',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '开户银行',
          dataIndex: 'openBank',
          key: 'openBank',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '开户省市',
          width: 120,
          render: (text, record) => {
            return (
              <div>
                {record.openProvince} {record.openCity}
              </div>
            )
          }
        },
        {
          title: '所属支行',
          dataIndex: 'openSubBranch',
          key: 'openSubBranch',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ]
    }
  }

  // 经营信息(add: 纳税信息&对公流水&供应商2&客户2)
  const jyxxTable = {
    // 经营状况(对应风控报告)-(add:纳税信息(综合官方&内部企业)&对公流水)
    jyzkColumns: {
      // 融资信息
      rzxxColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '融资轮次',
          dataIndex: 'Round',
          key: 'Round',
          width: 100,
          render: (text) => isEmpty(text)
        },
        {
          title: '融资金额',
          dataIndex: 'Amount',
          key: 'Amount',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '投资方',
          dataIndex: 'Investment',
          key: 'Investment',
          width: 200,
          render: (text, record) => {
            return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
          }
        },
        {
          title: '投资日期',
          dataIndex: 'Date',
          key: 'Date',
          width: 80,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 地块公示
      dkgsColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '发布机关',
          dataIndex: 'PublishGov',
          key: 'PublishGov',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '行政区',
          dataIndex: 'AdminArea',
          key: 'AdminArea',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '发布日期',
          dataIndex: 'PublishDate',
          key: 'PublishDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 购地信息
      gdxxColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '土地用途',
          dataIndex: 'LandUse',
          key: 'LandUse',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '总面积(公顷)',
          dataIndex: 'Area',
          key: 'Area',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '行政区',
          dataIndex: 'AdminArea',
          key: 'AdminArea',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '供应方式',
          dataIndex: 'SupplyWay',
          key: 'SupplyWay',
          width: 80,
          render: (text) => isEmpty(text)
        },
        {
          title: '签订日期',
          dataIndex: 'SignTime',
          key: 'SignTime',
          width: 80,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 土地转让
      tdzrColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '行政区',
          dataIndex: 'AdminArea',
          key: 'AdminArea',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '原土地使用人',
          dataIndex: 'OldOwner.Name',
          key: 'OldOwner.Name',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '现有土地使用人',
          dataIndex: 'NewOwner.Name',
          key: 'NewOwner.Name',
          width: 160,
          render: (text) => isEmpty(text)
        }
      ],
      // 债券信息
      zqxxColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '债券类型',
          dataIndex: 'BondType',
          key: 'BondType',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '发行日期',
          dataIndex: 'ReleaseDate',
          key: 'ReleaseDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        },
        {
          title: '上市日期',
          dataIndex: 'LaunchDate',
          key: 'LaunchDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 行政许可
      xzxkColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '许可文件名称',
          dataIndex: 'LicensDocName',
          key: 'LicensDocName',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '有效期自',
          dataIndex: 'ValidityFrom',
          key: 'ValidityFrom',
          width: 120,
          render: (text, record, index) => isEmpty(formatDate(text))
        },
        {
          title: '有效期至',
          dataIndex: 'ValidityTo',
          key: 'ValidityTo',
          width: 120,
          render: (text, record, index) => isEmpty(formatDate(text))
        },
        {
          title: '许可机关',
          dataIndex: 'LicensOffice',
          key: 'LicensOffice',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '许可内容',
          dataIndex: 'LicensContent',
          key: 'LicensContent',
          width: 240,
          render: (text) => isEmpty(text)
        }
      ],
      // 抽查检查
      ccjcColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '结果',
          dataIndex: 'Consequence',
          key: 'Consequence',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '检查实施机关',
          dataIndex: 'ExecutiveOrg',
          key: 'ExecutiveOrg',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '日期',
          dataIndex: 'Date',
          key: 'Date',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 招投标信息
      ztbxxColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '所属地区',
          dataIndex: 'ProvinceName',
          key: 'ProvinceName',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '项目分类',
          dataIndex: 'ChannelName',
          key: 'ChannelName',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '发布日期',
          dataIndex: 'Pubdate',
          key: 'Pubdate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 纳税信用等级
      nsxydjColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '纳税人名称',
          dataIndex: 'Name',
          key: 'Name',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '评价年度',
          dataIndex: 'Year',
          key: 'Year',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '信用等级',
          dataIndex: 'Level',
          key: 'Level',
          width: 160,
          render: (text) => isEmpty(text)
        }
      ],
      // 纳税信息(add)
      nsxxColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '纳税人识别号',
          dataIndex: 'socialCreditCode',
          key: 'socialCreditCode',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '纳税人名称',
          dataIndex: 'orgName',
          key: 'orgName',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '累计实缴金额(元)',
          dataIndex: 'taxAmount',
          key: 'taxAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 对公流水(add)
      dglsColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '近一年收支差额(元)',
          dataIndex: 'orgFlowAmount',
          key: 'orgFlowAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '月均收支差额(元)',
          dataIndex: 'orgFlowAvgAmount',
          key: 'orgFlowAvgAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 新闻舆情
      xwyqColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '时间',
          dataIndex: 'PublishTime',
          key: 'PublishTime',
          width: 200,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 招聘信息
      zpxxColumns: [
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
    },
    // 经营风险
    jyfxColumns: {
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
      // 严重违法
      yzwfColumns: [
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
          title: '移出严重违法原因',
          dataIndex: 'RemoveReason',
          key: 'RemoveReason',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '移出日期',
          dataIndex: 'RemoveDate',
          key: 'RemoveDate',
          width: 200,
          render: (text, record, index) => isEmpty(formatDate(text))
        },
        {
          title: '作出决定机关',
          dataIndex: 'RemoveOffice',
          key: 'RemoveOffice',
          width: 160,
          render: (text) => isEmpty(text)
        }
      ],
      // 欠税公告
      qsggColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '欠税余额',
          dataIndex: 'Amount',
          key: 'Amount',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '当前新发生欠税',
          dataIndex: 'NewAmount',
          key: 'NewAmount',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '发布单位',
          dataIndex: 'IssuedBy',
          key: 'IssuedBy',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '发布日期',
          dataIndex: 'PublishDate',
          key: 'PublishDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 清算信息
      qsxxColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '清算组成员',
          dataIndex: 'Member',
          key: 'Member',
          width: 200,
          render: (text) => isEmpty(text)
        }
      ],
      // 简易注销
      jyzxColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '公告期',
          dataIndex: 'PublicDate',
          key: 'PublicDate',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '异议申请人',
          dataIndex: 'DissentPerson',
          key: 'DissentPerson',
          width: 120,
          render: (text, record) => {
            return record.DissentPerson?.length > 0
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
            return record.DissentDate?.length > 0
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
            return record.DissentContent?.length > 0
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
            return record.ResultContent?.length > 0
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
            return record.ResultListPublicDate?.length > 0
              ? record.ResultListPublicDate.map((item) => {
                  return item
                })
              : '-'
          }
        }
      ],
      // 公示催告
      gscgColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '票据类型',
          dataIndex: 'BillType',
          key: 'BillType',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '企业名称',
          dataIndex: 'Name',
          key: 'Name',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '票面金额',
          dataIndex: 'BillAmt',
          key: 'BillAmt',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '公告日期',
          dataIndex: 'PublishDate',
          key: 'PublishDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
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
    },
    // 供销关系(add: 供应商&客户)
    gxgxColumns: {
      // 供应商(官方授权)
      gysgfColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '企业全称',
          dataIndex: 'companyName',
          key: 'companyName',
          width: 160,
          render: (text, record) => {
            return text ? <TitleLink val={text} origin={info.name} /> : '-'
          }
        },
        {
          title: '近一年交易金额(元)',
          dataIndex: 'lastTotalTrade',
          key: 'lastTotalTrade',
          align: 'right',
          width: 120,
          render: (text) => isEmpty(formatMoney(text))
        },
        {
          title: '占比',
          dataIndex: 'proportion',
          key: 'proportion',
          width: 100,
          render: (text) => isEmpty(text)
        },
        {
          title: '获取日期',
          dataIndex: 'updateTime',
          key: 'updateTime',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 供应商(自主上报)
      gyszzColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '企业全称',
          dataIndex: 'companyName',
          key: 'companyName',
          width: 160,
          render: (text, record) => {
            return text ? <TitleLink val={text} origin={info.name} /> : '-'
          }
        },
        {
          title: '近一年交易金额(元)',
          dataIndex: 'lastTotalTrade',
          key: 'lastTotalTrade',
          align: 'right',
          width: 120,
          render: (text) => isEmpty(formatMoney(text))
        },
        {
          title: '合作时长',
          dataIndex: 'cooperationTime',
          key: 'cooperationTime',
          width: 100,
          render: (text) => isEmpty(text)
        },
        {
          title: '更新日期',
          dataIndex: 'updateTime',
          key: 'updateTime',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 客户(官方授权)
      khgfColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '企业全称',
          dataIndex: 'companyName',
          key: 'companyName',
          width: 160,
          render: (text, record) => {
            return text ? <TitleLink val={text} origin={info.name} /> : '-'
          }
        },
        {
          title: '近一年交易金额(元)',
          dataIndex: 'lastTotalTrade',
          key: 'lastTotalTrade',
          align: 'right',
          width: 120,
          render: (text) => isEmpty(formatMoney(text))
        },
        {
          title: '占比',
          dataIndex: 'proportion',
          key: 'proportion',
          width: 100,
          render: (text) => isEmpty(text)
        },
        {
          title: '获取日期',
          dataIndex: 'updateTime',
          key: 'updateTime',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 客户(自主上报)
      khzzColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '企业全称',
          dataIndex: 'companyName',
          key: 'companyName',
          width: 160,
          render: (text, record) => {
            return text ? <TitleLink val={text} origin={info.name} /> : '-'
          }
        },
        {
          title: '近一年交易金额(元)',
          dataIndex: 'lastTotalTrade',
          key: 'lastTotalTrade',
          align: 'right',
          width: 120,
          render: (text) => isEmpty(formatMoney(text))
        },
        {
          title: '合作时长',
          dataIndex: 'cooperationTime',
          key: 'cooperationTime',
          width: 100,
          render: (text) => isEmpty(text)
        },
        {
          title: '更新日期',
          dataIndex: 'updateTime',
          key: 'updateTime',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ]
    },
    // 财务信息
    cwxxColumns: {
      // 财务状况
      cwzkColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '上一年度营业额(元)',
          dataIndex: 'lastYearBizAmount',
          key: 'lastYearBizAmount',
          align: 'right',
          width: 160,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '上一年度税务报表净利润(元)',
          dataIndex: 'lastYearProfit',
          key: 'lastYearProfit',
          align: 'right',
          width: 160,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 偿债能力
      cznlColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '资产负债率',
          width: 120,
          align: 'right',
          render: (text, record) => test(record.finDebtAmount / record.finAssetAmount)
        },
        {
          title: '流动比率',
          width: 120,
          align: 'right',
          render: (text, record) => test(record.finFlowAsset / record.finFlowDebt)
        },
        {
          title: '速动比率',
          width: 120,
          align: 'right',
          render: (text, record) =>
            test((record.finFlowAsset - record.finStock) / record.finFlowDebt)
        },
        {
          title: '存货周转率',
          width: 120,
          align: 'right',
          render: (text, record) => test(record.finCost / record.finAvgStock)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ]
    }
  }

  // 资产信息(add: 固定资产&知识产权)
  const zcxxTable = {
    // 固定资产
    gdzcColumns: {
      // 房产
      fcColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '市场预估总价(元)',
          dataIndex: 'orgAssetsHouseAmount',
          key: 'orgAssetsHouseAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '抵押总额(元)',
          dataIndex: 'orgAssetsHouseMortgageAmount',
          key: 'orgAssetsHouseMortgageAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 车辆
      clColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '市场预估总价(元)',
          dataIndex: 'orgAssetsCarAmount',
          key: 'orgAssetsCarAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '抵押总额(元)',
          dataIndex: 'orgAssetsCarMortgageAmount',
          key: 'orgAssetsCarMortgageAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 其他
      qtColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '市场预估总价(元)',
          dataIndex: 'orgAssetsOtherAmount',
          key: 'orgAssetsOtherAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '抵押总额(元)',
          dataIndex: 'orgAssetsOtherMortgageAmount',
          key: 'orgAssetsOtherMortgageAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ]
    },
    // 知识产权
    zscqColumns: {
      // 商标
      sbColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '流程状态',
          dataIndex: 'FlowStatusDesc',
          key: 'FlowStatusDesc',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '申请日期',
          dataIndex: 'AppDate',
          key: 'AppDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 软件著作权
      rjzzqColumns: [
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
          render: (text) => isEmpty(text)
        },
        {
          title: '登记号',
          dataIndex: 'RegisterNo',
          key: 'RegisterNo',
          width: 200,
          render: (text) => isEmpty(text)
        },
        {
          title: '登记批准日期',
          dataIndex: 'RegisterAperDate',
          key: 'RegisterAperDate',
          width: 200,
          render: (text, record, index) => isEmpty(formatDate(text))
        },
        {
          title: '版本号',
          dataIndex: 'VersionNo',
          key: 'VersionNo',
          width: 160,
          render: (text) => isEmpty(text)
        }
      ],
      // 公司网站信息
      gswzxxColumns: [
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
          render: (text) => isEmpty(text)
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
          render: (text) => isEmpty(text)
        },
        {
          title: '网站名称',
          dataIndex: 'Title',
          key: 'Title',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '审核日期',
          dataIndex: 'SDate',
          key: 'SDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ],
      // 专利
      zlColumns: [
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
          render: (text) => isEmpty(text)
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
          render: (text) => isEmpty(text)
        },
        {
          title: '法律状态',
          dataIndex: 'LegalStatusDesc',
          key: 'LegalStatusDesc',
          width: 160,
          render: (text) => isEmpty(text)
        },
        {
          title: '申请日期',
          dataIndex: 'ApplicationDate',
          key: 'ApplicationDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        },
        {
          title: '公开(公告)日期',
          dataIndex: 'PublicationDate',
          key: 'PublicationDate',
          width: 160,
          render: (text, record, index) => isEmpty(formatDate(text))
        }
      ]
    }
  }

  // 信用状况(add: 企业征信)
  const xyzkTable = {
    // 企业征信
    qyzxColumns: {
      // 信贷信息
      xdxxColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '在贷总额(元)',
          dataIndex: 'orgCreditAmount',
          key: 'orgCreditAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '不良/违约总额(元)',
          dataIndex: 'orgCreditDueAmount',
          key: 'orgCreditDueAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 其余借款情况
      qyjkxxColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '借款笔数',
          dataIndex: 'orgLoanNumber',
          key: 'orgLoanNumber',
          align: 'right',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '借款总额(元)',
          dataIndex: 'orgLoanAmount',
          key: 'orgLoanAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ]
    },
    // 涉诉信息
    ssxxColumns: {
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
            return record.Prosecutorlist?.length > 0
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
      ],
      // 法院公告
      fyggColumns: [
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
            return record.ProsecutorList?.length > 0
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
            return record.DefendantList?.length > 0
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
          render: (text, record, index) => {
            return text ? (
              <div
                className={styles.clickStatus}
                onClick={() => {
                  setModalData(xyzk.ssxx?.sx[index])
                  setSxOpenModal(true)
                }}
              >
                {text}
              </div>
            ) : (
              '-'
            )
          }
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
          render: (text, record, index) => isEmpty(formatDate(text))
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
            return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
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
    },
    // 股权关联企业风险
    glqyfxColumns: {
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
                {isZero(record.detail?.length)}
              </div>
            ) : (
              '0'
            )
          }
        }
      ],
      // 大股东变更
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
              </div>
            ) : (
              '0'
            )
          }
        }
      ]
    },
    // 股权关联人风险
    glrfxColumns: {
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
                {isZero(record.detail?.length)}
              </div>
            ) : (
              '0'
            )
          }
        }
      ],
      // 大股东变更
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
                {isZero(record.detail?.length)}
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
  }

  // 反担保信息(add: 反担保企业&反担保个人)
  const fdbxxTable = {
    // 反担保企业
    fdbqyColumns: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '企业全称',
        dataIndex: 'cgOrg',
        key: 'cgOrg',
        width: 120,
        render: (text, record) => {
          return text ? <TitleLink val={text} origin={info.name} /> : '-'
        }
      },
      {
        title: '反担保金额(元)',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: 120,
        render: (text) => isEmptyForBusiness(text)
      },
      {
        title: '担保编号',
        dataIndex: 'bizNo',
        key: 'bizNo',
        width: 120,
        render: (text) => {
          return text ? (
            <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
              {text}
            </div>
          ) : (
            '-'
          )
        }
      },
      {
        title: '反担保日期',
        dataIndex: 'date',
        key: 'date',
        width: 120,
        render: (text) => isEmpty(text)
      }
    ],
    // 反担保个人
    fdbgrColumns: [
      {
        title: '序号',
        render: (text, record) => `${record.index}`,
        width: 40
      },
      {
        title: '姓名',
        dataIndex: 'cgPersonName',
        key: 'cgPersonName',
        width: 120,
        render: (text, record) => {
          return text ? <TitleLink val={text} /> : '-'
        }
      },
      {
        title: '反担保金额(元)',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: 120,
        render: (text) => isEmptyForBusiness(text)
      },
      {
        title: '担保编号',
        dataIndex: 'bizNo',
        key: 'bizNo',
        width: 120,
        render: (text) => {
          return text ? (
            <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
              {text}
            </div>
          ) : (
            '-'
          )
        }
      },
      {
        title: '反担保日期',
        dataIndex: 'date',
        key: 'date',
        width: 120,
        render: (text) => isEmpty(text)
      }
    ]
  }

  // 法人/实控人及其关联人信息(add: 基本信息&个人资产&个人征信&个人流水&信用卡记录)
  const frxxTable = {
    // 人员信息
    ryxxColumns: {
      // 基本信息
      jbxxColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: 120,
          render: (text) => {
            return text ? <TitleLink val={text}></TitleLink> : '-'
          }
        },
        {
          title: '角色',
          dataIndex: 'role',
          key: 'role',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '身份证号',
          dataIndex: 'idCard',
          key: 'idCard',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          key: 'phone',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '关联企业',
          dataIndex: 'relatedCompany',
          key: 'relatedCompany',
          width: 120,
          render: (text) => {
            return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
          }
        }
      ]
    },
    // 个人流水
    grlsColumns: {
      // 流水信息
      lsxxColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '近一年收支差额(元)',
          dataIndex: 'personFlowAmount',
          key: 'personFlowAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '月均收支差额(元)',
          dataIndex: 'personFlowAvgAmount',
          key: 'personFlowAvgAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ]
    },
    // 固定资产
    gdzcColumns: {
      // 房产
      fcColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '市场预估总价(元)',
          dataIndex: 'personAssetsHouseAmount',
          key: 'personAssetsHouseAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '抵押总额(元)',
          dataIndex: 'personAssetsHouseMortgageAmount',
          key: 'personAssetsHouseMortgageAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 车辆
      clColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '市场预估总价(元)',
          dataIndex: 'personAssetsCarAmount',
          key: 'personAssetsCarAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '抵押总额(元)',
          dataIndex: 'personAssetsCarMortgageAmount',
          key: 'personAssetsCarMortgageAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 其他
      qtColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '市场预估总价(元)',
          dataIndex: 'personAssetsOtherAmount',
          key: 'personAssetsOtherAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '抵押总额(元)',
          dataIndex: 'personAssetsOtherMortgageAmount',
          key: 'personAssetsOtherMortgageAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ]
    },
    // 信用状况
    xyzkColumns: {
      // 信用卡信息
      xykxxColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '月平均消费金额(元)',
          dataIndex: 'creditAvgAmount',
          key: 'creditAvgAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '总逾期次数',
          dataIndex: 'creditDueCount',
          key: 'creditDueCount',
          align: 'right',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 信贷信息
      xdxxColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '在贷总额(元)',
          dataIndex: 'personCreditAmount',
          key: 'personCreditAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '不良/违约总额(元)',
          dataIndex: 'personCreditDueAmount',
          key: 'personCreditDueAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ],
      // 其余借款情况
      qyjkxxColumns: [
        {
          title: '序号',
          render: (text, record) => `${record.index}`,
          width: 40
        },
        {
          title: '借款笔数',
          dataIndex: 'personLoanNumber',
          key: 'personLoanNumber',
          align: 'right',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '借款总额(元)',
          dataIndex: 'personLoanAmount',
          key: 'personLoanAmount',
          align: 'right',
          width: 120,
          render: (text) => isEmptyForBusiness(text)
        },
        {
          title: '担保编号',
          dataIndex: 'bizNo',
          key: 'bizNo',
          width: 120,
          render: (text) => {
            return text ? (
              <div className={styles.clickStatus} onClick={() => handleBizLink(text)}>
                {text}
              </div>
            ) : (
              '-'
            )
          }
        },
        {
          title: '评估日期',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          render: (text) => isEmpty(text)
        },
        {
          title: '评估人',
          dataIndex: 'person',
          key: 'person',
          width: 120,
          render: (text) => isEmpty(text)
        }
      ]
    }
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
    // 大股东变更
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
          return record.OldPartners?.length > 0
            ? record.OldPartners.map((item) => {
                return (
                  <TitleLink val={item.Name} num={item.StockPercent} origin={info.name}></TitleLink>
                )
              })
            : '-'
        }
      },
      {
        title: '变更后法人信息',
        width: 160,
        render: (text, record) => {
          return record.NewPartners?.length > 0
            ? record.NewPartners.map((item) => {
                return (
                  <TitleLink val={item.Name} num={item.StockPercent} origin={info.name}></TitleLink>
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
          return record.Prosecutorlist?.length > 0
            ? record.Prosecutorlist.map((item) => {
                return <TitleLink val={item.Name} origin={info.name}></TitleLink>
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
          return record.Defendantlist?.length > 0
            ? record.Defendantlist.map((item) => {
                return <TitleLink val={item.Name} origin={info.name}></TitleLink>
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
        width: 140,
        render: (text) => isEmpty(text)
      },
      {
        title: '列入日期',
        dataIndex: 'AddDate',
        key: 'AddDate',
        width: 100,
        render: (text, record, index) => isEmpty(formatDate(text))
      },
      {
        title: '移出经营异常原因',
        dataIndex: 'RomoveReason',
        key: 'RomoveReason',
        width: 100,
        render: (text) => isEmpty(text)
      },
      {
        title: '移出日期',
        dataIndex: 'RemoveDate',
        key: 'RemoveDate',
        width: 100,
        render: (text, record, index) => isEmpty(formatDate(text))
      },
      {
        title: '作出决定机关',
        dataIndex: 'DecisionOffice',
        key: 'DecisionOffice',
        width: 100,
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
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
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
    // 大股东变更
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
          return record.OldPartners?.length > 0
            ? record.OldPartners.map((item) => {
                return (
                  <TitleLink val={item.Name} num={item.StockPercent} origin={info.name}></TitleLink>
                )
              })
            : '-'
        }
      },
      {
        title: '变更后法人信息',
        width: 160,
        render: (text, record) => {
          return record.NewPartners?.length > 0
            ? record.NewPartners.map((item) => {
                return (
                  <TitleLink val={item.Name} num={item.StockPercent} origin={info.name}></TitleLink>
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
          return record.Prosecutorlist?.length > 0
            ? record.Prosecutorlist.map((item) => {
                return <TitleLink val={item.Name} origin={info.name}></TitleLink>
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
          return record.Defendantlist?.length > 0
            ? record.Defendantlist.map((item) => {
                return <TitleLink val={item.Name} origin={info.name}></TitleLink>
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
        width: 140,
        render: (text) => isEmpty(text)
      },
      {
        title: '列入日期',
        dataIndex: 'AddDate',
        key: 'AddDate',
        width: 100,
        render: (text, record, index) => isEmpty(formatDate(text))
      },
      {
        title: '移出经营异常原因',
        dataIndex: 'RomoveReason',
        key: 'RomoveReason',
        width: 100,
        render: (text) => isEmpty(text)
      },
      {
        title: '移出日期',
        dataIndex: 'RemoveDate',
        key: 'RemoveDate',
        width: 100,
        render: (text, record, index) => isEmpty(formatDate(text))
      },
      {
        title: '作出决定机关',
        dataIndex: 'DecisionOffice',
        key: 'DecisionOffice',
        width: 100,
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
        width: 120,
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
          return text ? <TitleLink val={text} origin={info.name}></TitleLink> : '-'
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

  // 企业信息-工商信息-基本信息
  const renderBasicInfo = () => {
    return (
      <div id="gsxx_jbxx">
        <Descriptions title="基本信息" bordered column={2} style={{ marginBottom: 30 }}>
          <DescriptionsItem label={<div style={{ width: 180 }}>企业名称</div>}>
            <div style={{ width: 260 }}>{isEmpty(qyxx.gsxx?.jbxx?.Name)}</div>
          </DescriptionsItem>
          <DescriptionsItem label={<div style={{ width: 180 }}>工商注册号</div>}>
            {isEmpty(qyxx.gsxx?.jbxx?.No)}
          </DescriptionsItem>
          <DescriptionsItem label="统一社会信用代码">
            {isEmpty(qyxx.gsxx?.jbxx?.CreditCode)}
          </DescriptionsItem>
          <DescriptionsItem label="法人">
            {qyxx.gsxx?.jbxx?.OperName ? (
              <TitleLink val={qyxx.gsxx?.jbxx?.OperName} type="human"></TitleLink>
            ) : (
              '-'
            )}
          </DescriptionsItem>
          <DescriptionsItem label="组织机构代码">
            {isEmpty(qyxx.gsxx?.jbxx?.OrgNo)}
          </DescriptionsItem>
          <DescriptionsItem label="注册资本">
            {isEmpty(qyxx.gsxx?.jbxx?.RegistCapi)}
          </DescriptionsItem>
          <DescriptionsItem label="所属行业">
            <div
              className={styles.clickStatus}
              onClick={() => {
                setSshyOpenModal(true)
              }}
            >
              {isEmpty(qyxx.gsxx?.jbxx?.Industry)}
            </div>
          </DescriptionsItem>
          <DescriptionsItem label="企业类型">{isEmpty(qyxx.gsxx?.jbxx?.EconKind)}</DescriptionsItem>
          <DescriptionsItem label="经营状态">{isEmpty(qyxx.gsxx?.jbxx?.Status)}</DescriptionsItem>
          <DescriptionsItem label="成立日期">
            {isEmpty(formatDate(qyxx.gsxx?.jbxx?.StartDate))}
          </DescriptionsItem>
          <DescriptionsItem label="核准日期">
            {isEmpty(formatDate(qyxx.gsxx?.jbxx?.CheckDate))}
          </DescriptionsItem>
          <DescriptionsItem label="营业期限">
            {formatDate(qyxx.gsxx?.jbxx?.TermStart)}
            {qyxx.gsxx?.jbxx?.TermStart ? '-' : ''}
            {formatDate(qyxx.gsxx?.jbxx?.TermEnd) || '长期有效'}
          </DescriptionsItem>
          <DescriptionsItem label="登记机关" span={3}>
            {isEmpty(qyxx.gsxx?.jbxx?.BelongOrg)}
          </DescriptionsItem>
          <DescriptionsItem label="注册地址" span={3}>
            {isEmpty(qyxx.gsxx?.jbxx?.Address)}
            {isPc && qyxx.gsxx?.jbxx?.Address ? (
              <a
                rel="noopener noreferrer"
                target="_blank"
                style={{ marginLeft: 30 }}
                className={styles.clickStatus}
                href={baiduAddress(qyxx.gsxx?.jbxx?.Address)}
                // href={baiduAddress('北京市朝阳区姚家园路105号3号楼12层1503')}
              >
                查看地图
              </a>
            ) : (
              qyxx.gsxx?.jbxx?.Address && (
                <a
                  rel="noopener noreferrer"
                  target="_self"
                  style={{ marginLeft: 30 }}
                  className={styles.clickStatus}
                  href={baiduAddress(qyxx.gsxx?.jbxx?.Address)}
                  // href={baiduAddress('北京市朝阳区姚家园路105号3号楼12层1503')}
                >
                  查看地图
                </a>
              )
            )}
          </DescriptionsItem>
          <DescriptionsItem label="经营范围">{isEmpty(qyxx.gsxx?.jbxx?.Scope)}</DescriptionsItem>
        </Descriptions>
      </div>
    )
  }

  // 渲染企业信息
  const renderQyxx = () => {
    return (
      <div>
        <div className={styles.firstTitle}>
          <IconFont type="iconqiyexinxi" className={styles.cardIcon} />
          <div className={styles.cardTitle}>企业信息</div>
        </div>
        {/* 工商信息 */}
        <Card bordered={false} title={<CardTitle title="工商信息" />} style={{ marginBottom: 16 }}>
          {renderBasicInfo()}
          <ReportTable
            id="gsxx_czxx"
            columns={qyxxTable.gsxxColumns.tzrColumns}
            data={qyxx.gsxx?.czxx}
            title="投资人及出资人信息"
          />
          <ReportTable
            id="gsxx_bgjl"
            columns={qyxxTable.gsxxColumns.bgjlColumns}
            data={qyxx.gsxx?.bgjl}
            title="变更记录"
          />
          <ReportTable
            id="gsxx_zyry"
            columns={qyxxTable.gsxxColumns.zyryColumns}
            data={qyxx.gsxx?.zyry}
            title="主要人员"
          />
        </Card>
        {/* 银行账户信息 */}
        <Card bordered={false} title={<CardTitle title="银行账户信息" />}>
          {/* 银行账户信息-基本户&一般户 */}
          <ReportTable
            id="yhzhxx_jbh"
            columns={qyxxTable.yhzhColumns.jbzhColumns}
            data={qyxx.yhzh?.jbh}
            title="基本户"
          />
          <ReportTable
            id="yhzhxx_ybh"
            columns={qyxxTable.yhzhColumns.ybzhColumns}
            data={qyxx.yhzh?.ybh}
            title="一般户"
          />
        </Card>
      </div>
    )
  }

  // 渲染经营信息
  const renderJyxx = () => {
    return (
      <div>
        <div className={styles.firstTitle}>
          <IconFont type="iconjingyingxinxi" className={styles.cardIcon} />
          <div className={styles.cardTitle}>经营信息</div>
        </div>
        {/* 经营状况 */}
        <Card bordered={false} title={<CardTitle title="经营状况" />} style={{ marginBottom: 16 }}>
          <ReportTable
            id="jyzk_rzxx"
            columns={jyxxTable.jyzkColumns.rzxxColumns}
            title="融资信息"
            data={jyxx.jyzk?.rzxx}
          />
          <ReportTable
            id="jyzk_dkgs"
            columns={jyxxTable.jyzkColumns.dkgsColumns}
            title="地块公示"
            data={jyxx.jyzk?.dkgs}
          />
          <ReportTable
            id="jyzk_gdxx"
            columns={jyxxTable.jyzkColumns.gdxxColumns}
            title="购地信息"
            data={jyxx.jyzk?.gdxx}
          />
          <ReportTable
            id="jyzk_tdzr"
            columns={jyxxTable.jyzkColumns.tdzrColumns}
            title="土地转让"
            data={jyxx.jyzk?.tdzr}
          />
          <ReportTable
            id="jyzk_zqxx"
            columns={jyxxTable.jyzkColumns.zqxxColumns}
            title="债券信息"
            data={jyxx.jyzk?.zqxx}
          />
          <ReportTable
            id="jyzk_xzxk"
            columns={jyxxTable.jyzkColumns.xzxkColumns}
            title="行政许可"
            data={jyxx.jyzk?.xzxk}
          />
          <ReportTable
            id="jyzk_ccjc"
            columns={jyxxTable.jyzkColumns.ccjcColumns}
            title="抽查检查"
            data={jyxx.jyzk?.ccjc}
          />
          <ReportTable
            id="jyzk_ztbxx"
            columns={jyxxTable.jyzkColumns.ztbxxColumns}
            title="招投标信息"
            data={jyxx.jyzk?.ztbxx}
          />
          <ReportTable
            id="jyzk_nsxydj"
            columns={jyxxTable.jyzkColumns.nsxydjColumns}
            title="纳税信用等级"
            data={jyxx.jyzk?.nsxy}
          />
          <ReportTable
            id="jyzk_nsxx"
            columns={jyxxTable.jyzkColumns.nsxxColumns}
            title="纳税信息"
            data={jyxx.jyzk?.nsxx}
          />
          <ReportTable
            id="jyzk_dgls"
            columns={jyxxTable.jyzkColumns.dglsColumns}
            title="对公流水"
            data={jyxx.jyzk?.dgls}
          />
          <ReportTable
            id="jyzk_xwyq"
            columns={jyxxTable.jyzkColumns.xwyqColumns}
            title="新闻舆情"
            data={jyxx.jyzk?.xwyq}
          />
          <ReportTable
            id="jyzk_zpxx"
            columns={jyxxTable.jyzkColumns.zpxxColumns}
            title="招聘信息"
            data={jyxx.jyzk?.zpxx}
          />
        </Card>
        {/* 经营信息 */}
        <Card bordered={false} title={<CardTitle title="经营风险" />} style={{ marginBottom: 16 }}>
          <ReportTable
            id="jyfx_jyyc"
            columns={jyxxTable.jyfxColumns.jyycColumns}
            title="经营异常"
            data={jyxx.jyfx?.jyyc}
          />
          <ReportTable
            id="jyfx_sfpm"
            columns={jyxxTable.jyfxColumns.sfpmColumns}
            title="司法拍卖"
            data={jyxx.jyfx?.sfpm}
          />
          <ReportTable
            id="jyfx_tddy"
            columns={jyxxTable.jyfxColumns.tddyColumns}
            title="土地抵押"
            data={jyxx.jyfx?.tddy}
          />
          <ReportTable
            id="jyfx_hbcf"
            columns={jyxxTable.jyfxColumns.hbcfColumns}
            title="环保处罚"
            data={jyxx.jyfx?.hbcf}
          />
          <ReportTable
            id="jyfx_dcdy"
            columns={jyxxTable.jyfxColumns.dcdyColumns}
            title="动产抵押"
            data={jyxx.jyfx?.dcdy}
          />
          <ReportTable
            id="jyfx_yzwf"
            columns={jyxxTable.jyfxColumns.yzwfColumns}
            title="严重违法"
            data={jyxx.jyfx?.yzwf}
          />
          <ReportTable
            id="jyfx_qsgg"
            columns={jyxxTable.jyfxColumns.qsggColumns}
            title="欠税公告"
            data={jyxx.jyfx?.qsgg}
          />
          <ReportTable
            id="jyfx_qsxx"
            columns={jyxxTable.jyfxColumns.qsxxColumns}
            title="清算信息"
            data={jyxx.jyfx?.qsxx}
          />
          <ReportTable
            id="jyfx_jyzx"
            columns={jyxxTable.jyfxColumns.jyzxColumns}
            title="简易注销"
            data={jyxx.jyfx?.jyzx}
          />
          <ReportTable
            id="jyfx_ggcs"
            columns={jyxxTable.jyfxColumns.gscgColumns}
            title="公示催告"
            data={jyxx.jyfx?.ggcs}
          />
          <ReportTable
            id="jyfx_sswf"
            columns={jyxxTable.jyfxColumns.sswfColumns}
            title="税收违法"
            data={jyxx.jyfx?.sswf}
          />
          <ReportTable
            id="jyfx_gqcz"
            columns={jyxxTable.jyfxColumns.gqczColumns}
            title="股权出质"
            data={jyxx.jyfx?.gqcz}
          />
          <ReportTable
            id="jyfx_xzcf"
            columns={jyxxTable.jyfxColumns.xzcfColumns}
            title="行政处罚"
            data={jyxx.jyfx?.xzcf}
          />
        </Card>
        {/* 供销关系 */}
        <Card bordered={false} title={<CardTitle title="供销关系" />} style={{ marginBottom: 16 }}>
          <ReportTable
            id="gxgx_gys"
            // 根据{useGfsq}判断数据来源
            columns={
              jyxx?.gxgx?.gys?.useGfsq
                ? jyxxTable.gxgxColumns.gysgfColumns
                : jyxxTable.gxgxColumns.gyszzColumns
            }
            title="供应商"
            data={jyxx?.gxgx?.gys?.useGfsq ? jyxx?.gxgx?.gys?.gfsq : jyxx?.gxgx?.gys?.zzsb}
          />
          <ReportTable
            id="gxgx_kh"
            // 根据{useGfsq}判断数据来源
            columns={
              jyxx?.gxgx?.kh?.useGfsq
                ? jyxxTable.gxgxColumns.khgfColumns
                : jyxxTable.gxgxColumns.khzzColumns
            }
            title="客户"
            data={jyxx?.gxgx?.kh?.useGfsq ? jyxx?.gxgx?.kh?.gfsq : jyxx?.gxgx?.kh?.zzsb}
          />
        </Card>
        <Card bordered={false} title={<CardTitle title="财务信息" />}>
          <ReportTable
            id="cwxx_cwzk"
            columns={jyxxTable.cwxxColumns.cwzkColumns}
            title="财务状况"
            data={jyxx.cwxx?.cwzk}
          />
          <ReportTable
            id="cwxx_cznl"
            columns={jyxxTable.cwxxColumns.cznlColumns}
            title="偿债能力"
            data={jyxx.cwxx?.cznl}
          />
        </Card>
      </div>
    )
  }

  // 渲染资产信息
  const renderZcxx = () => {
    return (
      <div>
        <div className={styles.firstTitle}>
          <IconFont type="iconcaiwuxinxi" className={styles.cardIcon} />
          <div className={styles.cardTitle}>资产信息</div>
        </div>
        <Card bordered={false} title={<CardTitle title="固定资产" />} style={{ marginBottom: 16 }}>
          <ReportTable
            id="gdzc_fc"
            columns={zcxxTable.gdzcColumns.fcColumns}
            title="房产"
            data={zcxx.gdzc?.fc}
          />
          <ReportTable
            id="gdzc_cl"
            columns={zcxxTable.gdzcColumns.clColumns}
            title="车辆"
            data={zcxx.gdzc?.cl}
          />
          <ReportTable
            id="gdzc_qt"
            columns={zcxxTable.gdzcColumns.qtColumns}
            title="其他"
            data={zcxx.gdzc?.qt}
          />
        </Card>
        <Card bordered={false} title={<CardTitle title="知识产权" />}>
          <ReportTable
            id="zscq_sb"
            columns={zcxxTable.zscqColumns.sbColumns}
            title="商标"
            data={zcxx.zscq?.sb}
          />
          <ReportTable
            id="zscq_rjzzq"
            columns={zcxxTable.zscqColumns.rjzzqColumns}
            title="软件著作权"
            data={zcxx.zscq?.rjzzq}
          />
          <ReportTable
            id="zscq_gswz"
            columns={zcxxTable.zscqColumns.gswzxxColumns}
            title="公司网站信息"
            data={zcxx.zscq?.gswz}
          />
          <ReportTable
            id="zscq_zl"
            columns={zcxxTable.zscqColumns.zlColumns}
            title="专利"
            data={zcxx.zscq?.zl}
          />
        </Card>
      </div>
    )
  }

  // 渲染信用状况
  const renderXyzk = () => {
    return (
      <div>
        <div className={styles.firstTitle}>
          <IconFont type="iconxinyongzhuangkuang" className={styles.cardIcon} />
          <div className={styles.cardTitle}>信用状况</div>
        </div>
        <Card bordered={false} title={<CardTitle title="企业征信" />} style={{ marginBottom: 16 }}>
          <ReportTable
            id="qyzx_xdxx"
            columns={xyzkTable.qyzxColumns.xdxxColumns}
            title="信贷信息"
            data={xyzk.qyzx?.xdxx}
          />
          <ReportTable
            id="qyzx_jkxx"
            columns={xyzkTable.qyzxColumns.qyjkxxColumns}
            title="其余借款情况"
            data={xyzk.qyzx?.qyjk}
          />
        </Card>
        <Card bordered={false} title={<CardTitle title="涉诉信息" />} style={{ marginBottom: 16 }}>
          <ReportTable
            id="ssxx_ktgg"
            columns={xyzkTable.ssxxColumns.ktggColumns}
            title="开庭公告"
            data={xyzk.ssxx?.ktgg}
            summary={true}
          />
          <ReportTable
            id="ssxx_cpws"
            columns={xyzkTable.ssxxColumns.cpwsColumns}
            title="裁判文书"
            data={xyzk.ssxx?.cpws}
            summary={true}
          />
          <ReportTable
            id="ssxx_fygg"
            columns={xyzkTable.ssxxColumns.fyggColumns}
            title="法院公告"
            data={xyzk.ssxx?.fygg}
          />
          <ReportTable
            id="ssxx_sx"
            columns={xyzkTable.ssxxColumns.sxColumns}
            title="失信被执行人"
            data={xyzk.ssxx?.sx}
          />
          <ReportTable
            id="ssxx_bzx"
            columns={xyzkTable.ssxxColumns.bzxColumns}
            title="被执行人"
            data={xyzk.ssxx?.bzx}
          />
          <ReportTable
            id="ssxx_gqdj"
            columns={xyzkTable.ssxxColumns.gqdjColumns}
            title="股权冻结"
            data={xyzk.ssxx?.gqdj}
          />
        </Card>
        <Card
          bordered={false}
          title={<CardTitle title="股权关联企业风险" />}
          style={{ marginBottom: 16 }}
        >
          <ReportTable
            id="company_frbg"
            columns={xyzkTable.glqyfxColumns.glqyfx_frbg}
            title="法人变更"
            data={
              xyzk.glqyfx?.frbg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_gdbg"
            columns={xyzkTable.glqyfxColumns.glqyfx_gdbg}
            title="大股东变更"
            data={
              xyzk.glqyfx?.gdbg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_sx"
            columns={xyzkTable.glqyfxColumns.glqyfx_sx}
            title="失信被执行人"
            data={
              xyzk.glqyfx?.sx?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_bzx"
            columns={xyzkTable.glqyfxColumns.glqyfx_bzx}
            title="被执行人"
            data={
              xyzk.glqyfx?.bzx?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_ktgg"
            columns={xyzkTable.glqyfxColumns.glqyfx_ktgg}
            title="开庭公告"
            data={
              xyzk.glqyfx?.ktgg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_ktgg"
            columns={xyzkTable.glqyfxColumns.glqyfx_cpws}
            title="裁判文书"
            data={
              xyzk.glqyfx?.cpws?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_sfpm"
            columns={xyzkTable.glqyfxColumns.glqyfx_sfpm}
            title="司法拍卖"
            data={
              xyzk.glqyfx?.sfpm?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_jyyc"
            columns={xyzkTable.glqyfxColumns.glqyfx_jyyc}
            title="经营异常"
            data={
              xyzk.glqyfx?.jyyc?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_gqcz"
            columns={xyzkTable.glqyfxColumns.glqyfx_gqcz}
            title="股权出质"
            data={
              xyzk.glqyfx?.gqcz?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_dcdy"
            columns={xyzkTable.glqyfxColumns.glqyfx_dcdy}
            title="动产抵押"
            data={
              xyzk.glqyfx?.dcdy?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_gqdj"
            columns={xyzkTable.glqyfxColumns.glqyfx_gqdj}
            title="股权冻结"
            data={
              xyzk.glqyfx?.gqdj?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_tddy"
            columns={xyzkTable.glqyfxColumns.glqyfx_tddy}
            title="土地抵押"
            data={
              xyzk.glqyfx?.tddy?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_xzcf"
            columns={xyzkTable.glqyfxColumns.glqyfx_xzcf}
            title="行政处罚"
            data={
              xyzk.glqyfx?.xzcf?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_hbcf"
            columns={xyzkTable.glqyfxColumns.glqyfx_hbcf}
            title="环保处罚"
            data={
              xyzk.glqyfx?.hbcf?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="company_sswf"
            columns={xyzkTable.glqyfxColumns.glqyfx_sswf}
            title="税收违法"
            data={
              xyzk.glqyfx?.sswf?.map((item) => {
                return item
              }) || []
            }
          />
        </Card>
        <Card bordered={false} title={<CardTitle title="股权关联人风险" />}>
          <ReportTable
            id="relate_frbg"
            columns={xyzkTable.glrfxColumns.glrfx_frgb}
            title="法人变更"
            data={
              xyzk.glrfx?.frbg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_gdbg"
            columns={xyzkTable.glrfxColumns.glrfx_gdbg}
            title="大股东变更"
            data={
              xyzk.glrfx?.gdbg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_sx"
            columns={xyzkTable.glrfxColumns.glrfx_sx}
            title="失信被执行人"
            data={
              xyzk.glrfx?.sx?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_bzx"
            columns={xyzkTable.glrfxColumns.glrfx_bzx}
            title="被执行人"
            data={
              xyzk.glrfx?.bzx?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_ktgg"
            columns={xyzkTable.glrfxColumns.glrfx_ktgg}
            title="开庭公告"
            data={
              xyzk.glrfx?.ktgg?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_cpws"
            columns={xyzkTable.glrfxColumns.glrfx_cpws}
            title="裁判文书"
            data={
              xyzk.glrfx?.cpws?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_sfpm"
            columns={xyzkTable.glrfxColumns.glrfx_sfpm}
            title="司法拍卖"
            data={
              xyzk.glrfx?.sfpm?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_jyyc"
            columns={xyzkTable.glrfxColumns.glrfx_jyyc}
            title="经营异常"
            data={
              xyzk.glrfx?.jyyc?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_gqcz"
            columns={xyzkTable.glrfxColumns.glrfx_gqcz}
            title="股权出质"
            data={
              xyzk.glrfx?.gqcz?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_dcdy"
            columns={xyzkTable.glrfxColumns.glrfx_dcdy}
            title="动产抵押"
            data={
              xyzk.glrfx?.dcdy?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_gqdj"
            columns={xyzkTable.glrfxColumns.glrfx_gqdj}
            title="股权冻结"
            data={
              xyzk.glrfx?.gqdj?.map((item) => {
                return item
              }) || []
            }
          />
          <ReportTable
            id="relate_xzcf"
            columns={xyzkTable.glrfxColumns.glrfx_xzcf}
            title="行政处罚"
            data={
              xyzk.glrfx?.xzcf?.map((item) => {
                return item
              }) || []
            }
          />
        </Card>
      </div>
    )
  }

  // 渲染反担保信息
  const renderFdbxx = () => {
    return (
      <div>
        <div className={styles.firstTitle}>
          <IconFont type="iconfandanbaoxinxi" className={styles.cardIcon} />
          <div className={styles.cardTitle}>反担保信息</div>
        </div>
        <Card
          bordered={false}
          title={<CardTitle title="反担保企业" />}
          style={{ marginBottom: 16 }}
        >
          <ReportTable
            id="fdbqy_fdbjl"
            columns={fdbxxTable.fdbqyColumns}
            title="反担保记录"
            data={fdbxx.qy}
          />
        </Card>
        <Card bordered={false} title={<CardTitle title="反担保个人" />}>
          <ReportTable
            id="fdbgr_fdbjl"
            columns={fdbxxTable.fdbgrColumns}
            title="反担保记录"
            data={fdbxx.gr}
          />
        </Card>
      </div>
    )
  }

  // 渲染法人信息
  const renderFrxx = () => {
    return (
      <div>
        <div className={styles.firstTitle}>
          <IconFont type="iconshikongrenjiqiguanlianrenxinxi" className={styles.cardIcon} />
          <div className={styles.cardTitle}>法人/实控人及其关联人信息</div>
        </div>
        <Card bordered={false} title={<CardTitle title="人员信息" />} style={{ marginBottom: 16 }}>
          <ReportTable
            id="ryxx_jbxx"
            columns={frxxTable.ryxxColumns.jbxxColumns}
            title="基本信息"
            data={frxx.ryxx?.jbxx}
          />
        </Card>
        <Card bordered={false} title={<CardTitle title="个人流水" />} style={{ marginBottom: 16 }}>
          <ReportTable
            id="grls_lsxx"
            columns={frxxTable.grlsColumns.lsxxColumns}
            title="流水信息"
            data={frxx.grls?.lsxx}
          />
        </Card>
        <Card bordered={false} title={<CardTitle title="固定资产" />} style={{ marginBottom: 16 }}>
          <ReportTable
            id="frxx_gdzc_fc"
            columns={frxxTable.gdzcColumns.fcColumns}
            title="房产"
            data={frxx.gdzc?.fc}
          />
          <ReportTable
            id="frxx_gdzc_cl"
            columns={frxxTable.gdzcColumns.clColumns}
            title="车辆"
            data={frxx.gdzc?.cl}
          />
          <ReportTable
            id="frxx_gdzc_qt"
            columns={frxxTable.gdzcColumns.qtColumns}
            title="其他"
            data={frxx.gdzc?.qt}
          />
        </Card>
        <Card bordered={false} title={<CardTitle title="信用状况" />}>
          <ReportTable
            id="xyzk_xykxx"
            columns={frxxTable.xyzkColumns.xykxxColumns}
            title="信用卡信息"
            data={frxx.xyzk?.xykxx}
          />
          <ReportTable
            id="xyzk_xdxx"
            columns={frxxTable.xyzkColumns.xdxxColumns}
            title="信贷信息"
            data={frxx.xyzk?.xdxx}
          />
          <ReportTable
            id="xyzk_qyjk"
            columns={frxxTable.xyzkColumns.qyjkxxColumns}
            title="其余借款情况"
            data={frxx.xyzk?.qyjk}
          />
        </Card>
      </div>
    )
  }

  // 渲染报告顶部
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
                {info.status && (
                  <Tag color="orange" style={{ marginRight: 8 }}>
                    {info.status}
                  </Tag>
                )}
                {info.industry && <Tag color="blue">{info.industry}</Tag>}
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

  // 渲染弹框
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
        {/* 所属行业 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="行业数据"
          visible={sshy_OpenModal}
          onOk={() => setSshyOpenModal(false)}
          onCancel={() => setSshyOpenModal(false)}
        >
          {industryData?.length > 0 && (
            <SliderChart currentIndustry={info.industry} data={industryData} />
          )}
        </Modal>
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
        {/* 关联企业风险-大股东变更 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="大股东变更信息"
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

        {/* 关联人风险 */}
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
        {/* 关联人风险-大股东变更 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="大股东变更信息"
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
      </React.Fragment>
    )
  }

  // 渲染报告
  const renderContent = () => {
    return (
      <>
        <Statement data={info} />
        {renderHeader()}
        {isPc && <GlobalMenu menuMap={menuMap} />}
        {renderQyxx()}
        {renderJyxx()}
        {renderZcxx()}
        {renderXyzk()}
        {renderFdbxx()}
        {renderFrxx()}
        {renderModal()}
      </>
    )
  }

  return (
    <div>
      <Spin spinning={fetching}>{renderContent()}</Spin>
    </div>
  )
}

export default Report
