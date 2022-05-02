import React from 'react'
import classnames from 'classnames'
import { Row } from 'antd'
import styles from './styles.less'

// layout: horizontal | vertical 表示布局水平或者垂直
// merge: 与上一个合并
export default ({ children, title, layout = 'horizontal', merge = false, column = 2, style }) => {
  const className = classnames({
    [styles.container]: true,
    [styles.merge]: !!merge,
    [styles.fullWidth]: column > 5
  })

  return (
    <React.Fragment>
      {title && <div className={styles.title}>{title}</div>}
      <Row gutter={24} type="flex" className={className} style={style}>
        {React.Children.map(children, (c, i) => {
          if (!c) return null
          return React.cloneElement(c, { column, layout })
        })}
      </Row>
    </React.Fragment>
  )
}
