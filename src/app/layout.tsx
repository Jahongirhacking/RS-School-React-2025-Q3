import { Suspense } from 'react';
import '../styles/global.scss';
import ClientInitializer from './ClientInitializer';
import MainLayout from './MainLayout';
import { ReduxProvider } from './ReduxProvider';

export const metadata = {
  title: 'Star Wars',
  description: 'RS School React 2025 Q3',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <ReduxProvider>
            <ClientInitializer />
            <MainLayout>{children}</MainLayout>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
};

export default Layout;
