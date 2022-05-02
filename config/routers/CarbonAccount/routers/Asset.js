export default {
  path: '/device',
  routes: [
    {
      path: '/device',
      routes: [
        {
          path: '/device',
          name: '设备管理',
          exact: true,
          component: './CarbonAccount/Device/List.js'
        },
        { path: '/device/list', exact: true, name: '设备管理', component: './CarbonAccount/Device/List.js' },
        { path: '/device/update', exact: true, name: '修改设备', component: './CarbonAccount/Device/update.js' },
        { path: '/device/add', exact: true, name: '添加设备', component: './CarbonAccount/Device/Add.js' },
        { path: '/device/view/:id', exact: true, name: '设备详情', component: './CarbonAccount/Device/view.js' },
        { path: '/device/waterList', exact: true, name: '流水列表', component: './CarbonAccount/Device/WaterList.js' }
      ]
    }
  ]
}

