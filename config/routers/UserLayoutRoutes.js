export default [
  { path: '/user', redirect: '/user/login' },
  { path: '/user/msLogin', redirect: '/user/login' }, // msLogin是历史原因，现只用于跳转到user/login

  { path: '/user/login', exact: true, component: './User/Login' },
  {
    path: '/user/forget',
    component: './User/Forget',
    routes: [
      { path: '/user/forget', exact: true, component: './User/Forget/Step1' },
      { path: '/user/forget/step2', exact: true, component: './User/Forget/Step2' },
      { path: '/user/forget/step3', exact: true, component: './User/Forget/Step3' }
    ]
  },
  {
    path: '/user/register/update',
    // component: './User/Register',
    routes: [
      { path: '/user/register/update', exact: true, component: './User/DynamicRegister' },
      {
        path: '/user/register/update/success',
        exact: true,
        component: './User/DynamicRegister/RegisterSuccess'
      }
    ]
    // routes: [
    //   { path: '/user/register/update', exact: true, component: './User/Register/Step1' },
    //   { path: '/user/register/update/step2', exact: true, component: './User/Register/Step2' },
    //   { path: '/user/register/update/step3', exact: true, component: './User/Register/Step3' }
    // ]
  },
  {
    path: '/user/register',
    routes: [
      { path: '/user/register', exact: true, component: './User/DynamicRegister' },
      {
        path: '/user/register/success',
        exact: true,
        component: './User/DynamicRegister/RegisterSuccess'
      }
    ]
    // routes: [
    //   { path: '/user/register', exact: true, component: './User/Register/Step1'},
    //   { path: '/user/register/step2', exact: true, component: './User/Register/Step2'},
    //   { path: '/user/register/step3', exact: true, component: './User/Register/Step3'}
    // ]
  },
  { path: '/user/resetPassword', exact: true, component: './User/ResetPassWord' },
  {
    component: '../components/Exception'
  }
]
