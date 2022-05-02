import React from 'react'
import { Form } from '@dragon/form'
import Suspense from '@/components/Suspense'
import { withProvider } from './store'

const hostname = window.location.hostname
const ZuChild = React.lazy(() => import(`./Tenants/${hostname}`))

const Auth = (props) => {
  return (
    <Suspense>
      <ZuChild props={props} />
    </Suspense>
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
