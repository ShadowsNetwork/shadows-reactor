import { defineConfig } from 'umi';

// ref: https://umijs.org/config/
export default defineConfig({
  title: 'shadows-reactor',
  routes: [
    {
      path: '/',
      component: '../layouts/index',
    }
  ],
  antd: {
    dark: true,
    compact: true,
  },
  locale: {
    default: 'zh-CN',
    antd: false,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  favicon: 'static/favicon.png',
  define: {
    'process.env.CHAIN_ID': '0x61',
    'process.env.NETWORK_NAME': 'Binance Smart Chain Testnet',
    'process.env.RPC_URL': 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    'process.env.BLOCK_EXPLORER_URL': 'https://testnet.bscscan.com/'
  }
});
