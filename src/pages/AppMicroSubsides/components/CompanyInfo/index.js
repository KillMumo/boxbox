import React from 'react'
import {
  // CompanyBasicInfo,
  BankInfo,
  FamilyInfo,
  AdminInfo
} from '../Detail'
import SupplyRelationInfo from '../SupplyRelationInfo'
import Wrap from '../Wrap'
import Suspense from '@/components/Suspense'

const hostname = window.location.hostname
const CompanyBasicInfo = React.lazy(() => import(`../CompanyBasicInfo/${hostname}`))

const CompanyInfo = ({ data, hideAdmin = false, hideSupply = false }) => {
  // const {
  // dataSource = 0,
  // supplierSelf = [],
  // clientSelf = [],
  // supplierOther = [],
  // clientOther = []
  // } = data

  // const isSelf = dataSource === 0
  // const supplier = dataSource === 0 ? supplierSelf : supplierOther
  // const client = dataSource === 0 ? clientSelf : clientOther

  return (
    <React.Fragment>
      <Wrap title="企业基本信息">
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
      </Wrap>
      <Wrap title="银行账户信息">
        <BankInfo dataSource={[data.baseAccount, ...(data.generalAccount || [])]} />
      </Wrap>
      <Wrap hidden={hideSupply} title="供销关系">
        <SupplyRelationInfo data={data} orgName={data.companyBasicInfoVO?.orgName} />
      </Wrap>
      <Wrap title="关联人信息" hidden={!data.parent && !data.mate && !data.children}>
        <FamilyInfo
          parent={data.parent || []}
          mate={data.mate || []}
          child={data.children || []}
          orgName={data.companyBasicInfoVO?.orgName}
        />
      </Wrap>
      <Wrap hidden={hideAdmin}>
        <AdminInfo data={data.admin} />
      </Wrap>
    </React.Fragment>
  )
}

export default CompanyInfo
