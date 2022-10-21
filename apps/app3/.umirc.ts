import { defineConfig } from 'umi';

export default defineConfig({
  qiankun: {
    slave: {},
  },
  nodeModulesTransform: {
    type: 'none',
  },
  base: 'app1/',
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
});
