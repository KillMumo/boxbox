import React, { useCallback, useMemo, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'
import PageLoading from '../Loading/PageLoading'
import styles from './styles.less'
import { useSelector } from 'react-redux'
import Iconfont from '@/components/IconFont'

const { SubMenu } = Menu

const SiderMenu = ({ location, menu }) => {
  const { pathname } = location

  const menuLoading = useSelector(({ loading }) => loading.effects['authorities/fetchAuthorities'])

  const [openKeys] = useState(() => {
    const key = `/${pathname.split('/')[1]}`
    return [key]
  })

  // const handleOpenChange = useCallback((k) => {
  //   setOpenKeys(k)
  // }, [])

  const selectedKeys = useMemo(() => {
    // 截取路径前两级为key
    const selectedKey = pathname
      .split('/')
      .slice(1, 3)
      .join('/')
    const selectedKeyForSure = pathname
      .split('/')
      .slice(1, 2)
      .join('/')
    return [`/${selectedKey}`, `/${selectedKeyForSure}`]
  }, [pathname])

  const renderSubMenuOrItem = useCallback((menu) => {
    return menu.map((node) => {
      if (node.name === '我的资产') node.name = '我的碳币'
      if (node.path === '/assets') {
        node.source = 'iconyindan'
      } else if (node.path === '/commodity') {
        node.source = 'iconG'
      } else if (node.path === '/mine') {
        node.source = 'iconedu'
      } else if (node.path === '/mall') {
        node.source = 'iconchanpinguanli'
      } else if (node.path === '/carbonAccount') {
        node.source = 'iconqiye1'
      }
      // 如果有子菜单
      if (Array.isArray(node.children) && node.children.length > 0) {
        return (
          <SubMenu
            key={node.path}
            title={
              <span>
                {node.source ? <Iconfont type={`${node.source}`} /> : null}
                <span>{node.name}</span>
              </span>
            }
          >
            {renderSubMenuOrItem(node.children)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={node.path}>
          {node.path === '/databoard' ? (
            <div
              onClick={() => {
                window.open('/dashboard', '_blank')
              }}
            >
              {node.source ? <Iconfont type={`${node.source}`} /> : null}
              <span>{node.name}</span>
            </div>
          ) : (
            <Link to={node.path}>
              {node.source ? <Iconfont type={`${node.source}`} /> : null}
              <span>{node.name}</span>
            </Link>
          )}
        </Menu.Item>
      )
    })
  }, [])

  // useEffect(() => {
  //   const key = `/${pathname.split('/')[1]}`
  //   setOpenKeys([key])
  // }, [pathname])

  return (
    <div className={styles.container}>
      <Menu
        mode="inline"
        theme="dark"
        forceSubMenuRender
        defaultOpenKeys={openKeys}
        // onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
      >
        {menuLoading ? <PageLoading /> : renderSubMenuOrItem(menu)}
      </Menu>
    </div>
  )
}

export default withRouter(SiderMenu)
