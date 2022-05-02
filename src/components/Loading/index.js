import React from 'react'
import PageLoading from './PageLoading'

const Loading = ({ loading, children }) => {
  if (loading) {
    return <PageLoading />
  }
  return children
}

export default Loading
