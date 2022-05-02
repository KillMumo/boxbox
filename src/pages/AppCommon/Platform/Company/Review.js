import React from 'react'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import { useRequest, useBoolean } from '@dragon/hooks'
import { getCompanyDetail, checkOrg } from '@/services/platform'
import { CompanyStatus } from '@/common/map'
import { Row, Col, Button, Form, Alert, Modal, message } from 'antd'
import Upload from '@/components/Upload'
import { formatFileList } from '@/utils'
import styles from './styles.less'
import ButtonGroup from '@/components/ButtonGroup'
import ModalForm from '@/components/ModalForm'
import { TextArea } from '@/components/FormItems'
import fieldValidator from '@/utils/fieldValidator'
import router from 'umi/router'

const Look = (props) => {
  const {
    match: {
      params: { id }
    },
    form: { getFieldDecorator }
  } = props

  const { loading: getDetailLoading, data = {} } = useRequest(() => getCompanyDetail(id))

  const { loading: checkLoading, start: checkOrgReq } = useRequest(checkOrg, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功')
      router.push('/platform/company')
    }
  })

  const { state: passVisible, toggle: togglePass } = useBoolean()
  const { state: rejectVisible, toggle: toggleReject } = useBoolean()

  return (
    <Card transparent loading={getDetailLoading}>
      <Card title="企业信息">
        <DescriptionList border={false}>
          <DescriptionList.Description label="企业名称">{data.orgName}</DescriptionList.Description>
          <DescriptionList.Description label="企业类型">
            {CompanyStatus.map[data.status]}
          </DescriptionList.Description>
          <DescriptionList.Description label="营业执照编号">
            {data.licenseNumber}
          </DescriptionList.Description>
          <DescriptionList.Description label="组织机构代码">
            {data.cmyOrgCode}
          </DescriptionList.Description>
          <DescriptionList.Description label="统一社会信用代码">
            {data.socialCreditCode}
          </DescriptionList.Description>
          <DescriptionList.Description label="法人代表">
            {data.legalPersonName}
          </DescriptionList.Description>
          <DescriptionList.Description label="法人证件号">
            {data.legalPersonCertificate}
          </DescriptionList.Description>
          <DescriptionList.Description label="银行账户名称">
            {data.accountName}
          </DescriptionList.Description>
          <DescriptionList.Description label="开户行">
            {data.openSubBranch}
          </DescriptionList.Description>
          <DescriptionList.Description label="银行账号">
            {data.adminBankCard}
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
        <Row>
          <ButtonGroup align="center">
            <Button onClick={() => toggleReject(true)}>驳回</Button>
            <Button type="primary" onClick={() => togglePass(true)}>
              审核通过
            </Button>
          </ButtonGroup>
          <ModalForm
            form={props.form}
            visible={rejectVisible}
            confirmLoading={checkLoading}
            onCancel={() => toggleReject(false)}
            title="确认驳回"
            afterValidate={(v) => checkOrgReq({ id, status: '4', refusedReason: v.reject })}
          >
            <Form>
              <Alert
                style={{ marginBottom: 24 }}
                message="温馨提示：驳回后该操作无法撤销，流程终止。"
                type="warning"
              />
              <Form.Item>
                {getFieldDecorator('reject', {
                  rules: [
                    {
                      validator: fieldValidator,
                      required: true,
                      name: '驳回信息',
                      length: { max: 100 }
                    }
                  ]
                })(<TextArea placeholder="请填写驳回理由（必填）" />)}
              </Form.Item>
            </Form>
          </ModalForm>
          <Modal
            title="审核通过"
            visible={passVisible}
            confirmLoading={checkLoading}
            onCancel={() => togglePass(false)}
            onOk={() => checkOrgReq({ id, status: '1' })}
          >
            请确认企业信息及认证材料无误，审批通过后无法修改。
          </Modal>
        </Row>
      </Card>
    </Card>
  )
}

export default Form.create()(Look)
