import React from 'react'
import { Icon } from 'antd'
import styles from './styles.less'

export default (text, url) => {
  const textIsArray = Array.isArray(text)
  return (
    <React.Fragment>
      <div>
        <Icon className={styles.warnTip} type="exclamation-circle" theme="filled" />
        {textIsArray ? (
          <div className={styles.array}>
            {text.map((i) => (
              <div key={i}>{i}</div>
            ))}
          </div>
        ) : (
          text
        )}
      </div>
      {url && (
        <div className={styles.template}>
          <a href={url}>下载模板</a>
        </div>
      )}
    </React.Fragment>
  )
}
