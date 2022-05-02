import React from 'react'
import ButtonGroup from '../ButtonGroup'
import styles from './styles.less'

const iconMap = {
  success: require('@/assets/success.png'),
  error: require('@/assets/auth/驳回.png'),
  waiting: require('@/assets/auth/waiting.png'),
  return: require('@/assets/auth/退回.png')
}

// type: success or error
// title: 标题
// desc: 描述
// children: 下部的按钮
const Success = ({ type, title, desc, children }) => {
  return (
    <div className={styles.container}>
      <img src={iconMap[type]} alt="" />
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{desc}</div>
      <div>{children}</div>
    </div>
  )
}

export default Success
