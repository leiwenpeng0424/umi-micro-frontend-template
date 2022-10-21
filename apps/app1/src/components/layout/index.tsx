import { PropsWithChildren, ReactNode } from 'react';

export default function Layout({
  header,
  content,
  footer,
  pageName,
}: PropsWithChildren<{
  header: ReactNode;
  content: ReactNode;
  footer: ReactNode;
  pageName: ReactNode;
}>) {
  return (
    <div style={{ height: 'calc(100vh - 80px)' }}>
      <h1>{pageName}</h1>
      <div>{header}</div>
      <div>{content}</div>
      <div>{footer}</div>
    </div>
  );
}
