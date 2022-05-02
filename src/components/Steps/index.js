import React, { useCallback, useMemo } from 'react'
import { Icon } from 'antd'
import className from 'classnames'
import { withRouter } from 'react-router-dom'
import styles from './styles.less'

/**
 *
 * @param {步骤数组} steps
 * @param {当前所在的步骤} current 可以不传，如果不传那就路由结尾必须是 step1、step2、step3
 */
const Steps = ({ steps = [], current, location }) => {
  const lineClassNames = useCallback((status, active) => {
    return className({
      [styles.line]: true,
      [styles.start]: status === 'start',
      [styles.between]: status === 'between',
      [styles.end]: status === 'end',
      [styles.active]: active
    })
  }, [])

  const titleClassNames = useCallback((active) => {
    return className({
      [styles.title]: true,
      [styles.active]: active
    })
  }, [])

  // 当前所处是从pathname里来的，所以路由必须是step2、3
  const currentStep = useMemo(() => {
    const { pathname } = location
    if (current) return current
    const res = +pathname.charAt(pathname.length - 1)
    return isNaN(res) ? 1 : res
  }, [current, location])

  return (
    <div className={styles.container}>
      {steps.map((step, i) => {
        // index + 1 比当前小的都激活
        const active = i + 1 <= currentStep
        // 完成有两种条件1、index + 1比现在小，
        // 2、index+1 就是当前并且 是最后一个了
        const done = i + 1 < currentStep || (i + 1 === currentStep && i + 1 === steps.length)

        const name = i === 0 ? 'start' : 'between'
        return (
          <React.Fragment key={step}>
            <div className={lineClassNames(name, active)} />
            <div className={titleClassNames(active)}>
              {done ? (
                <Icon style={{ fontSize: 33, marginBottom: 10 }} type="check-circle" />
              ) : (
                <div className={styles.count}>
                  <span>{i + 1}</span>
                </div>
              )}
              <div className={styles.name}>{step}</div>
            </div>
          </React.Fragment>
        )
      })}
      <div className={lineClassNames('end', currentStep === steps.length)}></div>
    </div>
  )
}

export default withRouter(Steps)
