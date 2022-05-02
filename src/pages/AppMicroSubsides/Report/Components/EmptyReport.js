import React from 'react'
import styles from '../styles.less'

const emptyReport = require('../../../../assets/emptyReport.png')

const EmptyReport = (props) => {
  return (
    <div className={styles.emptyBlock}>
      <img src={`${emptyReport}`} alt="" className={styles.emptyImg}></img>
      <div className={styles.emptyTitle}>暂未生成报告</div>
    </div>
  )
}

export default EmptyReport
