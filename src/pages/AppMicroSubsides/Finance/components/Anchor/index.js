import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { Card } from 'antd'
import styles from './styles.less'
import withRouter from 'umi/withRouter'
import { useBool } from '@dragon/hooks'

const Anchor = ({ anchorList = [] }) => {
  const [top, setTop] = useState({})

  const [activeTabKey, setTabKey] = useState(anchorList[0]?.financeInfo)

  const [fixed, { toggle }] = useBool(false)

  useEffect(() => {
    const res = {}
    anchorList.forEach((i) => {
      res[i.key] = document.getElementById(i.key).getBoundingClientRect().top - 150
    })
    setTop(res)
  }, [anchorList])

  useEffect(() => {
    const elements = anchorList.map((i) => document.getElementById(i.key))

    window.onscroll = () => {
      const isIn = elements.map((i) => isElementInViewport(i))

      const index = isIn.indexOf(true)
      if (index !== -1) {
        setTabKey(elements[index].id)
      }

      const top = document.body.scrollTop || document.documentElement.scrollTop
      if (top > 60) {
        toggle(true)
      } else {
        toggle(false)
      }
    }
    return () => {
      window.onscroll = null
    }
  }, [activeTabKey, anchorList, toggle])

  const handleTabChange = (id) => {
    window.scrollTo(0, top[id])
    setTabKey(id)
  }

  const className = classnames({
    [styles.container]: true,
    [styles.fixed]: fixed
  })

  return (
    <div className={styles.father}>
      <Card
        onTabChange={handleTabChange}
        activeTabKey={activeTabKey}
        bordered={false}
        className={className}
        tabList={anchorList}
      />
    </div>
  )
}

export default withRouter(Anchor)

function isElementInViewport(el, offset = -60) {
  const box = el.getBoundingClientRect(),
    top = box.top >= 0,
    left = box.left >= 0,
    bottom = box.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset,
    right = box.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  return top && left && bottom && right
}
