import React, { useCallback, useState } from 'react'
import { Alert, Form, Button, Modal } from 'antd'
import styles from './styles.less'
import ButtonGroup from '@/components/ButtonGroup'
import { useBoolean, useRequest } from '@dragon/hooks'
import { authUpload } from '@/services/register'
import router from 'umi/router'
import { fetchRegisterInfo } from '@/services/register'
import { saveState } from '@/common/store'
import { renderForm } from '@/utils/Form'
import useFormConfig from './hooks/useFormConfig'
import useOtherFormConfig from './hooks/useOtherFormConfig'
import { useSelector } from 'react-redux'

const formLayout = {
  className: styles.form,
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  },
  colon: false
}

const Auth = (props) => {
  const {
    form: { validateFields }
  } = props

  // redux数据
  const { status } = useSelector(({ status }) => ({
    status: status.orgStatus
  }))

  const { state: visible, setTrue: openModal, setFalse: closeModal } = useBoolean()

  // 企业类型 0:供应商 1:客户
  const [type, setType] = useState('1')

  const { loading: fetchRegisterLoading, start: fetchRegisterReq, data: info = {} } = useRequest(
    fetchRegisterInfo,
    {
      onSuccess: (res) => {
        // 判断当前企业类型
        if (res.bizOrganizationRegisterSubmitVO.cmyType === '0') setType('0')
        if (visible) {
          saveState(res.bizOrganizationRegisterSubmitVO, 'registerInfo')
          router.push(
            `/user/register/update?tenantId=${res.bizOrganizationRegisterSubmitVO.tenantId}`
          )
        }
      }
    }
  )

  // 表单配置
  const formConfig = useFormConfig(props.form, info.bizOrganizationRegisterSubmitVO)
  const otherFormConfig = useOtherFormConfig(props.form, info.bizOrganizationRegisterSubmitVO)

  const { loading: uploadLoading, start: uploadReq } = useRequest(authUpload, {
    manual: true,
    onSuccess: () => {
      router.replace('/auth/result')
    }
  })

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields((err, values) => {
        if (!err) {
          const validateType = info.bizOrganizationRegisterUploadVO?.socialCreditCodeUrl
            ? 'edit'
            : 'register'
          uploadReq({ ...values, validateType })
        }
      })
    },
    [info.bizOrganizationRegisterUploadVO, uploadReq, validateFields]
  )

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>企业认证</h3>
      <Alert
        message="开通碳账户综合服务平台，请上传以下带有公章的材料，格式可以是：jpg，jpeg，png大小不超过5M"
        type="warning"
        showIcon
      />
      <Form {...formLayout} onSubmit={handleSubmit}>
        {renderForm(type === '0' ? otherFormConfig : formConfig, {
          form: props.form,
          initialValue: info.bizOrganizationRegisterUploadVO || {}
        })}
        <ButtonGroup align="center">
          {status === 2 && <Button onClick={() => openModal()}>修改注册信息</Button>}
          <Button loading={uploadLoading} type="primary" htmlType="submit">
            提交
          </Button>
        </ButtonGroup>
        <Modal
          onOk={() => fetchRegisterReq()}
          confirmLoading={fetchRegisterLoading}
          width={433}
          title="确认返回"
          visible={visible}
          onCancel={() => closeModal()}
        >
          返回修改后，协议将作废。确认操作？
        </Modal>
      </Form>
    </div>
  )
}

export default Form.create()(Auth)
