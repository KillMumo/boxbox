export default {
  path: '/flow',
  routes: [
    {
      path: '/flow',
      routes: [
        { path: '/flow', name: '流程管理', exact: true, component: './AppCommon/Flow/FlowList' },
        { path: '/flow/add', name: '新增流程', exact: true, component: './AppCommon/Flow/FlowAdd' },
        { path: '/flow/edit/:id', name: '修改流程', exact: true, component: './AppCommon/Flow/FlowAdd' },
      ]
    }
  ]
}
