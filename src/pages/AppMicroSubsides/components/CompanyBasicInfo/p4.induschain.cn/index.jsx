import React from 'react'
import D from '@/components/DescriptionList'
import DownloadItem from '@/components/DownloadItem'
import DescriptionCompany from '../../DescriptionCompany'

const { Description: I } = D

// 企业基本信息
const CompanyBasicInfo = ({ data }) => {
  const isRealControl = data.isRealControlPerson === 1

  return (
    <D>
      <I label="企业全称">{data.orgName}</I>
      <I label="统一社会信用代码">{data.socialCreditCode}</I>
      <I label="所属行业">{data.orgType}</I>
      <I label="注册资本" whole>
        {data.capital?.coin}
        {data.capital?.type}
      </I>
      <I label="公司地址" whole>
        {data.address}
      </I>
      <I label="经营范围" whole>
        {data.scope}
      </I>
      <I label="营业执照" whole>
        <DownloadItem list={data.businessLicenseUrl || []} />
      </I>
      <I label="企业章程" whole>
        <DownloadItem list={data.organizationRuleUrl || []} />
      </I>
      {/* <I label="法人姓名">{data.legalPersonName}</I> */}
      <DescriptionCompany label="法人姓名" data={data.legalPersonName} type="human" />
      <I label="法人身份证号">{data.legalPersonIdCard}</I>
      <I label="法人手机号">{data.legalPersonPhone}</I>
      <I label="法人身份证复印件" whole>
        <DownloadItem list={data.legalPersonIdCardUrl || []} />
      </I>
      <I label="法人是否为实控人">{isRealControl ? '是' : '否'}</I>
      {/* {!isRealControl && <I label="实控人姓名">{data.realControlPersonName}</I>} */}
      {!isRealControl && (
        <DescriptionCompany label="实控人姓名" data={data.realControlPersonName} type="human" />
      )}
      {!isRealControl && <I label="实控人身份证号">{data.realControlPersonIdCard}</I>}
      {!isRealControl && <I label="实控人手机号">{data.realControlPersonPhone}</I>}
      {!isRealControl && (
        <I label="实控人身份证复印件" whole>
          <DownloadItem list={data.realControlPersonIdCardUrl || []} />
        </I>
      )}
    </D>
  )
}

export default CompanyBasicInfo
