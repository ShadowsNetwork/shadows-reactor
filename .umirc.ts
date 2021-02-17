import { defineConfig } from 'umi';

// ref: https://umijs.org/config/
export default defineConfig({
  title: 'shadows-reactor-umi',
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: '../pages/index' }
      ]
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
});
