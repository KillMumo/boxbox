import React from 'react'
import Card from '@/components/Card'
import { Row, Col, Alert } from 'antd'
import DescriptionList from '@/components/DescriptionList'
import { useRequest } from '@dragon/hooks'
import { getCompanyDetail } from '@/services/platform'
import Upload from '@/components/Upload'
import { formatFileList } from '@/utils'
import styles from './styles.less'
import useDict from '@/hooks/useDict'

const Look = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props
  const orgType = useDict('org_type')

  const { loading: getDetailLoading, data = {} } = useRequest(() => getCompanyDetail(id))

  return (
    <Card transparent loading={getDetailLoading}>
      <Card title="企业信息">
        {data.refusedReason && (
          <Alert style={{ marginBottom: 24 }} message={data.refusedReason} type="error" />
        )}
        <DescriptionList border={false}>
          <DescriptionList.Description label="企业名称">{data.orgName}</DescriptionList.Description>
          <DescriptionList.Description label="企业类型">
            {orgType[data.orgType]}
          </DescriptionList.Description>
          <DescriptionList.Description label="营业执照编号">
            {data.licenseNumber}
          </DescriptionList.Description>
          <DescriptionList.Description label="组织机构代码">
            {data.orgCode}
          </DescriptionList.Description>
          <DescriptionList.Description label="统一社会信用代码">
            {data.socialCreditCode}
          </DescriptionList.Description>
          <DescriptionList.Description label="法人代表">
            {data.legalPersonName}
          </DescriptionList.Description>
          <DescriptionList.Description label="法人证件号">
            {data.legalPersonIdCard}
          </DescriptionList.Description>
          <DescriptionList.Description label="银行账户名称">
            {data.accountName}
          </DescriptionList.Description>
          <DescriptionList.Description label="开户行">
            {data.openSubBranch}
          </DescriptionList.Description>
          <DescriptionList.Description label="银行账号">
            {data.bankNumber}
          </DescriptionList.Description>
          <DescriptionList.Description label="管理员姓名">{data.admin}</DescriptionList.Description>
          <DescriptionList.Description label="管理员身份证号">
            {data.adminIdCard}
          </DescriptionList.Description>
          <DescriptionList.Description label="管理员手机号">
            {data.adminPhone}
          </DescriptionList.Description>
        </DescriptionList>
      </Card>
      <Card title="认证材料">
        <Row className={styles.uploadContainer} gutter={24}>
          <Col className={styles.uploadLabel} span={5}>
            营业执照复印件或统一社会信用代码复印件
          </Col>
          <Col span={18}>
            <Upload value={formatFileList(data, 'businessLicenseUrl')} showOnly />
          </Col>
        </Row>
        <Row className={styles.uploadContainer} gutter={24}>
          <Col className={styles.uploadLabel} span={5}>
            法人身份证复印件
          </Col>
          <Col span={18}>
            <Upload
              value={formatFileList(
                data,
                'legalPersonIdNumberFrontUrl',
                'legalPersonIdNumberBackUrl'
              )}
              showOnly
            />
          </Col>
        </Row>
        <Row className={styles.uploadContainer} gutter={24}>
          <Col className={styles.uploadLabel} span={5}>
            管理员身份证复印件
          </Col>
          <Col span={18}>
            <Upload value={formatFileList(data, 'idCardFrontUrl', 'idCardBackUrl')} showOnly />
          </Col>
        </Row>
        <Row className={styles.uploadContainer} gutter={24}>
          <Col className={styles.uploadLabel} span={5}>
            授权委托书
          </Col>
          <Col span={18}>
            <Upload value={formatFileList(data, 'authorizationLetterUrl')} showOnly />
          </Col>
        </Row>
        <Row className={styles.uploadContainer} gutter={24}>
          <Col className={styles.uploadLabel} span={5}>
            银行账户证明
          </Col>
          <Col span={18}>
            <Upload value={formatFileList(data, 'bankAccountEvidenceUrl')} showOnly />
          </Col>
        </Row>
      </Card>
    </Card>
  )
}

export default Look
