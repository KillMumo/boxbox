export default {
  path: '/account',
  routes: [
    {
      path: '/account',
      redirect: '/account/settings',
    },
    { path: '/account/settings', exact: true, name: '基本信息', component: './AppCommon/Account/Setting/Info.js' },
    { path: '/account/password', exact: true, name: '修改密码', component: './AppCommon/Account/Setting/Reset' },
    {
      path: '/account/modifyPhone',
      component: './AppCommon/Account/Setting/ModifyPhone',
      routes: [
        { path: '/account/modifyPhone', exact: true, component: './AppCommon/Account/Setting/ModifyPhone/Step1'},
        { path: '/account/modifyPhone/step2', exact: true, component: './AppCommon/Account/Setting/ModifyPhone/Step2'},
        { path: '/account/modifyPhone/step3', exact: true, component: './AppCommon/Account/Setting/ModifyPhone/Step3'}
      ]
    }
  ]
}
