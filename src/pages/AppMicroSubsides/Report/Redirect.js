import React, { useEffect } from 'react'
import PageLoading from '@/components/Loading/PageLoading'
import R from 'umi/redirect'
import { fetchToken, saveToken } from '@/common/token'
import { getPageQuery } from '@/utils'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

// 用于登录之后和进到系统之前的状态判断
const Redirect = ({ children }) => {
  const isLogin = !!fetchToken()
  const token = getPageQuery()?.token
  const dispatch = useDispatch()

  const loading = useSelector(({ loading }) => loading.effects['status/fetchStatusReport'])

  useEffect(() => {
    if (isLogin || token) {
      if (token && token !== fetchToken()) {
        saveToken(token)
      }
      dispatch({
        type: 'status/fetchStatusReport'
      })
    }
  }, [dispatch, isLogin, token])

  return isLogin || token ? (
    <React.Fragment>{loading ? <PageLoading /> : children}</React.Fragment>
  ) : (
    <R to="/user/login" />
  )
}

export default Redirect
