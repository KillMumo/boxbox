import React from 'react'
import Card from '@/components/Card'
import D from '@/components/DescriptionList'
import { useRequest } from '@dragon/hooks'
import { fetchAuthDetail } from '@/services/enterprise'
import { Form } from 'antd'
import DownloadItem from '@/components/DownloadItem'

const { Description: I } = D

const Page = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  // 获取页面详情
  const { loading: getDetailLoading, data = {}, start: refresh } = useRequest(() =>
    fetchAuthDetail(id)
  )
  const {
    companyBasicInfo = {},
    legalPerson = {}
  } = data


  return (
    <Card transparent loading={getDetailLoading}>
      <Card title="供应商基本信息" style={{marginBottom:'16px'}}>
        <D>
          <I label="企业名称">{companyBasicInfo.orgName}</I>
          <I label="企业地址">{companyBasicInfo.orgType}</I>
          <I label="联系人姓名">{legalPerson.legalPersonName}</I>
          <I label="联系人电话">{legalPerson.legalPersonIdCard}</I>
        </D>
      </Card>
      <Card title="模切版基本信息">
        <D>
        <I label="成品盒长(mm)">{companyBasicInfo.orgName}</I>
          <I label="成品盒宽(mm)">{companyBasicInfo.orgType}</I>
          <I label="成品盒高(mm)">{companyBasicInfo.orgName}</I>
          <I label="盒型种类">{companyBasicInfo.orgType}</I>
          <I label="最新编辑日期">{companyBasicInfo.orgType}</I>
          <I label="数字文件" whole>
            <DownloadItem list={companyBasicInfo?.businessLicenseUrl || []} />
          </I>
          {/* <I label="法人身份证复印件" whole>
            <DownloadItem list={legalPerson?.legalPersonIdCardUrl || []} />
          </I>
          {cmyType === '0' && (
            <I label="管理员身份证复印件" whole>
              <DownloadItem list={adminUser?.idCardUrl || []} />
            </I>
          )} */}
        </D>
      </Card>
    </Card>
  )
}

export default Form.create()(Page)
