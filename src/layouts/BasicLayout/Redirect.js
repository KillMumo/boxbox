import React, { useEffect } from 'react'
import PageLoading from '@/components/Loading/PageLoading'
import R from 'umi/redirect'
import { fetchToken } from '@/common/token'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

// 用于登录之后和进到系统之前的状态判断
const Redirect = ({ children }) => {
  const isLogin = !!fetchToken()
  const dispatch = useDispatch()

  const loading = useSelector(({ loading }) => loading.effects['status/fetchStatus'])

  useEffect(() => {
    if (isLogin) {
      dispatch({
        type: 'status/fetchStatus'
      })
    }
  }, [dispatch, isLogin])

  // const { loading } = useRequest(fetchStatus, {
  //   onSuccess: (res) => {
  //
  //   }
  // })

  return isLogin ? (
    <React.Fragment>{loading ? <PageLoading /> : children}</React.Fragment>
  ) : (
    <R to={'/user/login'} />
  )
}

export default Redirect
