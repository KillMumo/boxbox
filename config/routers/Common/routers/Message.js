export default {
  path: '/message',
  routes: [
    {
      path: '/message',
      redirect: '/message/list',
    },
    {
      path: '/message/list',
      routes: [
        { path: '/message/list', exact: true, name: '消息中心', component: './AppCommon/Message/List' }
      ]
    }
  ]
}
