import React, { useEffect } from 'react'
import { Timeline as Time, Empty } from 'antd'
import classnames from 'classnames'
import Dot from './components/Dot'
import Tag from './components/Tag'
import DownloadItem from '../DownloadItem'

import styles from './styles.less'
import { useBool, useRequest } from '@dragon/hooks'
import { fetchTimeline } from '@/services/common'

const statusMap = {
  '1': {
    type: 'primary'
  },
  '-1': {
    type: 'error'
  },
  '0': {
    type: 'primary'
  }
}

const Timeline = (props) => {
  const { style, bizNo } = props

  const { data: steps = [] } = useRequest(() => fetchTimeline({ bizNo }))

  const [folded, { toggle }] = useBool(steps.length >= 5)
  useEffect(() => {
    toggle(steps.length >= 5)
  }, [steps.length, toggle])

  const className = classnames({
    [styles.container]: true,
    [styles.folded]: folded
  })

  return (
    <div className={className}>
      <Time style={style}>
        {steps.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          steps.map((item, index) => {
            const status = statusMap[item.status]
            /* if (item.taskName === '融资申请') {
              return (
                <Time.Item
                  key={item.createTime}
                  dot={<Dot type={status.type} processing={index === 0} />}
                >
                  <div className={styles.current}>
                    {index === 0 ? (
                      <Tag type={status.type}>发起融资申请</Tag>
                    ) : (
                      <span>发起融资申请</span>
                    )}
                  </div>
                  <div className={styles.action}>
                    {item.createTime} 操作人：{item.opUserName}
                  </div>
                  {(item.extra.remark || item.extra?.remark) && (
                    <div className={styles.extra}>
                      <div style={{ marginBottom: 8 }}>{item.extra.remark || item.extra?.remark}</div>
                      {item.extra?.files && <DownloadItem list={item.extra?.files || []} />}
                    </div>
                  )}
                </Time.Item>
              )
            } */
            return (
              <Time.Item
                key={item.createTime}
                dot={<Dot type={status.type} processing={index === 0} />}
              >
                <div className={styles.current}>
                  {index === 0 ? (
                    <Tag type={status.type}>{item.taskName}</Tag>
                  ) : (
                    <span>{item.taskName}</span>
                  )}
                </div>
                <div className={styles.action}>
                  {item.createTime}
                  <span style={{ marginLeft: 15 }}>操作人：{item.opUserName}</span>
                </div>
                {(item.extra.remark || item.extra?.remark) && (
                  <div className={styles.extra}>
                    <div style={{ marginBottom: 8 }}>{item.extra.remark}</div>
                    {item.extra.files && item.extra.files.length !== 0 && (
                      <DownloadItem list={item.extra?.files || []} />
                    )}
                  </div>
                )}
              </Time.Item>
            )
          })
        )}
      </Time>
      {steps.length > 4 && (
        <div className={styles.fold} onClick={() => toggle()}>
          {folded ? '展开' : '收起'}
        </div>
      )}
    </div>
  )
}

export default Timeline
