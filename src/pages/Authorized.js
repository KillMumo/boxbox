import React from 'react'
import { connect } from 'dva'
import pathToRegexp from 'path-to-regexp'
import Exception from '@/components/Exception'

const cancelAuth = true

// 白名单
const whiteList = [
  '/',
  '/home',
  '/auth/edit',
  '/auth/upload',
  '/auth/result',
  '/account/settings',
  '/account/password',
  '/account/modifyPhone',
  '/account/modifyPhone/step2',
  '/account/modifyPhone/step3',
  '/message/list'
].map((i) => pathToRegexp(i))

/**
 * 权限校验
 * @param pathname 当前路由
 * @param regs
 */
function authorized(pathname, regs) {
  const regexp = [...whiteList, ...regs]
  return regexp.some((reg) => {
    return reg.test(pathname)
  })
}

const AuthComponent = ({ children, location, menuRegs, button }) => {
  const { pathname } = location

  if (cancelAuth) {
    return children
  }

  if (authorized(pathname, [...menuRegs, ...button])) {
    return children
  }

  return <Exception />
}

const mapStateToProps = ({ authorities }) => ({
  button: authorities.button.buttonReges,
  menuRegs: authorities.menu.routesReges
})

export default connect(mapStateToProps)(AuthComponent)
