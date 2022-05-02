export default {
  path: '/log', 
  routes: [
    { path: '/log', redirect: '/log/logapi' },
    {
      path: '/log/logapi',
      routes: [
        { path: '/log/logapi', name: '接口日志', exact: true, component: './AppCommon/Log/Api/List' },
        { path: '/log/logapi/view/:id', name: '详情', exact: true, component: './AppCommon/Log/Api/View' }
      ]
    },
    {
      path: '/log/logerror',
      routes: [
        { path: '/log/logerror', name: '异常日志', exact: true, component: './AppCommon/Log/Error/List' },
        { path: '/log/logerror/view/:id', name: '详情', exact: true, component: './AppCommon/Log/Error/View' }
      ]
    }
  ]
}