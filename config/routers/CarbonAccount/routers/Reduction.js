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
        { path: '/reduction/view', exact: true, name: '模切版详情', component: './Reduction/View.js' }
      ]
    }
  ]
}

