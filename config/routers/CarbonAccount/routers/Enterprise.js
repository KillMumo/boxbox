export default {
  path: '/msEnterprise',
  routes: [
    {
      path: '/msEnterprise',
      routes: [
        {
          path: '/msEnterprise',
          exact: true,
          redirect:'/msEnterprise/list'
        },
        // { path: '/msEnterprise/list', redirect: '/msEnterprise/list/6' },
        { path: '/msEnterprise/list', exact: true, name: '交易市场', component: './CarbonAccount/Enterprise/List.js' },
        { path: '/msEnterprise/view', exact:true, name:'详情', component: './CarbonAccount/Enterprise/View'}
      ]
    }
  ]
}
