import React from 'react'
import Card from '@/components/Card'
import D from '@/components/DescriptionList'
import { useRequest } from '@dragon/hooks'
import { getCompanyDetail } from '@/services/platform'
import ButtonGroup from '@/components/ButtonGroup'
import { Button } from 'antd'
import RejectInfo from '@/components/RejectInfo'

const { Description: I } = D

const Look = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  const { loading: getDetailLoading, data = {} } = useRequest(() => getCompanyDetail(id))

  const renderExtra = () => {
    return (
      <ButtonGroup>
        <Button type="primary">通过</Button>
        <Button>退回</Button>
        <Button>驳回</Button>
      </ButtonGroup>
    )
  }

  const renderModal = () => {
    return null
  }

  const renderReject = () => {
    return <RejectInfo />
  }

  return (
    <Card transparent loading={getDetailLoading}>
      {renderModal()}
      {renderReject()}
      <Card>
        <Card.Header color="gold" name="待填写" extra={renderExtra()}>
          宁波永一贸易有限公司
        </Card.Header>
        注册时间：2020-02-02
      </Card>
      <Card title="审核记录"></Card>
      <Card title="企业信息">
        <D border={false}>
          <I label="租户ID">{data.orgName}</I>
          <I label="企业全称">{data.orgName}</I>
          <I label="企业类型"></I>
          <I label="统一社会信用代码">{data.licenseNumber}</I>
          <I label="公司地址" whole>
            {data.orgCode}
          </I>
          <I label="经营范围" whole>
            {data.socialCreditCode}
          </I>
          <I label="法人姓名">{data.legalPersonName}</I>
          <I label="法人身份证号">{data.legalPersonIdCard}</I>
          <I label="法人手机号">{data.accountName}</I>
          <I label="法人是否为实控人">{data.openSubBranch}</I>
          <I label="实控人姓名">{data.bankNumber}</I>
          <I label="实控人身份证号">{data.admin}</I>
          <I label="实控人手机号">{data.adminIdCard}</I>
          <I label="管理员姓名">{data.adminPhone}</I>
          <I label="管理员身份证号">{data.adminPhone}</I>
          <I label="管理员手机号">{data.adminPhone}</I>
        </D>
      </Card>
      <Card title="银行基本户信息">
        <D>
          <I label="开户银行">{data.adminPhone}</I>
          <I label="银行账号">{data.adminPhone}</I>
          <I label="开户省市">{data.adminPhone}</I>
          <I label="所属支行">{data.adminPhone}</I>
        </D>
      </Card>
      <Card title="企业认证材料">
        <D>
          <I whole label="营业执照复印件或统一社会信用代码复印件">
            {data.adminPhone}
          </I>
          <I whole label="法人身份证复印件">
            {data.adminPhone}
          </I>
          <I whole label="管理员身份证复印件">
            {data.adminPhone}
          </I>
        </D>
      </Card>
    </Card>
  )
}

export default Look
