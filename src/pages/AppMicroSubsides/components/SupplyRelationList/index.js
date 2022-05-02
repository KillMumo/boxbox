import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import styles from './styles.less'
import { useBool } from '@dragon/hooks'
import Card from '@/components/Card'
import { SupplyRelationInfo } from '../Detail'
import { Empty, Icon } from 'antd'

// 融资详情、贷后详情的供销关系列表
const SupplyRelationList = (props) => {
  const { data, type } = props

  const [folded, { toggle }] = useBool(data?.length > 2)
  useEffect(() => {
    toggle(data?.length > 2)
  }, [toggle, data])

  const className = classnames({
    [styles.container]: true,
    [styles.folded]: folded
  })

  const [divHeight, setDivHeight] = useState()
  useEffect(() => {
    if (data?.length > 2) {
      const div1 = document.getElementById('0').offsetHeight
      const div2 = document.getElementById('1').offsetHeight
      // console.log("asd",div1);
      setDivHeight(div1 + div2 + 10)
      // console.log(divHeight);
    }
  }, [data, divHeight])

  return (
    <div className={className} style={folded ? { height: divHeight } : {}}>
      {data ? (
        <React.Fragment>
          {data?.map((i, ii) => (
            <div className={styles.card} id={ii} key={ii}>
              <Card.SubCard key={i.companyName} title={`${type}${ii + 1}`}>
                <SupplyRelationInfo data={i} />
              </Card.SubCard>
            </div>
          ))}
          {data?.length > 2 && (
            <div className={styles.fold} onClick={() => toggle()}>
              {folded ? (
                <div style={{ cursor: 'pointer', margin: 'auto' }}>
                  展开
                  <Icon type="down" style={{ color: 'rgba(0, 0, 0, 0.65)' }} />
                </div>
              ) : (
                <div style={{ cursor: 'pointer', margin: 'auto' }}>
                  收起
                  <Icon type="up" style={{ color: 'rgba(0, 0, 0, 0.65)' }} />
                </div>
              )}
            </div>
          )}
        </React.Fragment>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  )
}

export default SupplyRelationList
