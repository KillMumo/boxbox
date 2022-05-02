export default {
  path: '/auth',
  name: '认证',
  routes: [
    { path: '/auth', redirect: '/auth/upload' },
    {
      path: '/auth/upload',
      exact: true,
      component: './Auth'
    },
    { path: '/auth/result', exact: true, component: './Auth/Result' },
    {
      path: '/auth/edit',
      exact: true,
      component: './Auth'
    }
  ]
}
