export default {
  path: '/userCenter',
  routes: [
    { path: '/userCenter', redirect: '/userCenter/bank' },
    {
      path: '/userCenter/bank',
      routes: [
        { path: '/userCenter/bank', exact: true, name: '银行账户', component: './AppCommon/UserCenter/Bank/BankList' },
        { path: '/userCenter/bank/add', exact: true, name: '添加账户', component: './AppCommon/UserCenter/Bank/BankAdd' }
      ]
    },
    { path: '/userCenter',redirect: '/userCenter/user' },
    {
      path: '/userCenter/user',
      routes: [
        { path: '/userCenter/user', exact: true, name: '用户管理', component: './AppCommon/UserCenter/User/List'},
        { path: '/userCenter/user/add', exact: true, name: '添加新用户', component: './AppCommon/UserCenter/User/Add' },
        { path: '/userCenter/user/import', exact: true, name: '导入企业用户', component: './AppCommon/UserCenter/User/Import' },
        { path: '/userCenter/user/edit/:id', exact: true, name: '更新用户', component: './AppCommon/UserCenter/User/Add' },
        { path: '/userCenter/user/view/:id', exact: true, name: '详情', component: './AppCommon/UserCenter/User/View' },
      ]
    },
    {
      path: '/userCenter/certificate',
      routes: [
        { path: '/userCenter/certificate', exact: true, name: '认证信息', component: './AppCommon/UserCenter/Certification/List' }
      ]
    },
    {
      path: '/userCenter/related',
      routes: [
        { path: '/userCenter/related', exact: true, name: '关联企业', component: './AppCommon/UserCenter/Related/RelatedList' }
      ]
    }
  ]
}
