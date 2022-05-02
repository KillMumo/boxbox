import React, { useState, useEffect } from 'react'
import { searchUrl } from '@/common/map'
import styles from '../styles.less'

// 判断企业/自然人
const TitleLink = (props) => {
  const { val, type, num, origin } = props

  const [isPc, setIsPc] = useState(false)

  useEffect(() => {
    isPC()
  }, [])

  const isPC = () => {
    //是否为PC端
    let userAgentInfo = navigator.userAgent
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    setIsPc(flag)
    // return flag
  }

  const renderPc = (val, num) => {
    return (
      <div className={styles.news}>
        <a rel="noopener noreferrer" target="_blank" href={searchUrl['company'] + val}>
          {val}
        </a>
        {num && `:${num}`}
      </div>
    )
  }

  const renderMobile = (val, num) => {
    return (
      <div className={styles.news}>
        <a rel="noopener noreferrer" target="_self" href={searchUrl['company'] + val}>
          {val}
        </a>
        {num && `:${num}`}
      </div>
    )
  }

  if (origin) {
    let arr = []
    if (val && val.indexOf(',') !== -1) {
      arr = val.split(',')
      return arr.map((item) => {
        return origin === item ? (
          <div>{val}</div>
        ) : isPc ? (
          renderPc(item, num)
        ) : (
          renderMobile(item, num)
        )
      })
    } else if (origin === val || val === '投资方未知') {
      return <div>{val}</div>
    } else {
      return isPc ? renderPc(val, num) : renderMobile(val, num)
    }
  }

  return isPc ? renderPc(val, num) : renderMobile(val, num)
}

export default TitleLink
