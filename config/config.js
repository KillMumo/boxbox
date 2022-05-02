// ref: https://umijs.org/config/
import path from 'path'
import routes from './router.config'
import theme from './theme'
import ApiConfig from './ApiConfig'
import pluginConfig from './plugin.config'
import themePluginConfig from './theme.plugin.config'
import slash from 'slash2'

const plugins = [
  // ref: https://umijs.org/plugin/umi-plugin-react.html
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        immer: true,
        hmr: true,
      },
      dynamicImport: {
        loadingComponent: './components/Loading/PageLoading',
        webpackChunkName: true,
        level: 3,
      },
      dll: {
        include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch', 'react', 'react-dom', 'react-redux', 'redux', 'antd'],
        exclude: ['@babel/runtime', '@dragon/request', '@dragon/hooks', '@dragon/page-context']
      },
      hardSource: false
    }
  ],
  ['umi-plugin-antd-theme', themePluginConfig]
]

const config = {
  plugins,
  // history: 'hash',
  hash: true,
  targets: {
    ie: 10,
    android: 4,
    ios: 7
  },
  // base: '/web',
  // publicPath: '/web/',
  define: {
    'process.env.API': process.env.API || 'dev',
  },
  // 路由配置
  routes,
  // Theme for antd
  theme,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  treeShaking: true,
  disableRedirectHoist: true,
  alias: {
    '@': path.resolve(__dirname, '../src'),
    '~': path.resolve(__dirname, '../src/pages')
  },
  proxy: {
    '/matrix': {
      target: ApiConfig[process.env.API],
      changeOrigin: true,
      pathRewrite: { '^/matrix': '/matrix' }
    },
    '/v1': {
      target: 'http://api.induschain.cn/mock/192',
      changeOrigin: true,
      pathRewrite: { '^/v1': '/v1' }
    },
  },
  ignoreMomentLocale: true,
  uglifyJSOptions(opts) {
    opts.uglifyOptions.compress['drop_console'] = true
    return opts
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: pluginConfig
}

export default config
