import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/pages/index',
      routes: [
        { path: '/app1', microApp: 'app1' },
        { path: '/app2', microApp: 'app2' },
        { path: '/app3', microApp: 'app3' },
      ],
    },
  ],
  fastRefresh: {},
  qiankun: {
    master: {
      apps: [
        { name: 'app1', entry: '//localhost:8001/app1' },
        {
          name: 'app2', // 唯一 id
          entry: '//localhost:8002/app2',
        },
        {
          name: 'app3', // 唯一 id
          entry: '//localhost:8003/app3',
        },
      ],
    },
  },
});
