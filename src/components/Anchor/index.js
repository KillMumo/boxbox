import React from 'react'
import { Anchor as A } from 'antd'
import styles from './styles.less'

const { Link } = A

const Anchor = (props) => {
  const { anchorList = [], targetOffset = 215 } = props

  return (
    <div className={styles.container}>
      <A targetOffset={targetOffset}>
        {anchorList.map((a) => (
          <Link key={a.key} href={`#${a.key}`} title={`${a.tab}`} />
        ))}
      </A>
    </div>
  )
}

export default Anchor
