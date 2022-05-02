export default {
  path: '/system',
  routes: [
    {
      path: '/system/org',
      routes: [
        { path: '/system/org', exact: true, name: '机构管理', component: './AppCommon/System/Dept/List' },
        { path: '/system/org/add', exact: true, name: '添加机构', component: './AppCommon/System/Dept/Add' },
        { path: '/system/org/edit/:id', exact: true, name: '修改机构', component: './AppCommon/System/Dept/Add' },
        { path: '/system/org/view/:id', exact: true, name: '机构详情', component: './AppCommon/System/Dept/View' },
      ]
    },
    {
      path: '/system/dict',
      routes: [
        { path: '/system/dict', exact: true, name: '字典管理', component: './AppCommon/System/Dict/List' },
        { path: '/system/dict/add', exact: true, name: '添加字典', component: './AppCommon/System/Dict/Add' },
        { path: '/system/dict/edit/:id', exact: true, name: '修改字典', component: './AppCommon/System/Dict/Add' },
        { path: '/system/dict/view/:id', exact: true, name: '字典详情', component: './AppCommon/System/Dict/View' },
      ]
    },
    {
      path: '/system/menu',
      routes: [
        { path: '/system/menu', exact: true, name: '菜单管理', component: './AppCommon/System/Menu/MenuList'},
        { path: '/system/menu/add', exact: true, name: '新增菜单', component: './AppCommon/System/Menu/MenuAdd' },
        { path: '/system/menu/view/:id', exact: true, name: '查看菜单', component: './AppCommon/System/Menu/MenuView' },
        { path: '/system/menu/edit/:id', exact: true, name: '修改菜单', component: './AppCommon/System/Menu/MenuAdd' },
      ]
    },
    {
      path: '/system/param',
      routes: [
        { path: '/system/param', exact: true, name: '参数管理', component: './AppCommon/System/Param/ParamList'},
        { path: '/system/param/add', exact: true, name: '新增参数', component: './AppCommon/System/Param/ParamAdd' },
        { path: '/system/param/view/:id', exact: true, name: '查看参数', component: './AppCommon/System/Param/ParamView' },
        { path: '/system/param/edit/:id', exact: true, name: '修改参数', component: './AppCommon/System/Param/ParamAdd' },
      ]
    },
    {
      path: '/system/tenant',
      routes: [
        { path: '/system/tenant', exact: true, name: '租户管理', component: './AppCommon/System/Tenant/TenantList'},
        { path: '/system/tenant/add', exact: true, name: '新增租户', component: './AppCommon/System/Tenant/TenantAdd' },
        { path: '/system/tenant/view/:id', exact: true, name: '查看租户', component: './AppCommon/System/Tenant/TenantView' },
        { path: '/system/tenant/edit/:id', exact: true, name: '修改租户', component: './AppCommon/System/Tenant/TenantAdd' },
      ]
    },
  ]
}
