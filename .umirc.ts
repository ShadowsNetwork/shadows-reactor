import { defineConfig } from 'umi'

// ref: https://umijs.org/config/
export default defineConfig({
  title: 'shadows-reactor',
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
  define: {
    'process.env.CHAIN_ID': '0x61',
    'process.env.NETWORK_NAME': 'Binance Smart Chain Testnet',
    'process.env.RPC_URL': 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    'process.env.BLOCK_EXPLORER_URL': 'https://testnet.bscscan.com'
  }/*,
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
