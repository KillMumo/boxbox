import React from 'react'
import classnames from 'classnames'
import styles from './styles.less'

export default ({ children, column = 2 }) => {
  const className = classnames({
    [styles.riskWrap]: true
  })

  return (
    <React.Fragment>
      <div gutter={24} className={className} style={{ flexGrow: column }}>
        {React.Children.map(children, (c, i) => {
          if (!c) return null
          return React.cloneElement(c, { column })
        })}
      </div>
    </React.Fragment>
  )
}
