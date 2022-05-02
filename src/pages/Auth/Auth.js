import React, { useCallback } from 'react'
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

  const { state: visible, setTrue: openModal, setFalse: closeModal } = useBoolean()

  const { loading: fetchRegisterLoading, start: fetchRegisterReq, data: info = {} } = useRequest(
    fetchRegisterInfo,
    {
      onSuccess: (res) => {
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
        message="开通海曙中小企业融资担保区块链平台，请上传以下带有公章的材料，格式可以是：jpg，jpeg，png大小不超过5M"
        type="warning"
        showIcon
      />
      <Form {...formLayout} onSubmit={handleSubmit}>
        {renderForm(formConfig, {
          form: props.form,
          initialValue: info.bizOrganizationRegisterUploadVO || {}
        })}
        <ButtonGroup align="center">
          <Button onClick={() => openModal()}>修改注册信息</Button>
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
