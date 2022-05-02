export default {
  path: '/platform',
  routes: [
    { path: '/platform', redirect: '/platform/company' },
    {
      path: '/platform/company',
      routes: [
        { path: '/platform/company', name: '平台企业', exact: true, component: './AppCommon/Platform/Company/List' },
        { path: '/platform/company/view/:id', name: '详情', exact: true, component: './AppCommon/Platform/Company/View' },
        { path: '/platform/company/viewSet/:id', name: '查看', exact: true, component: './AppCommon/Platform/Company/ViewSet' },
        { path: '/platform/company/review/:id', name: '审核', exact: true, component: './AppCommon/Platform/Company/Review' },
      ]
    },
    {
      path: '/platform/setRole',
      routes: [
        { path: '/platform/setRole', name: '平台企业', exact: true, component: './AppCommon/Platform/SetRole/List' },
        { path: '/platform/setRole/set/:id', name: '设置角色', exact: true, component: './AppCommon/Platform/SetRole/Set' },
      ]
    }
  ]
}