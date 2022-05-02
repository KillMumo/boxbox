import React from 'react'
import { Button } from 'antd'
import classnames from 'classnames'
import Link from 'umi/link'
import styles from './styles.less'
import IconFont from '../IconFont'

const defaultDesc = '很抱歉！您访问的页面不存在或您暂无访问权限'

const Exception = (props) => {
  const { code = 404, desc = defaultDesc } = props

  const is500 = code === 500

  const containerClassName = classnames({
    [styles.container]: true,
    [styles.internet]: is500
  })

  const contentClassName = classnames({
    [styles.content]: true,
    [styles.internet]: is500
  })

  return (
    <div className={containerClassName}>
      <div className={contentClassName}>
        <div className={styles.desc}>{desc}</div>
        <div className={styles.buttonWrap}>
          {!is500 && (
            <Button type="primary">
              <Link to="/home">回到首页</Link>
            </Button>
          )}
        </div>
        <div className={styles.question}>如有疑问，请联系：</div>
        <div className={styles.contact}>
          <span>
            <IconFont type="icondianhua" />
            联系电话：85396802
          </span>
          <span>
            <IconFont type="iconyoujian1" />
            邮箱：it@induschain.cn
          </span>
        </div>
      </div>
    </div>
  )
}

export default Exception
