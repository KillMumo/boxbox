export default {
  path: '/msEnterprise',
  routes: [
    {
      path: '/msEnterprise',
      routes: [
        {
          path: '/msEnterprise',
          exact: true,
          // name:'核证管理',
          redirect:'/msEnterprise/list'
        },
        { path: '/msEnterprise/list', redirect: '/msEnterprise/list/6' },
        { path: '/msEnterprise/list/:type', exact: true, name: '交易市场', component: './CarbonAccount/Enterprise/List.js' },
        { path: '/msEnterprise/view/:id', exact:true, name:'详情', component: './CarbonAccount/Enterprise/View'}
        // { path: '/cert/add', exact: true, name: '兑换', component: './CarbonAccount/Cert/Add.js' },
        // { path: '/cert/records', exact: true, name: '兑换记录', component: './CarbonAccount/Cert/Records.js' },
        // { path: '/reduction/type', exact: true, name: '项目类型', component: './Reduction/Type.js' },
        // { path: '/cs/add', exact: true, name: '新增碳汇', component: './CarbonSink/Add.js' },
        // { path: '/cs/view/:id', exact: true, name: '碳汇详情', component: './CarbonSink/view.js' },
        // { path: '/reduction/edit/:id', exact: true, name: '更新减排信息', component: './Reduction/Add.js' },
      ]
    }
  ]
}
