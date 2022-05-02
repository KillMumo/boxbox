import React, { useCallback } from 'react'
import Panel from './components/Panel'
import { Form, Button } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'
import { submitStep2 } from '@/services/register'
import { saveToken } from '@/common/token'
import router from 'umi/router'
import { fetchState } from '@/common/store'
import { renderForm } from '@/utils/Form'
import { useBankConfig } from './hooks/useFormConfig'

const formLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 15
  },
  colon: false
}

const Step = (props) => {
  const {
    location: { pathname },
    form: { validateFields }
  } = props

  const isUpdate = pathname.indexOf('update') !== -1

  // 基本户表单信息
  const bankFormConfig = useBankConfig(props.form)

  const registerInfo = fetchState('registerInfo')

  const { loading: submitLoading, start: submitReq } = useRequest(submitStep2, {
    manual: true,
    onSuccess: (res) => {
      saveToken(res)
      router.push(`/user/register${isUpdate ? '/update/' : '/'}step3`)
    }
  })

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields((err, values) => {
        if (!err) {
          const params = {
            ...registerInfo,
            ...values
          }
          submitReq(params)
        }
      })
    },
    [registerInfo, submitReq, validateFields]
  )

  return (
    <Form {...formLayout} onSubmit={handleSubmit}>
      <Panel title="银行基本户信息">
        {renderForm(bankFormConfig, { form: props.form, initialValue: registerInfo })}
        <ButtonGroup align="center">
          <Button onClick={() => props.history.goBack()}>上一步</Button>
          <Button loading={submitLoading} type="primary" htmlType="submit">
            下一步
          </Button>
        </ButtonGroup>
      </Panel>
    </Form>
  )
}

export default Form.create()(Step)
