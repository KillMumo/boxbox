import React from 'react'
import D from '@/components/DescriptionList'
import DownloadItem from '@/components/DownloadItem'
import { formatMoney } from '@/utils'
import DescriptionCompany from '../DescriptionCompany'
import { Empty, Table } from 'antd'
import Tabs from '../Tabs'
import JumpCompany from '../JumpCompany'
import TabNum from '../Tabs/TabNum'
const { TabPane } = Tabs
const { Description: I } = D

// 企业基本信息
export const CompanyBasicInfo = ({ data }) => {
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
      {data?.organizationRuleUrl && (
        <I label="企业章程" whole>
          <DownloadItem list={data.organizationRuleUrl || []} />
        </I>
      )}
      {data?.testFile && (
        <I label="测试新增字段" whole>
          <DownloadItem list={data.testFile || []} />
        </I>
      )}
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

// 银行信息
export const BankInfo = ({ data = {}, dataSource = [] }) => {
  const columns = [
    {
      title: '开户银行',
      dataIndex: 'openBank'
    },
    {
      title: '银行账号',
      dataIndex: 'bankNumber'
    },
    {
      title: '开户省市',
      key: 'khss',
      render: (_, r) => {
        return `${r.openProvince} ${r.openCity}`
      }
    },
    {
      title: '所属支行',
      dataIndex: 'openSubBranch'
    },
    {
      title: '账户类型',
      key: 'zhlx',
      render: (_, $, i) => {
        return i === 0 ? '基本户' : '一般户'
      }
    }
  ]

  return (
    <Table
      rowKey="bankNumber"
      dataSource={dataSource.filter(Boolean)}
      columns={columns}
      pagination={false}
    />
  )
}

// 供销关系信息
export const SupplyRelationInfo = ({ isSelf, data = {} }) => {
  return (
    <D>
      <DescriptionCompany
        label="企业全称"
        data={data.companyName}
        type="company"
      ></DescriptionCompany>
      <I label="近一年交易金额(元)">{formatMoney(data.lastTotalTrade)}</I>
      {isSelf && <I label="合作时长(月)">{data.cooperationTime}</I>}
      {!isSelf && <I label="占比">{data.proportion}</I>}
      {isSelf && (
        <I label="购销合同" whole>
          <DownloadItem list={data.contractUrl || []} />
        </I>
      )}
      {isSelf && (
        <I label="发票" whole>
          <DownloadItem list={data.invoice || []} />
        </I>
      )}
      {isSelf && (
        <I label="其他交易材料" whole>
          <DownloadItem list={data.tradeMaterials || []} />
        </I>
      )}
    </D>
  )
}

// 关联人信息
export const FamilyInfo = ({ parent, mate, child, orgName }) => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      render: (t) => <JumpCompany type="human" data={t} />
    },
    {
      title: '关系',
      dataIndex: 'relation',
      render: (t) => t || '-'
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      render: (t) => t || '-'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      render: (t) => t || '-'
    },
    {
      title: '关联企业',
      dataIndex: 'relatedCompany',
      render: (t) => <JumpCompany type="company" data={t} orgName={orgName} />
    }
  ]

  return (
    <Tabs animated={false}>
      <TabPane tab={<TabNum num={parent.length}>父母</TabNum>} key="父母">
        <Table rowKey="name" columns={columns} dataSource={parent} pagination={false} />
      </TabPane>
      <TabPane tab={<TabNum num={mate.length}>配偶</TabNum>} key="配偶">
        <Table rowKey="name" columns={columns} dataSource={mate} pagination={false} />
      </TabPane>
      <TabPane tab={<TabNum num={child.length}>子女</TabNum>} key="子女">
        <Table rowKey="name" columns={columns} dataSource={child} pagination={false} />
      </TabPane>
    </Tabs>
  )
}

// 管理员信息
export const AdminInfo = ({ data = {} }) => {
  if (!data?.name && !data?.idCard && data?.phone && !data?.idCardUrl) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return (
    <D>
      <I label="管理员姓名">{data?.name}</I>
      <I label="管理员身份证号">{data?.idCard}</I>
      <I label="管理员手机号">{data?.phone}</I>
      <I label="管理员身份证复印件" whole>
        <DownloadItem list={data?.idCardUrl || []} />{' '}
      </I>
    </D>
  )
}
