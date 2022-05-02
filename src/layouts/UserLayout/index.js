import React, { useEffect } from 'react'
import BrowserTip from '@/components/BrowserTip'
import styles from './styles.less'
import { useDispatch } from 'react-redux'

const UserLayout = (props) => {
  const { location } = props

  const dispatch = useDispatch()

  useEffect(() => {
    // 当路由切换时 滚动到页面顶部
    window.scrollTo(0, 0)
    dispatch({
      type: 'pageConfig/fetchConfig'
    })
  }, [location, dispatch])

  return (
    <div className={styles.container}>
      <BrowserTip />
      {props.children}

    </div>
  )
}

export default UserLayout
