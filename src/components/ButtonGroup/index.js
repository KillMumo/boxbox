import React, { Children, useCallback } from 'react'
import classnames from 'classnames'
import styles from './styles.less'
import { useSelector } from 'react-redux'
import Button from './Button'
import router from 'umi/router'

// align: 'center', 'left', 'right'
// type: default（默认） form action

// 放在ButtonGroup里的Button可以额外加三个属性
// auth：按钮权限码
// to: 跳转的链接
// dynamic：动态权限的参数
const ButtonGroup = (props) => {
  const { children, align, type = 'default', fixed = false, style } = props

  // button的codes
  const codes = useSelector(({ authorities }) => authorities.button.buttons)

  const className = classnames(styles.container, {
    [styles[align]]: true,
    [styles[type]]: true,
    [styles.fixed]: !!fixed
  })

  const handlePushRouter = useCallback((to) => {
    router.push(to)
  }, [])

  const renderChild = (child) => {
    const {
      props,
      props: { dynamic = false }
    } = child
    const childProps =
      type === 'action'
        ? {
            type: 'link',
            size: 'small',
            onClick: props.to ? () => handlePushRouter(props.to) : props.onClick,
            ...props
          }
        : {
            onClick: props.to ? () => handlePushRouter(props.to) : props.onClick,
            ...props
          }
    return <Button dynamic={dynamic}>{React.cloneElement(child, childProps)}</Button>
  }

  return (
    <div className={className} style={style}>
      {Children.map(children, (c) => {
        // 约定c一定是一个antd Button
        if (!c) return null
        const { auth } = c.props
        if (auth) {
          // 启用权限
          return codes.includes(auth) && renderChild(c)
        }
        return renderChild(c)
      })}
    </div>
  )
}

export default ButtonGroup
