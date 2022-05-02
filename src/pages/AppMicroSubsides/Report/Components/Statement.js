import React from 'react'
import { Icon, Popover } from 'antd'
import styles from '../styles.less'

const Statement = (props) => {
  const { data } = props
  const content = (
    <div className={styles.popover}>
      {`本报告内容是基于${data.name}公司授权，查询公开信息所得结果。产链数科不对该查询结果的全面、准确、真实性负责。本报告应仅为您的决策提供参考。因使用该报告而产生的任何后果，产链数科概不负责。`}
    </div>
  )
  return (
    <div className={styles.state}>
      <Popover content={content} trigger="hover" placement="left">
        <Icon type="question-circle" style={{ marginRight: 2 }} />
      </Popover>
      免责声明
    </div>
  )
}

export default Statement
