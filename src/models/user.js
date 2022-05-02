import { fetchUser } from '@/services/user'
import routes from '../../config/router.config'

function getBreadcrumbNameMap(routes) {
  let breadcrumbNameMap = {}

  const flattenRoute = (routes) => {
    routes.forEach((route) => {
      if (route.name && route.path) {
        breadcrumbNameMap[route.path] = route.name
      }
      if (Array.isArray(route.routes) && route.routes) {
        flattenRoute(route.routes)
      }
    })
  }

  flattenRoute(routes)

  return breadcrumbNameMap
}

const UserModel = {
  namespace: 'user',

  state: {
    user: {}, // account, userName, avatar
    role: '',
    breadcrumbNameMap: getBreadcrumbNameMap(routes)
  },

  effects: {
    *fetchUser(_, { call, put }) {
      const response = yield call(fetchUser)
      if (response instanceof Error) return
      const role = response.roleCodes.length
        ? response.roleCodes[0] === 'org_admin'
          ? response.roleCodes[1]
          : response.roleCodes[0]
        : ''
      const res = {
        ...response,
        role: role
      }
      yield put({
        type: 'saveUser',
        payload: res
      })
    }
  },

  reducers: {
    saveUser(state, { payload: user }) {
      return {
        ...state,
        user: {
          ...state.user,
          ...user
        },
        role: user.role
      }
    }
  }
}

export default UserModel
