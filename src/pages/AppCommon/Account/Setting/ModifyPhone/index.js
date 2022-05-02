import React from 'react'
import Steps from '@/components/Steps'
import Card from '@/components/Card'
import styles from './styles.less'

import { useSelector } from 'react-redux'
import Redirect from 'umi/redirect'

const step = ['安全验证', '修改手机', '完成']

const ModifyPhone = ({ children, location }) => {
  const modifyState = useSelector(({ modifyPhone }) => modifyPhone.info)

  if (location.pathname.indexOf('step') > -1 && !modifyState.phone) {
    return <Redirect to="/account/modifyPhone" />
  }

  return (
    <Card>
      <Steps steps={step} />
      <div className={styles.subContainer}>{children}</div>
    </Card>
  )
}

export default ModifyPhone
