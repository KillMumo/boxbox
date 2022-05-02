export default {
  path: '/cs',
  routes: [
    {
      path: '/cs',
      routes: [
        {
          path: '/cs',
          exact: true,
          name:'碳汇管理',
         redirect:'/cs/list'
        },
        { path: '/cs/list', exact: true, name: '碳汇列表', component: './CarbonSink/List.js' },
        // { path: '/reduction/type', exact: true, name: '项目类型', component: './Reduction/Type.js' },
        { path: '/cs/add', exact: true, name: '新增碳汇', component: './CarbonSink/Add.js' },
        { path: '/cs/view/:id', exact: true, name: '碳汇详情', component: './CarbonSink/View.js' },
        // { path: '/reduction/edit/:id', exact: true, name: '更新减排信息', component: './Reduction/Add.js' },
      ]
    }
  ]
}

