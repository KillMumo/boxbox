import React from 'react'
import Suspense from '@/components/Suspense'

const hostname = window.location.hostname
const ZuChild = React.lazy(() => import(`./Tenants/${hostname}`))

const View = () => {
  return (
    <Suspense>
      <ZuChild />
    </Suspense>
  )
}

export default View
