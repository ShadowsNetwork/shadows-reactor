// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(createProxyMiddleware('/some-path',
    {
      target: '',
      pathRewrite: {
        '^/some-path': ''
      },
      changeOrigin: true,
      secure: true,
      ws: true
    }
  ))
}
