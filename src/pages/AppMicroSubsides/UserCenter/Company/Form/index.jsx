import React from 'react'
import { Form } from '@dragon/form'
import Suspense from '@/components/Suspense'
import { withProvider } from './store'

const hostname = window.location.hostname
const ZuChild = React.lazy(() => import(`./Tenants/${hostname}`))

const CompanyForm = () => {
  return (
    <Suspense>
      <ZuChild />
    </Suspense>
  )
}

const Page = withProvider((props) => {
  const {
    form,
    match: {
      params: { id }
    }
  } = props

  return {
    form,
    id
  }
})(CompanyForm)

export default Form.create()(Page)
