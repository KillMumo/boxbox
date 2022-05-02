import React, { useCallback } from 'react'
import { Input, Icon } from 'antd'

import styles from './styles.less'

const { TextArea: Area } = Input

const TextAreaWithDelete = React.forwardRef(
  ({ value = '', length = 100, onChange, handleDelete, ...restProps }, ref) => {
    const handleChange = useCallback(
      (e) => {
        const {
          target: { value }
        } = e
        if (value.length <= length) {
          onChange(e.target.value)
        }
      },
      [length, onChange]
    )

    return (
      <div className={styles.container}>
        <Area
          style={{ paddingBottom: 25 }}
          ref={ref}
          // autoSize={{ minRows: 2 }}
          value={value}
          onChange={handleChange}
          {...restProps}
        />
        <span className={styles.length}>
          {value?.length ? value.length : 0}/{length}
        </span>
        <span className={styles.icon}>
          <Icon
            type="delete"
            onClick={handleDelete}
            style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14 }}
          />
        </span>
      </div>
    )
  }
)

export default TextAreaWithDelete
