import React, { useCallback } from 'react'
import { Button } from 'antd'
import styles from './styles.less'
import { useInterval } from '@dragon/hooks'
import { useState } from 'react'

// action ：点击触发的函数，一般是用来获取验证码的
const CountDown = ({ action = () => {}, ...restProps }) => {
  const [waitTime, setWaitTime] = useState(60)

  const { counting, start, cancel } = useInterval(
    () => {
      if (waitTime !== 0) {
        return setWaitTime((t) => t - 1)
      }
      setWaitTime(60)
      cancel()
    },
    1000,
    {
      manual: true
    }
  )

  const handleClick = useCallback(() => {
    action(start)
  }, [action, start])

  return (
    <Button onClick={handleClick} disabled={counting} className={styles.button} {...restProps}>
      {counting ? `(${waitTime})秒` : '获取验证码'}
    </Button>
  )
}

export default CountDown
