import React from 'react'
import { Tag } from 'antd'
import IconFont from '@/components/IconFont'
import styles from '../styles.less'

const Header = (props) => {
  const { title, data, scoreTitle } = props

  // const {
  //   createTime = '2020-04-15 15:41:58',
  //   status = '续存',
  //   name = '杭州趣联科技有限公司',
  //   address = '杭州滨江区丹枫路399号',
  //   industry = '科学研究和技术服务业',
  //   scoreTitle = '风控评分',
  //   score = '80'
  // } = data

  return (
    <div className={styles.header}>
      <div className={styles.titleWrap}>
        <div className={styles.headerTitle}>{title}</div>
        <div className={styles.generateTime}>
          {`报告生成时间：`}
          {data.createTime}
        </div>
      </div>
      <div className={styles.detailWrap}>
        <div className={styles.left}>
          {/* <img alt="" className={styles.icon} /> */}
          <IconFont type="&#xe7c4;" />
          <div>
            <div className={styles.company}>{data.name}</div>
            <div className={styles.tagContainer}>
              <Tag color="orange" style={{ marginRight: 8 }}>
                {data.status}
              </Tag>
              <Tag color="blue">{data.industry}</Tag>
            </div>
            <div className={styles.address}>
              {`地址: `}
              {data.address}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.scoreTitle}>{scoreTitle}</div>
          <div className={styles.score}>{data.score}</div>
        </div>
      </div>
    </div>
  )
}

export default Header
