import pathToRegexp from 'path-to-regexp'
import { fetchAuthorities } from '@/services/user'

export default {
  namespace: 'authorities',

  state: {
    menu: {
      // 菜单的数据
      routes: [],
      // 用于权限校验
      routesReges: []
    },
    button: {
      // 按钮的code
      buttons: [],
      // 用于权限校验
      buttonReges: []
    }
  },

  effects: {
    *fetchAuthorities(_, { call, put }) {
      const res = yield call(fetchAuthorities)
      if (res instanceof Error) return
      const { routes, buttons } = res

      const finalRoutes = [{ path: '/home', source: 'iconshouye', name: '首页' }].concat(routes)

      yield put({
        type: 'saveAuthorities',
        payload: {
          menu: {
            routes: formatMenu(finalRoutes),
            routesReges: formatter(finalRoutes)
          },
          button: {
            buttons: formatCode(buttons),
            buttonReges: formatter(buttons)
          }
        }
      })
    }
  },

  reducers: {
    saveAuthorities: (state, { payload }) => {
      state.menu = payload.menu
      state.button = payload.button
    }
  }
}

/**
 * url解析成正则
 * @param menus
 */
function formatter(authorities) {
  return authorities.reduce((authArr, current) => {
    if (Array.isArray(current.children)) {
      return authArr.concat(formatter(current.children))
    } else {
      // 带星号的说明是参数路由，为了方便校验，把*去掉作为备用路由
      if (current.path) {
        if (current.path.includes('*')) {
          authArr.push(pathToRegexp(current.path.replace(/\*/g, ''), { end: false }))
        }
        // end的 true/false 分别代表 路有权限严格模式的开/关
        return authArr.concat(pathToRegexp(current.path.replace(/\*/g, ':p'), { end: false }))
      }
      return authArr.concat()
    }
  }, [])
}

// button 转code
function formatCode(buttons) {
  return buttons.reduce((codes, current) => {
    if (Array.isArray(current.children)) {
      return codes.concat(formatCode(current.children))
    } else {
      return codes.concat(current.code)
    }
  }, [])
}

// menu 去*
function formatMenu(menus) {
  return menus.map((m) => ({
    ...m,
    path: m.path?.replace(/\/\*/g, ''),
    children: m.children ? formatMenu(m.children) : void 0
  }))
}
