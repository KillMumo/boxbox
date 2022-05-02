export default {
  path: '/instance',
  routes: [
    { path: '/instance/todo', name: '待办事项', exact: true, component: './AppCommon/Instance/Todo/List' },
    { path: '/instance/done', name: '已办事项', exact: true, component: './AppCommon/Instance/Done/List' }
  ]
}