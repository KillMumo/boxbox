import React, { useEffect } from 'react'
import Link from 'umi/link'
import { Icon } from 'antd'
import Steps from '@/components/Steps'
import GlobalHeader from '@/components/GlobalHeader'
import Redirect from 'umi/redirect'
import styles from './styles.less'
import { fetchState, removeState } from '@/common/store'

const registerSteps = ['创建用户', '完善基础信息', '注册成功']

const editSteps = ['修改用户信息', '完善基础信息', '基础信息修改成功']

const Register = ({ children, location }) => {
  const registerInfo = fetchState('registerInfo')

  const isUpdate = location.pathname.indexOf('update') !== -1

  useEffect(() => {
    return () => {
      removeState('registerInfo')
    }
  }, [])

  if (location.pathname.indexOf('step') > -1 && !registerInfo.orgName) {
    return <Redirect to="/user/register" />
  }
  if (isUpdate && !registerInfo.orgName) {
    return <Redirect to="/user/register" />
  }

  const steps = isUpdate ? editSteps : registerSteps

  return (
    <div className={styles.container}>
      <GlobalHeader
        left="注册"
        right={
          <Link to="/user/login">
            我已注册，马上登陆
            <Icon type="right" />
          </Link>
        }
      />
      <Steps steps={true ? steps : editSteps} />
      <div className={styles.subContainer}>{children}</div>
    </div>
  )
}

export default Register
