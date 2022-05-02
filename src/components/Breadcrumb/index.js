import React, { useMemo } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Breadcrumb } from 'antd'
import pathToRegexp from 'path-to-regexp'
import styles from './index.less'

function getBreadcrumbName(breadcrumbNameMap, url) {
  let breadcrumb = breadcrumbNameMap[url]
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach((item) => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item]
      }
    })
  }
  return breadcrumb || ''
}

function urlToList(url) {
  const urllist = url.split('/').filter((i) => i)
  return urllist.map((_, index) => `/${urllist.slice(0, index + 1).join('/')}`)
}

const BreadcrumbView = ({ location }) => {
  const pathname = location.pathname
  const breadcrumbNameMap = useSelector(({ user }) => user.breadcrumbNameMap)
  const urllist = useMemo(() => urlToList(pathname), [pathname])

  return (
    <Breadcrumb className={styles.breadcrumb}>
      {urllist.map((url, i) => {
        const breadcrumbName = getBreadcrumbName(breadcrumbNameMap, url)
        if (!breadcrumbName) return null
        return (
          <Breadcrumb.Item key={url}>
            {i < urllist.length - 1 && i > 0 ? (
              <Link to={url}>{breadcrumbName}</Link>
            ) : (
              <span>{breadcrumbName}</span>
            )}
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

export default withRouter(BreadcrumbView)
