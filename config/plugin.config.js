export default (config) => {
  config.module
    .rule('eslint')
    .use('eslint-loader')
    .options({
      eslintPath: require.resolve('eslint')
    })
}