import React from 'react'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { Button } from 'antd'
import {
  // CompanyBasicInfo,
  BankInfo,
  FamilyInfo,
  AdminInfo
} from '@/pages/AppMicroSubsides/components/Detail'
import SupplyRelationInfo from '../../../../../components/SupplyRelationInfo'
import Timeline from '@/components/Timeline'
import { useSelector } from 'react-redux'
import { withProvider, usePageContext } from './store'
import Suspense from '@/components/Suspense'
import { timeFormat } from '@/utils'

const hostname = window.location.hostname
const CompanyBasicInfo = React.lazy(() =>
  import(`@/pages/AppMicroSubsides/components/CompanyBasicInfo/${hostname}`)
)

const View = (props) => {
  const orgId = useSelector(({ user }) => user.user.orgId)

  const { loading, data, timelineProps } = usePageContext()
  const { isLockEdit = true } = data

  const renderExtra = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ marginRight: 60 }}>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', fontWeight: 400 }}>信息完善分</div>
          <div style={{ fontSize: 24, color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>
            {data.infoPerfection}
          </div>
        </div>
        <div
          style={{
            width: 1,
            height: 60,
            backgroundColor: 'rgba(238, 238, 238, 1)',
            marginRight: 60
          }}
        ></div>
        <ButtonGroup>
          <Button
            disabled={isLockEdit}
            to={`/msUserCenter/companyInfo/edit/${orgId}`}
            type="primary"
          >
            编辑
          </Button>
        </ButtonGroup>
      </div>
    )
  }

  return (
    <Card loading={loading} transparent>
      <Card>
        <Card.Header extra={renderExtra()}>{data.companyBasicInfoVO?.orgName}</Card.Header>
        入驻时间：{timeFormat(data.createTime, 'ymd')}
      </Card>
      <Card title="更新记录">
        <Timeline {...timelineProps} />
      </Card>
      <Card title="企业基本信息">
        <Suspense>
          <CompanyBasicInfo
            data={{
              uid: data.uid,
              ...data.companyBasicInfoVO,
              ...data.legalPersonVO,
              ...data.realControlPerson
            }}
          />
        </Suspense>
      </Card>
      <Card title="银行账户信息">
        <BankInfo dataSource={[data.baseAccount, ...(data.generalAccount || [])]} />
      </Card>
      <Card title="供销关系">
        <SupplyRelationInfo data={data} orgName={data.companyBasicInfoVO?.orgName} />
      </Card>
      <Card title="关联人信息">
        <FamilyInfo
          parent={data.parent || []}
          mate={data.mate || []}
          child={data.children || []}
          orgName={data.companyBasicInfoVO?.orgName}
        />
      </Card>
      <Card title="管理员信息">
        <AdminInfo data={data.admin} />
      </Card>
    </Card>
  )
}
const Page = withProvider()(View)
export default Page
