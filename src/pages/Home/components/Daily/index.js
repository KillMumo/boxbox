import React from 'react'
import styles from './styles.less'
import router from 'umi/router'
import IconFont from '@/components/IconFont'

const Daily = ({ item }) => {
  const handleClick = () => {
    router.push(item.url)
  }

  return (
    <div onClick={handleClick} className={styles.container}>
      <div className={styles.icon}>
        <IconFont type={item.icon} />
      </div>
      <div className={styles.name}>{item.name}</div>
    </div>
  )
}

export default Daily
