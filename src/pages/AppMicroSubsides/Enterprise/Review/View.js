import React from 'react'
import Card from '@/components/Card'
import D from '@/components/DescriptionList'
import { useRequest } from '@dragon/hooks'
import { fetchAuthDetail, auth, fetchAuthTimeline } from '@/services/microSubsidy/enterprise'
import ButtonGroup from '@/components/ButtonGroup'
import { Button, Icon, Popover, Form, Modal, message } from 'antd'
import RejectInfo from '@/components/RejectInfo'
import TextAreaForm from '@/components/ModalForm/TextAreaForm'
import useModalForm from '@/hooks/useModalForm'
import { companyStatus } from '@/common/dict'
import Upload from '@/components/Upload'
import Timeline, { useTimeline } from '@/components/Timeline'
// import { formatMoney } from '@/utils'

const { Description: I } = D

const Look = (props) => {
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
    realControlPerson = {},
    adminUser = {},
    bankAccountList = [{}],
    materialVO = {}
  } = data

  // 时间轴信息
  const { props: timelineProps, refresh: refreshTimeline } = useTimeline(() =>
    fetchAuthTimeline(id)
  )

  const { loading: rejectLoading, start: rejectReq } = useRequest(auth, { manual: true })
  // 驳回弹框
  const { open: openReject, props: rejectProps } = useModalForm({
    form: props.form,
    confirmLoading: rejectLoading,
    title: '驳回理由',
    afterValidate: async (v, c) => {
      await rejectReq({
        id,
        status: 5,
        refusedReason: v.reject
      })
      message.success('驳回成功')
      c()
      refresh()
      refreshTimeline()
    }
  })

  const { loading: sendBackLoading, start: sendBackReq } = useRequest(auth, { manual: true })
  // 退回弹框
  const { open: openSendBack, props: sendBackProps } = useModalForm({
    form: props.form,
    confirmLoading: sendBackLoading,
    title: '退回理由',
    afterValidate: async (v, c) => {
      await sendBackReq({
        id,
        status: 4,
        returnReason: v.reject
      })
      message.success('退回成功')
      c()
      refresh()
      refreshTimeline()
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
        <div>退回：注册认证信息有待修改，允许重新提交</div>
        <div>驳回：注册认证信息无效，关闭企业账号</div>
      </div>
    )

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
      data.status === 3 && (
        <ButtonGroup>
          <Popover auth="企业管理-企业审核-详情页-通过" content={content}>
            <Icon
              type="question-circle"
              style={{ margin: '0 16px 0 0', verticalAlign: 'middle' }}
            />
          </Popover>
          <Button auth="企业管理-企业审核-详情页-通过" type="primary" onClick={handlePass}>
            通过
          </Button>
          <Button auth="企业管理-企业审核-详情页-退回" onClick={openSendBack}>
            退回
          </Button>
          <Button auth="企业管理-企业审核-详情页-驳回" onClick={openReject}>
            驳回
          </Button>
        </ButtonGroup>
      )
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

  // 是否为实控人
  const isRealControlPerson = legalPerson.isRealControlPerson === 1

  return (
    <Card transparent loading={getDetailLoading}>
      {renderModal()}
      {renderReject()}
      <Card>
        <Card.Header
          color={companyStatus[data.status]?.tagColor}
          name={companyStatus[data.status]?.name}
          extra={renderExtra()}
        >
          {companyBasicInfo.orgName}
        </Card.Header>
        注册时间：{companyBasicInfo.createTime}
      </Card>
      <Card title="审核记录">
        <Timeline {...timelineProps} />
      </Card>
      <Card title="企业信息">
        <D>
          <I label="租户ID">{companyBasicInfo.tenantId}</I>
          <I label="企业全称">{companyBasicInfo.orgName}</I>
          <I label="统一社会信用代码">{companyBasicInfo.socialCreditCode}</I>
          <I label="所属行业">{companyBasicInfo.orgType}</I>
          <I label="注册资本">{`${companyBasicInfo.capital?.coin}${companyBasicInfo.capital?.type}`}</I>
          <I label="公司地址" whole>
            {companyBasicInfo.address}
          </I>
          <I label="经营范围" whole>
            {companyBasicInfo.scope}
          </I>
          <I label="法人姓名">{legalPerson.legalPersonName}</I>
          <I label="法人身份证号">{legalPerson.legalPersonIdCard}</I>
          <I label="法人手机号">{legalPerson.legalPersonPhone}</I>
          <I label="法人是否为实控人">{isRealControlPerson ? '是' : '否'}</I>
          {!isRealControlPerson && (
            <I label="实控人姓名">{realControlPerson.realControlPersonName}</I>
          )}
          {!isRealControlPerson && (
            <I label="实控人身份证号">{realControlPerson.realControlPersonIdCard}</I>
          )}
          {!isRealControlPerson && (
            <I label="实控人手机号">{realControlPerson.realControlPersonPhone}</I>
          )}
          <I label="管理员姓名">{adminUser.name}</I>
          <I label="管理员身份证号">{adminUser.idCard}</I>
          <I label="管理员手机号">{adminUser.phone}</I>
        </D>
      </Card>
      <Card title="银行基本户信息">
        <D>
          <I label="开户银行">{bankAccountList[0].openBank}</I>
          <I label="银行账号">{bankAccountList[0].bankNumber}</I>
          <I label="开户省市">
            {bankAccountList[0].openProvince} {bankAccountList[0].openCity}
          </I>
          <I label="所属支行">{bankAccountList[0].openSubBranch}</I>
        </D>
      </Card>
      <Card title="企业认证材料">
        <D>
          <I whole label="营业执照复印件或统一社会信用代码复印件">
            {materialVO.businessLicenseUrl ? (
              <Upload showOnly value={materialVO.businessLicenseUrl || []} />
            ) : (
              '无'
            )}
          </I>
          <I whole label="法人身份证复印件">
            {materialVO.legalPersonIdCardUrl ? (
              <Upload showOnly value={materialVO.legalPersonIdCardUrl || []} />
            ) : (
              '无'
            )}
          </I>
          {!isRealControlPerson && (
            <I whole label="实控人身份证复印件">
              {materialVO.realControlPersonIdCardUrl ? (
                <Upload showOnly value={materialVO.realControlPersonIdCardUrl || []} />
              ) : (
                '无'
              )}
            </I>
          )}
          <I whole label="管理员身份证复印件">
            {materialVO.adminIdCardUrl ? (
              <Upload showOnly value={materialVO.adminIdCardUrl || []} />
            ) : (
              '无'
            )}
          </I>
        </D>
      </Card>
    </Card>
  )
}

export default Form.create()(Look)
