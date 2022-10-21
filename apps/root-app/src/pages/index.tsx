import React from 'react';
import Layout from '@/Layout';

export default function IndexPage({
  children,
}: {
  children: React.ReactElement;
}) {
  return <Layout title="Main Title">{children}</Layout>;
}
