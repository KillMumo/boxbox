import React from 'react'
import { Form, Button, Input } from 'antd'
import { useCompanyConfig, useAdminConfig } from './hooks/useFormConfig'
import Panel from './components/Panel'
import ButtonGroup from '@/components/ButtonGroup'
import Link from 'umi/link'
import router from 'umi/router'
import { useRequest } from '@dragon/hooks'
import { submitStep1 } from '@/services/register'
import { fetchState, saveState } from '@/common/store'
import { renderForm } from '@/utils/Form'

const formLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 15
  },
  colon: false,
  hideRequiredMark: true,
}

const Step = (props) => {
  const {
    form,
    location: {
      pathname,
      query: { tenantId }
    },
    form: { validateFieldsAndScroll }
  } = props

  // 本地暂存的注册填的信息
  const registerInfo = fetchState('registerInfo')

  // 是否是更新页面
  const isUpdate = pathname.indexOf('update') !== -1

  // 邀请码表单Config
  const inviteConfig = [
    {
      itemProps: { label: '邀请码' },
      rules: [
        {
          required: true,
          message: '请输入邀请码'
        }
      ],
      name: 'tenantId', // 字段名
      children: <Input placeholder="请输入" />
    }
  ]

  // 企业信息的表单config
  const companyFormConfig = useCompanyConfig(form, isUpdate, registerInfo)

  // 管理员表单config
  const adminFormConfig = useAdminConfig(form, isUpdate)

  // 提交请求
  const { loading: submitLoading, start: submitReq } = useRequest(submitStep1, { manual: true })

  // 提交的函数
  const handleSubmit = (e) => {
    e.preventDefault()
    validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const params = {
          ...registerInfo,
          ...values,
          validateType: isUpdate ? 'edit' : 'register',
          tenantId: tenantId ? tenantId : values.tenantId
        }
        const res = await submitReq(params)
        if (res instanceof Error) return
        saveState({ ...registerInfo, ...params }, 'registerInfo')
        router.push(`/user/register${isUpdate ? '/update/' : '/'}step2`)
      }
    })
  }

  return (
    <Form {...formLayout} onSubmit={handleSubmit}>
      {!tenantId && (
        <Panel title="邀请信息">
          {renderForm(inviteConfig, { form, initialValue: { ...registerInfo } })}
        </Panel>
      )}
      <Panel title="企业信息">
        {renderForm(companyFormConfig, {
          form,
          initialValue: { isRealControlPerson: 1, ...registerInfo }
        })}
      </Panel>
      <Panel title="管理员信息">
        {renderForm(adminFormConfig, { form, initialValue: registerInfo })}
      </Panel>
      <ButtonGroup align="center">
        <Button>
          <Link to="/user/login">取消</Link>
        </Button>
        <Button loading={submitLoading} type="primary" htmlType="submit">
          下一步
        </Button>
      </ButtonGroup>
    </Form>
  )
}

export default Form.create()(Step)
