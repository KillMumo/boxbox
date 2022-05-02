import React from 'react'
import { Alert } from 'antd'
import styles from './styles.less'

const RejectInfo = ({ title, desc }) => {
  return (
    <div className={styles.container}>
      <Alert message={title || 'title'} type="error" description={desc || 'desc'} />
    </div>
  )
}

export default RejectInfo
