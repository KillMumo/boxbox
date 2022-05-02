import React from 'react'
import styles from '../styles.less'

const CardDetail = (props) => {
  const { title, desc } = props

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 30 }}>
      <div className={styles.detailTitle}>
        <div className={styles.flag}></div>
        {title}
      </div>
      <div className={styles.desc}>{desc}</div>
    </div>
  )
}

export default CardDetail
