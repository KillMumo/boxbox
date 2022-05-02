import React from 'react'
import styles from './styles.less'
import router from 'umi/router'
import IconFont from '@/components/IconFont'

const Todo = ({ item }) => {
  return (
    <div onClick={() => router.push(item.url)} className={styles.container}>
      <div className={styles.left}>
        <div className={styles.title}>{item.name}</div>
        <div className={styles.num}>{item.number}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.icon}>
          <IconFont type={item.icon} />
        </div>
      </div>
    </div>
  )
}

export default Todo
