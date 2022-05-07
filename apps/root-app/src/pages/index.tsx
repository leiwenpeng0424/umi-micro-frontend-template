import styles from './index.less';
import { Link } from 'umi';
import React from 'react';

export default function IndexPage({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <div>
      <h1 className={styles.title}>Root App Page index</h1>
      <div>
        <Link to={'/app1'}>app1</Link>
        <Link to={'/app2'}>app2</Link>
        <Link to={'/app3'}>app3</Link>
      </div>
      <div>{children}</div>
    </div>
  );
}
