import { Suspense } from 'react';
import '../styles/global.scss';
import ClientInitializer from './ClientInitializer';
import MainLayout from './MainLayout';
import { ReduxProvider } from './ReduxProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import I18nProvider from './i18nProvider';

export const metadata = {
  title: 'Star Wars - RS School',
  description: 'RS School React Project 2025 Q3',
};

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  let messages;
  try {
    messages = (await import(`../messages/${params.locale}.json`)).default;
  } catch {
    messages = (await import(`../messages/en.json`)).default;
  }

  return (
    <html lang={params.locale}>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <I18nProvider locale={params.locale} messages={messages}>
            <ErrorBoundary>
              <ReduxProvider>
                <ClientInitializer />
                <MainLayout>{children}</MainLayout>
              </ReduxProvider>
            </ErrorBoundary>
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  );
};

export default Layout;
