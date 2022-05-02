import React, { useCallback } from 'react'
import Link from 'umi/link'
import { Icon } from 'antd'
import GlobalHeader from '@/components/GlobalHeader'
import styles from './styles.less'
import { Button } from 'antd'
import { useCompanyConfig, useAdminConfig } from './form.config'
import Panel from './components/Panel'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'
import { submit } from '@/services/register'
import { Form, ConfigForm } from '@dragon/form'
import router from 'umi/router'
import { saveToken } from '@/common/token'
import { useSelector } from 'react-redux'

const formLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 15
  },
  colon: false,
  hideRequiredMark: false
}

const Register = (props) => {
  const {
    form,
    form: { validateFieldsAndScroll }
  } = props

  // redux数据
  const { pageConfig } = useSelector(({ pageConfig }) => ({
    pageConfig
  }))
  // 企业信息的表单config
  const companyFormConfig = useCompanyConfig(form)

  // 管理员表单config
  const adminFormConfig = useAdminConfig(form)

  // 提交请求
  const { loading: submitLoading, start: submitReq } = useRequest(submit, {
    manual: true,
    onSuccess: (res) => {
      saveToken(res)
      router.push('/user/register/success')
    }
  })

  // 提交的函数
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          const params = {
            ...values,
            inviteCode: pageConfig?.inviteCode
          }
          submitReq(params)
        }
      })
    },
    [pageConfig, submitReq, validateFieldsAndScroll]
  )

  return (
    <div>
      <div className={styles.title}>注册</div>
      <div className={styles.container}>
        <GlobalHeader
          left="注册"
          right={
            <Link to={'/user/login'}>
              我已注册，马上登陆
              <Icon type="right" />
            </Link>
          }
        />
        <div className={styles.subContainer}>
          <Form form={form} {...formLayout} onSubmit={handleSubmit}>
            {/* <Panel title="企业基本信息">
              <ConfigForm config={companyFormConfig} />
            </Panel> */}
            <Panel title="管理员信息">
              <ConfigForm config={adminFormConfig} />
            </Panel>
            <ButtonGroup align="center">
              <Button onClick={() => props.history.goBack()}>取消</Button>
              <Button loading={submitLoading} type="primary" htmlType="submit">
                提交
              </Button>
            </ButtonGroup>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Form.create()(Register)
