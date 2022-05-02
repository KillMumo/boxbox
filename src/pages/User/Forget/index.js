import React from 'react'
import Steps from '@/components/Steps'

import styles from './styles.less'
import { useSelector } from 'react-redux'
import GlobalHeader from '@/components/GlobalHeader'
import Link from 'umi/link'
import { Icon } from 'antd'
import Redirect from 'umi/redirect'

const step = ['安全验证', '重置密码', '完成']

const Forget = ({ children, location }) => {
  const forgetState = useSelector(({ forget }) => forget.info)

  if (location.pathname.indexOf('step') > -1 && !forgetState.phone) {
    return <Redirect to="/user/forget" />
  }

  return (
    <div className={styles.container}>
      <GlobalHeader
        right={
          <Link to="/user/login">
            返回登录
            <Icon type="right" />
          </Link>
        }
      />
      <Steps steps={step} />
      <div className={styles.subContainer}>{children}</div>
    </div>
  )
}

export default Forget
