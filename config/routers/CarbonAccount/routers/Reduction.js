export default {
  path: '/reduction',
  routes: [
    {
      path: '/reduction',
      routes: [
        {
          path: '/reduction',
          exact: true,
          name:'模切版审核',
          component: './Reduction/List.js'
        },
        { path: '/reduction/list', exact: true, name: '模切版审核', component: './Reduction/List.js' },
        { path: '/reduction/type', exact: true, name: '项目类型', component: './Reduction/Type.js' },
        { path: '/reduction/add', exact: true, name: '新增减排', component: './Reduction/Add.js' },
        { path: '/reduction/view/:id', exact: true, name: '减排详情', component: './Reduction/View.js' },
        { path: '/reduction/edit/:id', exact: true, name: '更新减排信息', component: './Reduction/Add.js' },
      ]
    }
  ]
}

