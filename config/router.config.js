import UserLayoutRoutes from './routers/UserLayoutRoutes' // userLayout路由
import CommonRoutes from './routers/Common'
import CarbonAccount from './routers/CarbonAccount' // 通用路由

const routes = [
  {
    path: '/exception',
    component: '../layouts/ExceptionLayout',
    routes: [{ path: '/exception/500', exact: true, component: './500' }]
  },
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: UserLayoutRoutes
  },
  {
    path: '/download',
    component: '../layouts/BlankLayout',
    routes: [{ path: '/download', exact: true, component: './AppMicroSubsides/DownloadTips' }]
  },
  {
    path: '/report',
    component: './AppMicroSubsides/Report',
    routes: [
      {
        path: '/report/risk/:id',
        exact: true,
        component: './AppMicroSubsides/Report/Report/Report'
      },
      // { path: '/report/risk/:id', exact: true, component: './AppMicroSubsides/Report/RiskReport/RiskReport' },
      {
        path: '/report/af/:id',
        exact: true,
        component: './AppMicroSubsides/Report/AFReport/AFReport'
      },
      {
        path: '/report/monitor/:id',
        exact: true,
        component: './AppMicroSubsides/Report/MonitorReport/MonitorReport'
      },
      {
        path: '/report/detail',
        exact: true,
        component: './AppMicroSubsides/Report/ReportDetail/ReportDetail'
      },
      {
        component: '../components/Exception'
      }
    ]
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/home' },
      { path: '/home', exact: true, component: './Home', name: '首页' },
      {
        path: '/databoard',
        routes: [
          { path: '/databoard', redirect: '/databoard/view' },
          { path: '/databoard/view', exact: true, name: '数据大屏', component: './DataBoard/List' }
        ]
      },
      {
        path: '/dataManagement',
        routes: [
          { path: '/dataManagement', redirect: '/dataManagement/allList' },
          {
            path: '/dataManagement/allList',
            exact: true,
            name: '模切版管理',
            component: './DataManage/WaterList'
          },
          {
            path: '/dataManagement/allList/details',
            exact: true,
            name: '详情',
            component: './DataManage/WaterList/details.js'
          },
          {
            path: '/dataManagement/dataReport',
            exact: true,
            name: '用户管理',
            component: './DataManage/List'
          },
          {
            path: '/dataManagement/importLog',
            exact: true,
            name: '录入日志',
            component: './DataManage/Loglist'
          },
          {
            path: '/dataManagement/list/add',
            exact: true,
            name: '新增',
            component: './DataManage/View'
          },
          {
            path: '/dataManagement/list/edit/:companyName/:year',
            exact: true,
            name: '编辑',
            component: './DataManage/View'
          },
          {
            path: '/dataManagement/dataReport/:companyName/:year/:industry',
            exact: true,
            name: '详情',
            component: './DataManage/View'
          },
          
        ]
      },
      {
        path: '/dataAnalysis',
        routes: [
          {
            path: '/dataAnalysis/companyAnalysis',
            routes: [
              {
                path: '/dataAnalysis/companyAnalysis',
                exact: true,
                name: '企业碳排概览',
                component: './DataParam/List'
              }
            ]
          },
          {
            path: '/dataAnalysis/industryAnalysis',
            routes: [
              {
                path: '/dataAnalysis/industryAnalysis',
                exact: true,
                name: '行业碳排分析',
                component: './DataParam/IndustryList'
              }
            ]
          },
          {
            path: '/dataAnalysis/greenCompany',
            routes: [
              {
                path: '/dataAnalysis/greenCompany',
                exact: true,
                name: '绿色制造企业',
                component: './DataParam/greenCompany'
              }
            ]
          },
          {
            path: '/dataAnalysis/KeyCompany',
            routes: [
              {
                path: '/dataAnalysis/KeyCompany',
                exact: true,
                name: '重点碳排企业',
                component: './DataParam/KeyCompany'
              }
            ]
          }
        ]
      },
      /** 产品路由 */
      ...CarbonAccount,
      ...CommonRoutes,

      /** 产品路由 */
      {
        component: '../components/Exception'
      },


    ]
  }
]

export default routes
