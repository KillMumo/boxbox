import React, { useEffect } from 'react'
import { Form } from '@dragon/form'
import Steps from '@/components/Steps'
import { withProvider, usePageContext } from './store'
import styles from './styles.less'
import Suspense from '@/components/Suspense'
import { removeState } from '@/common/store'
import Card from '@/components/Card'

const Step1 = React.lazy(() => import('./pages/Step1'))
const Step2 = React.lazy(() => import('./pages/Step2'))

const Zu1 = React.lazy(() => import('./Zus/Zu1'))
const Zu2 = React.lazy(() => import('./Zus/Zu2'))

const hostname = 'induschain'
const ZuChild = hostname === 'induschain' ? Zu1 : Zu2

const steps = ['补充材料', '完善企业信息']
const Forms = [Step1, Step2]

const formLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  },
  colon: false,
  hideRequiredMark: true
}

const Auth = () => {
  const {
    form,
    step: { current },
    initialValue,
    loading: { registerLoading, bankLoading }
  } = usePageContext()

  const Child = Forms[current - 1]

  useEffect(() => {
    return () => {
      removeState('bizCheckInfoSubmitRO')
      removeState('bizSubmitBankInfo')
    }
  }, [])

  return (
    <Card transparent loading={registerLoading || bankLoading}>
      <div className={styles.title}>提交认证材料</div>
      <Form
        form={form}
        initialValue={{ isRealControlPerson: 1, ...initialValue }}
        {...formLayout}
        className={styles.container}
      >
        <Steps steps={steps} current={current} />
        <div className={styles.subContainer}>
          <Suspense>
            <ZuChild />
          </Suspense>
          <Suspense>
            <Child />
          </Suspense>
        </div>
      </Form>
    </Card>
  )
}

const Page = withProvider((props) => {
  const {
    form,
    location: { pathname }
  } = props

  return {
    form,
    isEdit: pathname.indexOf('edit') !== -1
  }
})(Auth)

export default Form.create()(Page)
