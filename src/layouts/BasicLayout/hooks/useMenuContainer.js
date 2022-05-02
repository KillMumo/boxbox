import { useBool, useResponsive } from '@dragon/hooks'
import { Layout, Drawer } from 'antd'

const { Sider } = Layout

const useMenuContainer = (styles) => {
  const [drawerVisible, { setTrue: openDrawer, setFalse: closeDrawer }] = useBool(false)

  const { md } = useResponsive()

  const result = md
    ? {
        Component: Sider,
        props: {
          className: styles.menu,
          width: 200
        }
      }
    : {
        Component: Drawer,
        props: {
          className: styles.drawer,
          placement: 'left',
          closable: false,
          onClose: closeDrawer,
          visible: drawerVisible
        }
      }

  return {
    isMobile: !md,
    openDrawer,
    MenuContainer: result
  }
}

export default useMenuContainer
