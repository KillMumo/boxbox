export default {
  path: '/methodMgr',
  routes: [
    {
      path: '/methodMgr',
      routes: [
        {
          path: '/methodMgr',
          redirect:'/methodMgr/list'
        },
        { path: '/methodMgr/list', exact: true, name: '方法学管理', component: './CarbonAccount/Method/List.js' },
        { path: '/methodMgr/add', exact: true, name: '新增方法学', component: './CarbonAccount/Method/Add.js' },
        { path: '/methodMgr/detail', exact: true, name: '详情', component: './CarbonAccount/Method/Detail.js' },
        { path: '/methodMgr/edit', exact: true, name: '编辑方法学', component: './CarbonAccount/Method/Edit.js' },
        { path: '/methodMgr/view', exact: true, name: '详情', component: './CarbonAccount/Method/View.js' },
        // { path: '/methodMgr/add', exact: true, name: '兑换', component: './CarbonAccount/Cert/Add.js' },
        // { path: '/methodMgr/records', exact: true, name: '兑换记录', component: './CarbonAccount/Cert/Records.js' },
        // { path: '/reduction/type', exact: true, name: '项目类型', component: './Reduction/Type.js' },
        // { path: '/cs/add', exact: true, name: '新增碳汇', component: './CarbonSink/Add.js' },
        // { path: '/cs/view/:id', exact: true, name: '碳汇详情', component: './CarbonSink/view.js' },
        // { path: '/reduction/edit/:id', exact: true, name: '更新减排信息', component: './Reduction/Add.js' },
      ]
    }
  ]
}

