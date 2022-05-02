export default {
  path: '/authority', 
  routes: [
    { path: '/authority', redirect: '/authority/role' },
    {
      path: '/authority/role',
      routes: [
        { path: '/authority/role', exact: true, name: '角色管理', component: './AppCommon/Authority/Role/List' },
        { path: '/authority/role/add', exact: true, name: '添加角色', component: './AppCommon/Authority/Role/Add' },
        { path: '/authority/role/edit/:id', exact: true, name: '修改角色', component: './AppCommon/Authority/Role/Add' },
        { path: '/authority/role/view/:id', exact: true, name: '角色详情', component: './AppCommon/Authority/Role/View' },
      ]
    },
    {
      path: '/authority/interface',
      routes: [
        { path: '/authority/interface', exact: true, name: '接口管理', component: './AppCommon/Authority/Interface/List' }
      ]
    }
  ]
}