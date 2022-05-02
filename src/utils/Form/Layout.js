import React from 'react'
import DefaultLayout from './DefaultLayout'

const Layout = (props) => {
  const { children, config } = props

  // 一个config item 的config
  const { hidden, layout, ...layoutProps } = config

  const Inner = {
    container: layout?.container || DefaultLayout,
    props: layout?.props || {}
  }

  return (
    <Inner.container {...layoutProps} {...Inner.props}>
      {children}
    </Inner.container>
  )
}

export default Layout
