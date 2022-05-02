import React, { useCallback } from 'react'
import { Pagination } from 'antd'
import styles from './styles.less'

const Footer = ({ setting }) => {
  const { current, total, size, onPaginationChange } = setting

  const onShowSizeChange = useCallback(
    (current, pageSize) => {
      // 改变后需要重新获取第current页的数据
      onPaginationChange(current, pageSize)
    },
    [onPaginationChange]
  )

  return (
    <div className={styles.container}>
      <div className={styles.total}>共{total || 0}条</div>
      <Pagination
        className={styles.page}
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        pageSizeOptions={['10', '20', '30']}
        showQuickJumper={total > size}
        current={current}
        total={total}
        onChange={onShowSizeChange}
      />
    </div>
  )
}

export default Footer
