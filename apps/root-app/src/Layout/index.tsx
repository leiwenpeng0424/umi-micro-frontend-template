import type { PropsWithChildren } from 'react';
import { useHistory } from 'umi';
import ProLayout from '@ant-design/pro-layout';

export default function MainLayout(
  props: PropsWithChildren<{ title: string }>,
) {
  const history = useHistory();

  return (
    <ProLayout
      style={{ height: '100vh' }}
      title={props.title}
      menuProps={{
        onClick: ({ key }) => history.push({ pathname: key }),
      }}
      route={{
        // 路由配置从外部获取。
        routes: [
          { path: '/app1', name: 'app1' },
          { path: '/app2', name: 'app2' },
          { path: '/app3', name: 'app3' },
        ],
      }}
    >
      {props.children}
    </ProLayout>
  );
}
