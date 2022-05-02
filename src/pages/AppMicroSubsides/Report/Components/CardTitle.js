import React from 'react'
import IconFont from '@/components/IconFont'
import styles from '../styles.less'

const CardTitle = (props) => {
  const { title, icon } = props

  return (
    <div className={styles.cardHeader}>
      {icon && <IconFont type={icon} style={{ color: '#1989AA' }} className={styles.cardIcon} />}
      <div className={styles.cardTitle}>{title}</div>
    </div>
  )
}

export default CardTitle
