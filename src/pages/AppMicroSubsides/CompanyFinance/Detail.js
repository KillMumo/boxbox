import React, { useState } from 'react'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import Timeline from '@/components/Timeline/TimelineBiz'
import RejectInfo from '@/components/RejectInfo'
import FinanceInfo from '../components/FinanceInfo'
// import CompanyInfo from '../components/CompanyInfo'
import Iconfont from '@/components/IconFont'
import ButtonGroup from '@/components/ButtonGroup'
import { Button, Modal } from 'antd'
import { useRequest } from '@dragon/hooks'
import { fetchDetail, startFinance } from '@/services/microSubsidy/companyFinance'
// import { fetchDetail as fetchCmyDetail } from '@/services/microSubsidy/enterprise'
import { getCompanyDetail } from '@/services/microSubsidy/finance'
import styles from './styles.less'

import router from 'umi/router'
import { companyFinanceStatus } from '../common/dict'
import { formatMoney } from '@/utils'
import Suspense from '@/components/Suspense'

const tabList = [
  { key: '1', tab: '企业信息' },
  { key: '2', tab: '担保信息' }
]

const CompanyInfo = React.lazy(() => import('../components/CompanyInfo'))

const Detail = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  const [activeKey, setActiveKey] = useState('1')

  // 获取企业详情
  const { loading: fetchingCmyDetail, data = {}, start: fetchCmyDetailReq } = useRequest(
    getCompanyDetail,
    {
      manual: true
    }
  )

  // 获取融资详情
  const { data: info = {}, loading: fetching } = useRequest(() => fetchDetail({ bizNo: id }), {
    onSuccess: (res) => {
      fetchCmyDetailReq({ bizNo: id })
    }
  })

  // tab页
  const tab = {
    '1': () => (
      <Suspense>
        <CompanyInfo hideAdmin data={data} />
      </Suspense>
    ),
    '2': () => <FinanceInfo hideVerifyFiles data={info.extra || {}} />
  }

  const renderRejectInfo = () => {
    return null && <RejectInfo />
  }

  const renderExtra = () => {
    // 融资企业的修改按钮
    const handleModify = () => {
      router.push(`/msCompanyFinance/edit/${id}`)
    }

    // 重新提交
    const handleSubmit = () => {
      Modal.confirm({
        title: '确定要重新提交么',
        content: '一旦提交，将重新进入审批流程',
        onOk: () => {
          return startFinance(info.extra).then((res) => {
            if (res instanceof Error) return
            window.location.reload()
          })
        }
      })
    }

    const actionMap = {
      待企业提交: [
        {
          name: '修改',
          props: {
            auth: '融资管理-申请融资担保-重新提交-企业',
            onClick: handleModify,
            type: 'primary'
          }
        },
        {
          name: '提交',
          props: { auth: '融资管理-申请融资担保-重新提交-企业', onClick: handleSubmit }
        }
      ]
    }

    return (
      <ButtonGroup>
        {actionMap[info.bizStatus]?.map((b) => (
          <Button key={b.name} {...b.props}>
            {b.name}
          </Button>
        ))}
      </ButtonGroup>
    )
  }

  return (
    <Card loading={fetching || fetchingCmyDetail} transparent>
      {renderRejectInfo()}
      <Card>
        <Card.Header
          color={companyFinanceStatus[info.bizStatus]?.color}
          name={companyFinanceStatus[info.bizStatus]?.name}
          extra={renderExtra()}
        >
          <Iconfont
            className={styles.icon}
            // style={{ color: '#1989AA', top: 2, marginRight: 8, fontSize: 24 }}
            type="iconyindan"
          />
          担保编号 {info.extra?.bizNo}
        </Card.Header>
        <DescriptionList layout="vertical" column={4}>
          <DescriptionList.Description label="申请企业">
            {data.companyBasicInfoVO?.orgName}
          </DescriptionList.Description>
          <DescriptionList.Description label="所属行业">
            {data.companyBasicInfoVO?.orgType}
          </DescriptionList.Description>
          <DescriptionList.Description label="申请担保金额(元)">
            {formatMoney(info.extra?.applyFinanceAmount)}
          </DescriptionList.Description>
          <DescriptionList.Description label="预计还款日">
            {info.extra?.paymentDate}
          </DescriptionList.Description>
        </DescriptionList>
      </Card>
      <Card title="担保流程">
        <Timeline bizNo={id} />
      </Card>
      <Card tabList={tabList} onTabChange={setActiveKey}>
        {tab[activeKey]()}
      </Card>
    </Card>
  )
}

export default Detail
