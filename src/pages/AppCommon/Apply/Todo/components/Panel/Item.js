import React from 'react'
import styles from './styles.less'
import { Icon, Spin } from 'antd'
import router from 'umi/router'
import { useRequest } from '@dragon/hooks'
import { fetchDict } from '@/services/dict'

// title: 标题
// type: icon的type
// to: 跳转的地址
const Item = ({ item, background }) => {
  const { start: fetchPath, loading } = useRequest(() => fetchDict({ code: item.flowKey }), {
    manual: true,
    onSuccess: (res) => {
      router.push(res.dictValue)
    }
  })

  return (
    <Spin wrapperClassName={styles.item} spinning={loading}>
      <div onClick={() => fetchPath({ code: item.flowKey, dictKey: item.flowKey })}>
        <div className={styles.icon} style={{ background }}>
          <Icon type={item.flowImage} />
        </div>
        <div className={styles.desc}>{item.flowAlias}</div>
      </div>
    </Spin>
  )
}

export default Item
