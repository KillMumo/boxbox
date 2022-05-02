import React, { Children } from 'react'
import styles from './styles.less'

const backgrounds = ['#f06a36', '#f7a32d', '#5ec662', '#4598ef', '#3bbbad']

// title: 标题
const Panel = ({ title, children }) => {
  return (
    <div className={styles.panel}>
      {<div>{title}</div>}
      <div className={styles.items}>
        {Children.map(children, (c, i) => {
          const background = backgrounds[i % backgrounds.length]
          return React.cloneElement(c, { background })
        })}
      </div>
    </div>
  )
}

export default Panel
