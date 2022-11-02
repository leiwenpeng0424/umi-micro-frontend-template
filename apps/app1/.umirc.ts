import { defineConfig } from 'umi';

export default defineConfig({
  locale: {
    default: 'en-US',
  },
  qiankun: {
    slave: {},
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  plugins: ['../../scripts/clients.js'],
  clients: [
    {
      requestLib: {
        importSource: '@/utils/_request',
        requestMethod: 'fetch', // 写成 fetch，避免和接口参数重名
        namedExports: false,
      },
      schema: 'https://172.31.2.114:31801/ummi-device/v2/api-docs',
      clientName: 'rms-web',
      gen: require('../../libraries/openapi-generator'),
    },
  ],
});
