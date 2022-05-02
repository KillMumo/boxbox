import React, { useEffect, useCallback } from 'react'
import classnames from 'classnames'
import router from 'umi/router'
import {
  Layout,
  Dropdown,
  Modal,
  Menu,
  Icon
  // Badge,
  // Popover,
  // Button
} from 'antd'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SiderMenu from '@/components/SiderMenu'
import CatchError from '@/components/CatchError'
import Breadcrumb from '@/components/Breadcrumb'
import Authorized from '@/pages/Authorized'
import avatar from './image/avatar.png'
import { removeToken, fetchToken } from '@/common/token'
import { logout } from '@/services/user'
import styles from './styles.less'
// import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import Loading from '@/components/Loading'
import useScrollToTop from './hooks/useScrollToTop'
import useMenuContainer from './hooks/useMenuContainer'
import useLoading from './hooks/useLoading'
import IconFont from '@/components/IconFont'
import RedirectComp from './Redirect'
import { useBool } from '@dragon/hooks'
import Platform from '@/components/PlatformDrawer'

const { Content, Header } = Layout

const BasicLayout = (props) => {
  const isLogin = !!fetchToken()
  const { location } = props
  const [visible, { setTrue: open, setFalse: close }] = useBool(false)

  const dispatch = useDispatch()

  // redux数据
  const { user, menu, showMenu, prodCode, showFooter } = useSelector(
    ({ user, authorities, status, prodCode }) => ({
      user: user.user,
      menu: authorities.menu.routes,
      showFooter:
        !location.pathname.includes('/report/') && !location.pathname.includes('/business/'),
      showMenu:
        !location.pathname.includes('/auth/') &&
        ![2, 3, 4].includes(status.orgStatus) &&
        !location.pathname.includes('/report/') &&
        !location.pathname.includes('/msFinance/business') &&
        // !location.pathname.includes('/authResult'),
        prodCode
    })
  )

  const loading = useLoading() // 是否在加载中
  // 用于包裹menu的容器
  const { isMobile, openDrawer, MenuContainer } = useMenuContainer(styles)
  useScrollToTop(location) // 页面切换回到顶部

  // 请求数据
  useEffect(() => {
    if (isLogin) {
      // 获取用户信息
      dispatch({
        type: 'authorities/fetchAuthorities'
      })
      dispatch({
        type: 'user/fetchUser'
      })
      dispatch({
        type: 'dict/fetchDict'
      })
      // dispatch({
      //   type: 'orgType/fetchOrgType',
      //   payload: prodCode
      // })
      //获取页面配置信息
      dispatch({
        type: 'pageConfig/fetchConfig'
      })
      /*dispatch({
        type: 'companyInfo/fetchCompanyInfo'
      })*/
    }
  }, [dispatch, isLogin, prodCode])

  // 右侧信息内容
  const renderRightSection = useCallback(() => {
    //用户头像下拉框操作
    const onMenuClick = ({ key }) => {
      switch (key) {
        case 'logout':
          Modal.confirm({
            title: '退出确认',
            content: '是否确定退出登录？',
            onOk: () => {
              return logout().then((res) => {
                if (res instanceof Error) return
                removeToken()
                dispatch({
                  type: 'USER_LOGOUT'
                })
                router.replace('/user/login')
              })
            }
          })
          break
        case 'reset':
          router.push('/account/password')
          break
        case 'setting':
          router.push('/account/settings')
          break
        default:
          break
      }
    }

    //用户头像下拉框
    const menu = (
      <Menu onClick={onMenuClick}>
        <Menu.Item key="setting">
          <IconFont type="iconjibenxinxi" />
          <span>基本信息</span>
        </Menu.Item>
        <Menu.Item key="reset">
          <IconFont type="iconpassword" />
          <span>密码修改</span>
        </Menu.Item>
        <Menu.Item key="logout">
          <IconFont type="iconloginout" />
          <span>退出登录</span>
        </Menu.Item>
      </Menu>
    )

    return (
      <span className={styles.account}>
        <Dropdown overlay={menu} placement="bottomRight">
         <img className={styles.avatar} src={avatar} alt="" />
        </Dropdown>
        <div className={styles.info}>
          <div>{user.userName || ''}</div>
          <div>{user.orgName || ''}</div>
        </div>
      </span>
    )
  }, [user.avatar, user.userName, user.orgName, dispatch])

  // 移动端汉堡键
  const renderBurgerButton = useCallback(() => {
    return isMobile && <Icon onClick={() => openDrawer()} className={styles.burger} type="menu" />
  }, [isMobile, openDrawer])

  const contentClassName = classnames({
    [styles.content]: true,
    [styles.mobile]: isMobile,
    [styles.hidePadding]: !showMenu
  })

  return (
    <RedirectComp>
      <Layout className={styles.container}>
        <Header>
          <GlobalHeader burger={renderBurgerButton()} right={renderRightSection()} />
        </Header>
        <Loading loading={loading && menu.length === 0}>
          <Layout className={contentClassName}>
            {showMenu && (
              <MenuContainer.Component {...MenuContainer.props}>
                <SiderMenu menu={menu} />
              </MenuContainer.Component>
            )}
            <Platform visible={visible} open={open} close={close} />
            <Content id="basic-content">
              {showMenu && <Breadcrumb />}
              <CatchError>
                <Authorized location={location}>{props.children}</Authorized>
              </CatchError>
              {showFooter && <GlobalFooter />}
            </Content>
          </Layout>
        </Loading>
      </Layout>
    </RedirectComp>
  )
}

export default BasicLayout
