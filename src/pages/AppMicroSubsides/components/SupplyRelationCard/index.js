import React from 'react'
import { Button, Spin } from 'antd'
import styles from './styles.less'
import Link from 'umi/link'

const SupplyRelationCard = (props) => {
  const { data, url, type, loading, start } = props

  return (
    <Spin spinning={loading || false}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.wrap}>
            <div className={styles.title}>供应商</div>
            <div>
              {data?.supplier?.map((item, index) => (
                <div className={styles.content}>{item.companyName}</div>
              )) || '无'}
            </div>
          </div>
          <div className={styles.wrap}>
            <div className={styles.title}>客户</div>
            <div>
              {data?.client?.map((item, index) => (
                <div className={styles.content}>{item.companyName}</div>
              )) || '无'}
            </div>
          </div>
        </div>
        {type === 'ywy' && (
          <div>
            信息不全？请
            <Button type="link" size="small" style={{ padding: 0 }} disabled={!url}>
              <Link to={url}>去完善</Link>
            </Button>
            或
            <Button
              type="link"
              size="small"
              disabled={Object.keys(data).length === 0}
              style={{ padding: 0 }}
              onClick={() => {
                // window.location.reload()
                start({ orgName: data.orgName })
              }}
            >
              刷新
            </Button>
          </div>
        )}
        {type === 'cmp' && (
          <div>
            信息不全？请
            <Button
              type="link"
              size="small"
              style={{ padding: 0 }}
              disabled={!url || data.isLockEdit}
            >
              <Link to={url}>去完善</Link>
            </Button>
            或
            <Button
              type="link"
              size="small"
              style={{ padding: 0, cursor: 'pointer' }}
              onClick={() => {
                // window.location.reload()
                start({ orgName: data.orgName })
              }}
            >
              刷新
            </Button>
          </div>
        )}
      </div>
    </Spin>
  )
}

export default SupplyRelationCard
