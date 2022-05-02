import React, { useState, useEffect } from 'react'
// import { Button, message } from 'antd'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
// import ButtonGroup from '@/components/ButtonGroup'
import Timeline from '@/components/Timeline/TimelineBiz'
import { useRequest } from '@dragon/hooks'
import { fetchDetail, getCompanyDetail } from '@/services/microSubsidy/finance'
import { fetchFormOutFlow } from '@/services/common'
import { formatMoney } from '@/utils'
import IconFont from '@/components/IconFont'
// import PayBackForm from '../components/ModalForms/PayBackForm'
// import OutDate from '../components/ModalForms/OutDate'
// import PostLoanReport from '../components/ModalForms/PostLoanReport'
// import useModalForm from '@/hooks/useModalForm'
// import router from 'umi/router'
// import CompanyInfo from '../components/CompanyInfo'
import FinanceInfo from '../components/FinanceInfo'
import PostLoanInfo from '../components/PostLoanInfo'
import PayInfo from '../components/PayInfo'
import { financeStatus } from '../common/dict'
import Suspense from '@/components/Suspense'
// import { fetchDetail as fetchCmyDetail } from '@/services/microSubsidy/enterprise'
import styles from './styles.less'

const { Description } = DescriptionList

const getTabList = (show) =>
  [
    show && { key: '1', tab: '保后信息' },
    { key: '2', tab: '放款信息' },
    { key: '3', tab: '企业信息' },
    { key: '4', tab: '担保信息' }
  ].filter((i) => i)

const CompanyInfo = React.lazy(() => import('../components/CompanyInfo'))

const Detail = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  // const { data: info = {}, loading: fetching } = useRequest(() => fetchDetail({ bizNo: id }))

  // 获取企业详情
  const { data = {}, start: fetchCmyDetailReq } = useRequest(getCompanyDetail, {
    manual: true
  })

  // 获取融资详情
  const { data: info = {}, loading: fetching } = useRequest(() => fetchDetail({ bizNo: id }), {
    onSuccess: (res) => {
      fetchCmyDetailReq({ bizNo: id })
    }
  })

  const { data: formList = [] } = useRequest(() =>
    fetchFormOutFlow({
      bizNo: id,
      formKey: '上传贷后报告',
      formName: '上传贷后报告'
    })
  )
  // const showFirstTab = !!(info.extra?.payForm || formList.length)
  const showFirstTab = info.extra?.payPayBackBank

  const [activeKey, setActiveKey] = useState(showFirstTab ? '1' : '2')
  useEffect(() => {
    setActiveKey(showFirstTab ? '1' : '2')
  }, [formList.length, info.extra, showFirstTab])

  const tab = {
    '1': () => (
      <PostLoanInfo
        data={info?.extra?.payPayBackNum && info?.extra}
        list={formList || {}}
        isCompany={true}
      />
    ),
    '2': () => <PayInfo data={info.extra || {}} />,
    '3': () => (
      <Suspense>
        <CompanyInfo hideAdmin data={data || {}} />
      </Suspense>
    ),
    '4': () => <FinanceInfo hideVerifyFiles data={info.extra || {}} />
  }

  // 还款表单
  // const { loading: payBackLoading, start: payBackReq } = useRequest(agree, { manual: true })
  // const { open: openPayBackForm, props: payBackProps } = useModalForm({
  //   title: '还款',
  //   payAmount: info.extra?.loanPayAmount, // 放款金额传入form
  //   confirmLoading: payBackLoading,
  //   afterValidate: async (v, close) => {
  //     const res = await payBackReq({
  //       taskName: '还款',
  //       processId: info.processId,
  //       ...v
  //     })
  //     if (res instanceof Error) return
  //     message.success('还款成功')
  //     router.push('/msPostLoan/list')
  //   }
  // })

  // 逾期表单
  // const { loading: outDateLoading, start: outDateReq } = useRequest(agree, { manual: true })
  // const { open: openOutDateForm, props: outDateProps } = useModalForm({
  //   title: '确认逾期',
  //   confirmLoading: outDateLoading,
  //   afterValidate: async (v, close) => {
  //     const res = await outDateReq({
  //       taskName: '逾期',
  //       processId: info.processId,
  //       ...v
  //     })
  //     if (res instanceof Error) return
  //     message.success('确认逾期成功')
  //     router.push('/msPostLoan/list')
  //   }
  // })

  // 上传贷后报告表单
  // const { loading: postLoanLoading, start: postLoanReq } = useRequest(submitFormOutFlow, {
  //   manual: true
  // })
  // const { open: openPostLoanForm, props: postLoanProps } = useModalForm({
  //   title: '上传贷后报告',
  //   confirmLoading: postLoanLoading,
  //   afterValidate: async (v, close) => {
  //     const res = await postLoanReq({
  //       bizNo: id,
  //       formName: '上传贷后报告',
  //       formKey: '上传贷后报告',
  //       ...v
  //     })
  //     if (res instanceof Error) return
  //     message.success('上传贷后报告')
  //     router.push('/msPostLoan/list')
  //   }
  // })

  // 所有的弹出框表单
  // const renderForm = () => {
  //   return (
  //     <React.Fragment>
  //       <PayBackForm {...payBackProps} />
  //       <OutDate {...outDateProps} />
  //       <PostLoanReport {...postLoanProps} />
  //     </React.Fragment>
  //   )
  // }

  // const renderExtra = useCallback(() => {
  //   const actionMap = {
  //     逾期未还清: [
  //       { name: '还款', props: { auth: 'post_refund', onClick: openPayBackForm, type: 'primary' } },
  //       { name: '上传贷后报告', props: { auth: 'upload_report', onClick: openPostLoanForm } }
  //     ],
  //     待还款: [
  //       { name: '还款', props: { auth: 'post_refund', onClick: openPayBackForm, type: 'primary' } },
  //       { name: '逾期', props: { auth: 'due', onClick: openOutDateForm } },
  //       { name: '上传贷后报告', props: { auth: 'upload_report', onClick: openPostLoanForm } }
  //     ],
  //     逾期已还清: []
  //   }

  //   return (
  //     <ButtonGroup align="right">
  //       {actionMap[info.bizStatus]?.map((b) => (
  //         <Button key={b.name} {...b.props}>
  //           {b.name}
  //         </Button>
  //       ))}
  //     </ButtonGroup>
  //   )
  // }, [info.bizStatus, openOutDateForm, openPayBackForm, openPostLoanForm])

  return (
    <Card loading={fetching} transparent>
      {/* {renderForm()} */}
      <Card>
        <Card.Header
          color={financeStatus[info.bizStatus]?.color}
          name={financeStatus[info.bizStatus]?.name}
          // extra={renderExtra()}
        >
          <IconFont
            className={styles.icon}
            // style={{ color: '#1989AA', top: 2, marginRight: 8, fontSize: 24 }}
            type="iconyindan"
          />
          担保编号 {info.bizNo}
        </Card.Header>
        <DescriptionList column={6} layout="vertical">
          <Description label="申请企业">{info.extra?.orgName}</Description>
          <Description label="企业类型">{info.extra?.orgType}</Description>
          <Description label="担保金额">{formatMoney(info.extra?.applyFinanceAmount)}</Description>
          <Description label="放款金额">{formatMoney(info.extra?.loanPayAmount)}</Description>
          <Description label="放款银行">{info.extra?.loanPayBankName}</Description>
          <Description label="约定还款日">{info.extra?.loanAppointDate}</Description>
        </DescriptionList>
      </Card>
      <Card title="担保流程">
        <Timeline bizNo={id} />
      </Card>
      <Card tabList={getTabList(showFirstTab)} activeTabKey={activeKey} onTabChange={setActiveKey}>
        {tab[activeKey]()}
      </Card>
    </Card>
  )
}

export default Detail
