import React from 'react'
import { Timeline as Time } from 'antd'
import classnames from 'classnames'
import Dot from './components/Dot'
import Tag from './components/Tag'

import styles from './styles.less'

// steps: 后端返回的数组
// fold: 是否展开
// toggleFold: 切换是否展开
// -------------以上可以通过useTimeline返回
// showExtra: 是否显示extra
const Timeline = (props) => {
  const { style, steps = [], toggleFold, fold, showExtra = true } = props

  const className = classnames({
    [styles.container]: true,
    [styles.folded]: fold
  })

  return (
    <div className={className}>
      <Time style={style}>
        {steps.map((item, index) => {
          return (
            <Time.Item key={item.createTime} dot={<Dot type="primary" processing={index === 0} />}>
              <div className={styles.current}>
                {index === 0 ? <Tag type="primary">{item.msg}</Tag> : <span>{item.msg}</span>}
              </div>
              <div className={styles.action}>
                {item.createTime} 操作人：{item.orgName} {item.operatePerson}
              </div>
              {showExtra && item.reason && (
                <div className={styles.extra}>
                  <div>{item.reason}</div>
                </div>
              )}
            </Time.Item>
          )
        })}
      </Time>
      {steps.length > 2 && (
        <div className={styles.fold} onClick={() => toggleFold()}>
          {fold ? '展开' : '收起'}
        </div>
      )}
    </div>
  )
}

export default Timeline
