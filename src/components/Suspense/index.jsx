import React, { Suspense as S } from 'react'
import PageLoading from '../Loading/PageLoading'

const Suspense = (props) => {
  const { children } = props
  return <S fallback={<PageLoading />}>{children}</S>
}

export default Suspense
