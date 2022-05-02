import React, { useState } from 'react'
import Link from 'umi/link'
import { Icon, Tag, Card, Timeline, Empty, Modal, Descriptions, Spin, Anchor } from 'antd'
import IconFont from '@/components/IconFont'
import CardTitle from '../Components/CardTitle'
import ModalTable from '../Components/ModalTable'
import ReportTable from '../Components/ReportTable'
import Statement from '../Components/Statement'
import TitleLink from '../Components/TitleLink'
import { scrollToAnchor, formatTime } from '@/utils'
import { useRequest } from '@dragon/hooks'
import { fetchReportList, fetchReportDetail } from '@/services/microSubsidy/report'
import { warning } from '../../common/dict'
import EmptyReport from '../Components/EmptyReport'
import { formatDate } from '@/utils'
import styles from '../styles.less'

const DescriptionsItem = Descriptions.Item

const MonitorReport = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  const [activeTab, setActiveTab] = useState('selfrisk')

  const { data: info = {}, loading: fetching } = useRequest(() =>
    fetchReportList(
      { bizNo: id, reportType: 'MONITOR_REPORT' },
      {
        onSuccess: () => {}
      }
    )
  )

  const monitorbg = require('../../../../assets/monitor.png')

  const [isFold, setIsFold] = useState(true)
  const [modalData, setModalData] = useState({})
  const [sx_OpenModal, setSxOpenModal] = useState(false)
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

  // 判断数据是否存在&上限
  const isZero = (val) => {
    const max = 50
    return val ? (val === max ? `${max}+` : val) : '0'
  }

  // 企业自身风险map
  const selfMap = [
    {
      name: '行政处罚',
      amount: isZero(info.xzcf?.length),
      id: 'self_xzcf'
    },
    {
      name: '经营异常',
      amount: isZero(info.jyyc?.length),
      id: 'self_jyyc'
    },
    {
      name: '环保处罚',
      amount: isZero(info.hbcf?.length),
      id: 'self_hbcf'
    },
    {
      name: '税收违法',
      amount: isZero(info.sswf?.length),
      id: 'self_sswf'
    },
    {
      name: '法人变更',
      amount: isZero(info.frbg?.length),
      id: 'self_frbg'
    },
    {
      name: '股东变更',
      amount: isZero(info.gdbg?.length),
      id: 'self_gdbg'
    },
    {
      name: '开庭公告',
      amount: isZero(info.ktgg?.length),
      id: 'self_ktgg'
    },
    {
      name: '裁判文书',
      amount: isZero(info.cpws?.length),
      id: 'self_cpws'
    },
    {
      name: '法院公告',
      amount: isZero(info.fygg?.length),
      id: 'self_fygg'
    },
    {
      name: '失信被执行人',
      amount: isZero(info.sx?.length),
      id: 'self_sx'
    },
    {
      name: '股权冻结',
      amount: isZero(info.gqdj?.length),
      id: 'self_gqdj'
    },
    {
      name: '司法拍卖',
      amount: isZero(info.sfpm?.length),
      id: 'self_sfpm'
    },
    {
      name: '土地抵押',
      amount: isZero(info.tddy?.length),
      id: 'self_tddy'
    },
    {
      name: '动产抵押',
      amount: isZero(info.dcdy?.length),
      id: 'self_dcdy'
    },
    {
      name: '股权出质',
      amount: isZero(info.gqcz?.length),
      id: 'self_gqcz'
    }
  ]

  // 企业关联人风险map
  const relateMap = [
    {
      name: '法人变更',
      amount: isZero(info.glrfx?.frbg?.length),
      id: 'relate_frbg'
    },
    {
      name: '股东变更',
      amount: isZero(info.glrfx?.gdbg?.length),
      id: 'relate_gdbg'
    },
    {
      name: '失信被执行人',
      amount: isZero(info.glrfx?.sx?.length),
      id: 'relate_sx'
    },
    {
      name: '被执行人',
      amount: isZero(info.glrfx?.bzx?.length),
      id: 'relate_bzx'
    },
    {
      name: '开庭公告',
      amount: isZero(info.glrfx?.ktgg?.length),
      id: 'relate_ktgg'
    },
    {
      name: '裁判文书',
      amount: isZero(info.glrfx?.cpws?.length),
      id: 'relate_cpws'
    },
    {
      name: '司法拍卖',
      amount: isZero(info.glrfx?.sfpm?.length),
      id: 'relate_sfpm'
    },
    {
      name: '经营异常',
      amount: isZero(info.glrfx?.jyyc?.length),
      id: 'relate_jyyc'
    },
    {
      name: '股权出质',
      amount: isZero(info.glrfx?.gqcz?.length),
      id: 'relate_gqcz'
    },
    {
      name: '动产抵押',
      amount: isZero(info.glrfx?.dcdy?.length),
      id: 'relate_dcdy'
    },
    {
      name: '股权冻结',
      amount: isZero(info.glrfx?.gqdj?.length),
      id: 'relate_gqdj'
    },
    {
      name: '行政处罚',
      amount: isZero(info.glrfx?.xzcf?.length),
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
      name: '失信信息',
      amount: info.glqyfx?.sx?.length || 0,
      id: 'company_sx'
    },
    {
      name: '被执行信息',
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
      id: 'company_tddy'
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

  // 裁判文书-完成
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
      width: 160,
      render: (text, record) => {
        return record.ProsecutorList
          ? record.ProsecutorList?.map((item, index) => {
              return <TitleLink val={item.Name} origin={info.name}></TitleLink>
            })
          : '-'
      }
    },
    {
      title: '被上诉人',
      width: 160,
      render: (text, record) => {
        return record.DefendantList
          ? record.DefendantList?.map((item, index) => {
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

  // 股权冻结-完成
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
      render: (text) => text || '-'
    },
    {
      title: '股权数额',
      dataIndex: 'EquityAmount',
      key: 'EquityAmount',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '执行通知文号',
      dataIndex: 'ExecutionNoticeNum',
      key: 'ExecutionNoticeNum',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '类型 | 状态',
      dataIndex: 'Status',
      key: 'Status',
      width: 160,
      render: (text) => text || '-'
    }
  ]

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
      title: '移出经营异常原因',
      dataIndex: 'RomoveReason',
      key: 'RomoveReason',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '移出日期',
      dataIndex: 'RemoveDate',
      key: 'RemoveDate',
      width: 160,
      render: (text, record, index) => formatDate(text) || '-'
    },
    {
      title: '作出决定机关',
      dataIndex: 'DecisionOffice',
      key: 'DecisionOffice',
      width: 200,
      render: (text) => text || '-'
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
      render: (text) => text || '-'
    },
    {
      title: '起拍价',
      dataIndex: 'YiWu',
      key: 'YiWu',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '拍卖时间',
      dataIndex: 'ActionRemark',
      key: 'ActionRemark',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '委托法院',
      dataIndex: 'Executegov',
      key: 'Executegov',
      width: 200,
      render: (text) => text || '-'
    }
  ]

  // 土地抵押-完成
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
      render: (text) => text || '-'
    },
    {
      title: '抵押时间',
      dataIndex: 'StartDate',
      key: 'StartDate',
      width: 100,
      render: (text, record, index) => formatDate(text) || '-'
    },
    {
      title: '行政区',
      dataIndex: 'AdministrativeArea',
      key: 'AdministrativeArea',
      width: 100,
      render: (text) => text || '-'
    },
    {
      title: '抵押面积(公顷)',
      dataIndex: 'MortgageAcreage',
      key: 'MortgageAcreage',
      width: 160,
      render: (text) => text || '-'
    },
    {
      title: '抵押土地用途',
      dataIndex: 'MortgagePurpose',
      key: 'MortgagePurpose',
      width: 160,
      render: (text) => text || '-'
    }
  ]

  // 环保处罚-完成
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
      render: (text) => text || '-'
    },
    {
      title: '违法类型',
      dataIndex: 'IllegalType',
      key: 'IllegalType',
      width: 200,
      render: (text) => text || '-'
    },
    {
      title: '处罚日期',
      dataIndex: 'PunishDate',
      key: 'PunishDate',
      width: 200,
      render: (text, record, index) => formatDate(text) || '-'
    },
    {
      title: '处罚单位',
      dataIndex: 'PunishGov',
      key: 'PunishGov',
      width: 200,
      render: (text) => text || '-'
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

  // 行政处罚-完成
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
      render: (text) => text || '-'
    },
    {
      title: '违法行为类型',
      dataIndex: 'PenaltyType',
      key: 'PenaltyType',
      width: 300,
      render: (text) => text || '-'
    },
    {
      title: '行政处罚内容',
      dataIndex: 'Content',
      key: 'Content',
      width: 300,
      render: (text) => text || '-'
    },
    {
      title: '决定机关',
      dataIndex: 'OfficeName',
      key: 'OfficeName',
      width: 100,
      render: (text) => text || '-'
    },
    {
      title: '决定日期',
      dataIndex: 'PenaltyDate',
      key: 'PenaltyDate',
      width: 100,
      render: (text, record, index) => formatDate(text) || '-'
    }
  ]

  // 法人变更-暂无
  const PersonChange = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`
    },
    {
      title: '变更前法人信息',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || '-'
    },
    {
      title: '变更后法人信息',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || '-'
    },
    {
      title: '变更日期',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || '-'
    }
  ]

  // 股东变更-暂无
  const MainPersonChange = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`
    },
    {
      title: '股东变更前信息',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || '-'
    },
    {
      title: '股东变更后信息',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || '-'
    },
    {
      title: '变更日期',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || '-'
    }
  ]

  // 股权出质-完成
  const self_gqcz = [
    {
      title: '序号',
      render: (text, record) => `${record.index}`,
      width: 40
    },
    {
      title: '登记编号',
      dataIndex: 'RegistNo',
      key: 'RegistNo',
      width: 100,
      render: (text) => text || '-'
    },
    {
      title: '质权人',
      width: 100,
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
      width: 100,
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
      width: 100,
      render: (text) => text || '-'
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      width: 100,
      render: (text) => text || '-'
    },
    {
      title: '登记日期',
      dataIndex: 'RegDate',
      key: 'RegDate',
      width: 100,
      render: (text, record, index) => formatDate(text) || '-'
    }
  ]

  // 报告顶部
  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <div className={styles.headerTitle}>监控报告</div>
          <div className={styles.generateTime}>
            {`报告生成时间：`}
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
            style={{ background: `url(${monitorbg}) `, backgroundSize: 'cover' }}
          >
            <div className={styles.scoreTitle}>最新预警因子</div>
            {info.lastWarningType ? (
              <div className={styles.score}>{info.lastWarningType}</div>
            ) : (
              <div className={styles.empty}>暂无</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 修改收起||展开状态
  const handleFold = () => {
    setIsFold(!isFold)
  }

  const handleClick = (key) => {
    scrollToAnchor(key)
  }

  // 时间轴
  const renderTimeline = () => {
    const items = info.warningList
    return info.warningList?.length > 0 ? (
      <div style={{ marginBottom: 16 }}>
        <div className={isFold ? styles.foldWrap : styles.timelineWrap}>
          <Timeline className="timeline">
            {(items || []).map((item) => {
              return (
                <Timeline.Item color={warning[item.level]?.color}>
                  <Tag color={warning[item.level]?.color}>预警等级{item.level}</Tag>
                  {item.warning_type}已达{item.warning_value}条
                  <span className={styles.date}> {item.warning_time}</span>
                </Timeline.Item>
              )
            })}
          </Timeline>
        </div>
        {info.warningList?.length > 2 && (
          <div className={styles.fold} onClick={() => handleFold()}>
            {isFold ? (
              <div style={{ cursor: 'pointer', margin: 'auto' }}>
                更多
                <Icon type="down" style={{ color: '#1989AA' }} />
              </div>
            ) : (
              <div style={{ cursor: 'pointer', margin: 'auto' }}>
                收起
                <Icon type="up" style={{ color: '#1989AA' }} />
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
      <div className={styles.timelineWrap}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }

  const changeTab = (activeKey) => {
    setActiveTab(activeKey)
  }

  const tabList = [
    {
      tab: '企业自身风险',
      key: 'selfrisk'
    },
    {
      tab: '关联人风险',
      key: 'relaterisk'
    },
    {
      tab: '关联企业风险',
      key: 'companyrisk'
    }
  ]

  const renderTabItem = () => {
    switch (activeTab) {
      case 'selfrisk':
        return (
          <div className={styles.subBlock}>
            {selfMap.map((item, index) => {
              return (
                <div className={styles.block} onClick={() => handleClick(item.id)}>
                  {item.name}
                  <span className={styles.num}>{item.amount}</span>
                </div>
              )
            })}
          </div>
        )

      case 'relaterisk':
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

      case 'companyrisk':
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
      default:
        break
    }
  }

  const renderCardTab = () => (
    // <Anchor className='reportAnchor'>
    <Card
      className={styles.tabWrap}
      tabList={tabList}
      activeTabKey={activeTab}
      onTabChange={changeTab}
      bordered={false}
    >
      {renderTabItem()}
    </Card>
    // </Anchor>
  )

  // 企业自身风险
  const renderSelfRisk = () => {
    return (
      <div>
        <Card
          style={{ marginTop: 16 }}
          bordered={false}
          title={<CardTitle title="企业自身风险" icon="iconqiyezishen" />}
        >
          <ReportTable
            columns={AdministrativePenalties}
            title="行政处罚"
            id="self_xzcf"
            data={info.xzcf || []}
          />
          <ReportTable columns={Warning} title="经营异常" id="self_jyyc" data={info.jyyc || []} />
          <ReportTable
            columns={EnvironmentalPenalty}
            title="环保处罚"
            id="self_hbcf"
            data={info.hbcf || []}
          />
          <ReportTable
            columns={TaxViolation}
            title="税收违法"
            id="self_sswf"
            data={info.sswf || []}
          />
          <ReportTable
            columns={PersonChange}
            title="法人变更"
            id="self_frbg"
            data={info.frbg || []}
          />
          <ReportTable
            columns={MainPersonChange}
            title="股东变更"
            id="self_gdbg"
            data={info.gdbg || []}
          />
          <ReportTable
            columns={CourtColumns}
            title="开庭公告"
            id="self_ktgg"
            data={info.ktgg || []}
          />
          <ReportTable
            columns={RefereeColumns}
            title="裁判文书"
            id="self_cpws"
            data={info.cpws || []}
          />
          <ReportTable
            columns={PublicStatementColumns}
            title="法院公告"
            id="self_fygg"
            data={info.fygg || []}
          />
          <ReportTable
            columns={UntrustworthyExecutor}
            title="失信被执行人"
            id="self_sx"
            data={info.sx || []}
          />
          <ReportTable
            columns={StockFreeze}
            title="股权冻结"
            id="self_gqdj"
            data={info.gqdj || []}
          />
          <ReportTable
            columns={JudicialAuction}
            title="司法拍卖"
            id="self_sfpm"
            data={info.sfpm || []}
          />
          <ReportTable
            columns={LandPledge}
            title="土地抵押"
            id="self_tddy"
            data={info.tddy || []}
          />
          <ReportTable
            columns={ChattelMortgage}
            title="动产抵押"
            id="self_dcdy"
            data={info.dcdy || []}
          />
          <ReportTable columns={self_gqcz} title="股权出质" id="self_gqcz" data={info.gqcz || []} />
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
          bordered={false}
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
          bordered={false}
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
          return record.NewPartners.length > 0
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
          return record.Prosecutorlist.length > 0
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
          return record.NewPartners.length > 0
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
          return record.Prosecutorlist.length > 0
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

  const renderModal = () => {
    return (
      <React.Fragment>
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
        {/* 失信被执行人 */}
        <Modal
          className="modal"
          style={{ minWidth: 980 }}
          title="失信被执行人详情"
          visible={sx_OpenModal}
          onOk={() => setSxOpenModal(false)}
          onCancel={() => setSxOpenModal(false)}
          destroyOnClose={true}
        >
          <div className={styles.descWrap}>
            <Descriptions bordered column={2} className="desc">
              <DescriptionsItem label={<div style={{ width: 120 }}>失信被执行人</div>}>
                <TitleLink val={modalData?.Name} origin={info.name}></TitleLink>
              </DescriptionsItem>
              <DescriptionsItem label={<div style={{ width: 120 }}>案号</div>}>
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
      </React.Fragment>
    )
  }

  const renderReport = () => {
    return (
      <>
        <Statement data={info} />
        {renderHeader()}
        {renderTimeline()}
        {renderCardTab()}
        {renderSelfRisk()}
        {renderRelateRisk()}
        {renderCompanyRisk()}
        {renderModal()}
      </>
    )
  }

  return (
    <div>
      <Spin spinning={fetching}>{renderReport()}</Spin>
    </div>
  )

  // return <div>{info.name && renderReport()}</div>
}

export default MonitorReport
