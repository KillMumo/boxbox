export default {
  theme: [
    {
      key: 'filoop_fin',
      fileName: 'filoop_fin.css',
      modifyVars: {
        '@primary-color': '#3BB75F',
        '@menu-dark-bg': '#1F2324',
        '@menu-dark-submenu-bg': '#101011',
      },
    },
    // 海曙
    {
      key: 'p1.induschain.cn',
      fileName: 'p1.induschain.cn.css',
      modifyVars: {
        '@primary-color': '#1989AA',
        '@menu-dark-bg': '#1F2324',
        '@menu-dark-submenu-bg': '#101011',
      },
    },
    {
      key: 'p2.induschain.cn',
      fileName: 'p2.induschain.cn.css',
      modifyVars: {
        '@primary-color': '#3BB75F',
        '@menu-dark-bg': '#1F2324',
        '@menu-dark-submenu-bg': '#101011',
      },
    },
    {
      key: 'p3.induschain.cn',
      fileName: 'p3.induschain.cn.css',
      modifyVars: {
        '@primary-color': '#D81159',
        '@menu-dark-bg': '#1F2324',
        '@menu-dark-submenu-bg': '#101011',
      },
    },
    {
      key: 'localhost',
      fileName: 'localhost.css',
      modifyVars: {
        '@primary-color': '#1989AA',
        '@menu-dark-bg': '#1F2324',
        '@menu-dark-submenu-bg': '#101011',
      },
    },
  ],
  min: process.env.API === 'prod', // 是否压缩css
  isModule: true, // css module
  ignoreAntd: false, // 忽略 antd 的依赖
  ignoreProLayout: true, // 忽略 pro-layout
  cache: true // 使用缓存
};
