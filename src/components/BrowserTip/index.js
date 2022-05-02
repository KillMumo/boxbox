import React, { useEffect } from 'react'
import { Alert as A } from 'antd'
import { useBool } from '@dragon/hooks'
import styles from './styles.less'

const Alert = () => {
  const [show, { setFalse: close, setTrue: open }] = useBool(false)

  useEffect(() => {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Chrome') > -1) {
      const version = userAgent.match(/Chrome\/([\d.]+)/i)[1].split('.')[0]
      if (parseFloat(version) >= 65) {
        close()
      } else {
        open()
      }
    } else {
      open()
    }
  }, [close, open])

  return show ? (
    <A
      className={styles.tip}
      showIcon
      message="温馨提示：您正在使用的浏览器内核版本暂不兼容，推荐使用Chrome浏览器进行操作"
      type="warning"
      closable
    />
  ) : null
}

export default Alert
