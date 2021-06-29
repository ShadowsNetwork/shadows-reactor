import { defineConfig } from 'umi'

// ref: https://umijs.org/config/
export default defineConfig({
  title: 'Shadows',
  routes: [
    {
      path: '/',
      component: '../layouts/index'
    }
  ],
  antd: {
    dark: true,
    compact: true
  },
  locale: {
    default: 'en',
    antd: false,
    title: false,
    baseNavigator: true,
    baseSeparator: '-'
  },
  nodeModulesTransform: {
    type: 'none',
    exclude: []
  },
  favicon: 'static/favicon.png',
  scripts: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-LERKYP5YHD',
      async: true
    },
    {
      content: `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-LERKYP5YHD');`,
      charset: 'utf-8'
    },
  ]
  /*,
   chainWebpack(config) {
     config.merge({
       optimization: {
         minimize: true,
         splitChunks: {
           chunks: 'async',
           minSize: 30000,
           minChunks: 2,
           automaticNameDelimiter: '.',
           cacheGroups: {
             react: {
               name: 'react',
               test: /[\\/]node_modules[\\/](react)[\\/]/,
               priority: -9,
               enforce: true
             },
             reactDom: {
               name: 'react-dom',
               test: /[\\/]node_modules[\\/](react-dom)[\\/]/,
               priority: -9,
               enforce: true
             },
             vendors: {
               name: 'vendors',
               test: /[\\/]node_modules[\\/]/,
               priority: -11,
               enforce: true
             },
             antd: {
               name: 'antd',
               test: /[\\/]node_modules[\\/]antd[\\/]/,
               chunks: 'all',
               priority: 9
             },
             lodash: {
               name: 'lodash',
               test: /[\\/]node_modules[\\/]lodash[\\/]/,
               chunks: 'all',
               priority: -2
             }
           }
         }
       }
     })
     //过滤掉momnet的那些不使用的国际化文件
     config.plugin('replace')
       .use(require('webpack').ContextReplacementPlugin)
       .tap(() => {
         return [/moment[/\\]locale$/, /zh-cn/]
       })
   }*/
})
