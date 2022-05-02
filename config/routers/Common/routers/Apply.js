export default {
  path: '/apply',
  name: '事项申请',
  routes: [
    { path: '/apply/todo', name: '发起申请', exact: true, component: './AppCommon/Apply/Todo' },
    { path: '/apply/history', name: '申请历史', exact: true, component: './AppCommon/Apply/History/List' },
  ]
}