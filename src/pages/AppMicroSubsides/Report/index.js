import React, { useEffect, useRef } from 'react'
import { BackTop } from 'antd'
import { fetchToken, saveToken } from '@/common/token'
import { getPageQuery } from '@/utils'
import router from 'umi/router'
import styles from './styles.less'
import RedirectComp from './Redirect'
import { useDispatch } from 'react-redux'

const Index = ({ children }) => {
  const scrollRef = useRef(null)
  const token = getPageQuery()?.token
  const isLogin = !!fetchToken()

  const dispatch = useDispatch()

  const backTopImg = require('../../../assets/BackTop.png')

  useEffect(() => {
    if (!isLogin && !token) {
      router.push('/user/login')
    }
    if (token && token !== fetchToken()) {
      saveToken(token)
    }
    // 获取页面配置信息
    dispatch({
      type: 'pageConfig/fetchConfig'
    })
  }, [token, isLogin, dispatch])

  const renderBackTop = () => {
    return (
      <BackTop visibilityHeight={380} style={{ right: 40 }}>
        <img src={backTopImg} alt="" style={{ width: 40, height: 40 }} />
      </BackTop>
    )
  }

  return (
    <RedirectComp>
      <div className={styles.reportWrap} ref={scrollRef}>
        {children}
        {renderBackTop()}
      </div>
    </RedirectComp>
  )
}

export default Index
