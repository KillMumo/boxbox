import React from 'react'
import { Form } from '@dragon/form'
import Steps from '@/components/Steps'
import { withProvider, usePageContext } from './store'
import Suspense from '@/components/Suspense'
import Card from '@/components/Card'

const Step1 = React.lazy(() => import('./pages/Step1'))
const Step2 = React.lazy(() => import('./pages/Step2'))
const Step3 = React.lazy(() => import('./pages/Step3'))

const steps = ['选择用户', '完善信息', '完成']
const Forms = [Step1, Step2, Step3]

const ImportUser = () => {
  const {
    step: { current }
  } = usePageContext()

  const Child = Forms[current - 1]

  return (
    <Card>
      <Steps steps={steps} current={current} />
      <Suspense>
        <Child />
      </Suspense>
    </Card>
  )
}

const Page = withProvider((props) => {
  const { form } = props

  return {
    form
  }
})(ImportUser)

export default Form.create()(Page)
