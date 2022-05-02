import React from 'react'
// import { Form } from '@dragon/form'
import Card from '@/components/Card'
import D from '@/components/DescriptionList'
import { useRequest } from '@dragon/hooks'
import { fetchAuthDetail, auth, fetchAuthTimeline } from '@/services/enterprise'
import ButtonGroup from '@/components/ButtonGroup'
import { Button, Icon, Popover, Form, Modal, message } from 'antd'
import RejectInfo from '@/components/RejectInfo'
import TextAreaForm from '@/components/ModalForm/TextAreaForm'
import useModalForm from '@/hooks/useModalForm'
import { companyStatus } from '@/common/dict'
// import { BankInfo } from '../Detail'
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
    legalPerson = {},
    adminUser = {},
    bankAccountList = [{}],
    cmyType
  } = data

  const { loading: rejectLoading, start: rejectReq } = useRequest(auth, { manual: true })
  // 驳回弹框
  const { open: openReject, props: rejectProps } = useModalForm({
    confirmLoading: rejectLoading,
    title: '驳回理由',
    afterValidate: async (v, c) => {
      const res = await rejectReq({
        id,
        status: 5,
        refusedReason: v.reject
      })
      if (res instanceof Error) return
      message.success('驳回成功')
      c()
      refresh()
    },
    extra: '注：一旦审核驳回，企业将无法使用该平台，请谨慎操作'
  })

  const { loading: sendBackLoading, start: sendBackReq } = useRequest(auth, { manual: true })
  // 退回弹框
  const { open: openSendBack, props: sendBackProps } = useModalForm({
    confirmLoading: sendBackLoading,
    title: '退回理由',
    afterValidate: async (v, c) => {
      const res = await sendBackReq({
        id,
        status: 4,
        returnReason: v.reject
      })
      if (res instanceof Error) return
      message.success('退回成功')
      c()
      refresh()
    }
  })

  // 渲染弹框
  const renderModal = () => {
    return (
      <React.Fragment>
        <TextAreaForm {...rejectProps} />
        <TextAreaForm {...sendBackProps} />
      </React.Fragment>
    )
  }

  // 渲染按钮
  const renderExtra = () => {
    const content = (
      <div>
        <div>退回：企业材料有误，退回后可修改材料重新提交审核</div>
        <div>驳回：企业不符合准入条件，驳回后不可重新提交审核</div>
      </div>
    )

    // 通过审批弹窗
    const handlePass = () => {
      Modal.confirm({
        title: '确定要审核通过',
        content: '一旦审核通过，该企业将认证成功',
        onOk: () => {
          return auth({
            id,
            status: 1
          }).then((res) => {
            if (res instanceof Error) return
            window.location.reload()
          })
        }
      })
    }

    return (
      <ButtonGroup>
        <Popover content={content}>
          <Icon type="question-circle" style={{ margin: '0 16px 0 0', verticalAlign: 'middle' }} />
        </Popover>
        <Button type="primary" onClick={handlePass}>
          通过
        </Button>
        <Button onClick={openSendBack}>退回</Button>
        <Button onClick={openReject}>驳回</Button>
      </ButtonGroup>
    )
  }

  // 驳回信息
  const renderReject = () => {
    return (
      [4, 5].includes(data.status) && (
        <RejectInfo
          title={data.status === 4 ? '已退回' : '已驳回'}
          desc={`备注：${
            data.status === 4 ? companyBasicInfo.returnReason : companyBasicInfo.refusedReason
          }`}
        />
      )
    )
  }

  return (
    <Card transparent loading={getDetailLoading}>
      {renderModal()}
      {renderReject()}
      <Card style={{marginBottom:'16px'}}>
        <Card.Header
          color={companyStatus[data.status]?.tagColor}
          name={companyStatus[data.status]?.name}
          extra={renderExtra()}
        >
          {companyBasicInfo.orgName}
        </Card.Header>
        入驻时间：{companyBasicInfo.createTime}
      </Card>
      <Card title="企业基本信息" style={{marginBottom:'16px'}}>
        <D>
          <I label="企业名称">{companyBasicInfo.orgName}</I>
          <I label="所属行业">{companyBasicInfo.orgType}</I>
          {/* <I label="统一社会信用代码">{companyBasicInfo.socialCreditCode}</I> */}
          {/* <I label="所属行业">{companyBasicInfo.orgType}</I> */}
          {/* <I label="注册资本">{`${companyBasicInfo.capital?.coin}${companyBasicInfo.capital?.type}`}</I> */}
          {/* <I label="公司地址" whole>
            {companyBasicInfo.address}
          </I> */}
          {/* <I label="经营范围" whole>
            {companyBasicInfo.scope}
          </I> */}
          {/* <I label="邮政编码">{companyBasicInfo.postalCode}</I> */}
          {/* <I label="企业传真号">{companyBasicInfo.orgFax}</I> */}
          {/* <I label="企业电话">{companyBasicInfo.orgPhone}</I> */}
          <I label="法人姓名">{legalPerson.legalPersonName}</I>
          <I label="法人身份证号">{legalPerson.legalPersonIdCard}</I>
          {cmyType === '0' && <I label="法人手机号">{legalPerson.legalPersonPhone}</I>}
          <I label="管理员姓名">{adminUser.name}</I>
          {/* <I label="管理员身份证号">{adminUser.idCard}</I> */}
          {/* <I label="管理员邮箱">{adminUser.orgAdminEmail}</I> */}
          <I label="管理员手机号">{adminUser.phone}</I>
        </D>
      </Card>
      <Card title="企业认证信息">
        <D>
          <I label="营业执照" whole>
            <DownloadItem list={companyBasicInfo?.businessLicenseUrl || []} />
          </I>
          <I label="法人身份证复印件" whole>
            <DownloadItem list={legalPerson?.legalPersonIdCardUrl || []} />
          </I>
          {cmyType === '0' && (
            <I label="管理员身份证复印件" whole>
              <DownloadItem list={adminUser?.idCardUrl || []} />
            </I>
          )}
        </D>
      </Card>
      {/* {bankAccountList.length !== 0 && (
        <Card title="银行账户信息">
          <BankInfo dataSource={bankAccountList} />
        </Card>
      )} */}
    </Card>
  )
}

export default Form.create()(Page)
