import React, { useCallback } from 'react'
import classNames from 'classnames'
import { Spin, Card as CardComp } from 'antd'
import styles from './styles.less'

// transparent: 背景变透明，用于Card里面套Card的最外层
// title:标题；
// header：右侧顶部，请同时传入type与code两个值；
// style：自定义样式；
// loading：加载，默认为false
const Card = ({
  transparent = false,
  title,
  titleExtra,
  header,
  children,
  style,
  loading = false,
  className,
  ...props
}) => {
  const container = classNames(
    {
      [styles.container]: true,
      [styles.border]: !transparent,
      [styles.transparent]: !!transparent
    },
    className
  )

  const renderTitle = useCallback(() => {
    return (
      title && (
        <div className={styles.title}>
          <div className={styles.titleContainer}>
            <div className={styles.titleText}>{title}</div>
            <div className={styles.titleExtra}>{titleExtra}</div>
          </div>
          {/*{title}*/}
          {header && (
            <div className={styles.clear}>
              <div className={styles.headerLabel}>{header.type}</div>
              <div className={styles.headerContent}>{header.code}</div>
            </div>
          )}
        </div>
      )
    )
  }, [header, title, titleExtra])

  return (
    <Spin spinning={loading}>
      <CardComp title={renderTitle()} style={{ ...style }} className={container} {...props}>
        {children}
      </CardComp>
    </Spin>
  )
}

export default Card
