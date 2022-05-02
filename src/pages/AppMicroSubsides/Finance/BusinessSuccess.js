import React from 'react'
import { Button } from 'antd'
import styles from './styles.less'
import router from 'umi/router'

const iconPng = require('@/assets/success.png')

const Success = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  const handleClick = () => {
    router.push(`/msFinance/view/${id}`)
  }

  return (
    <div className={styles.successWrap}>
      <div className={styles.card}>
        <div className={styles.block}>
          <div className={styles.pic}>
            <img src={iconPng} alt="" />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>业务评估提交成功</div>
            <div className={styles.desc}>
              业务评估提交成功才可以审批，马上
              <Button type="link" style={{ padding: 0 }} onClick={handleClick}>
                查看该详情
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  )
}

export default Success
