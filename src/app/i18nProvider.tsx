'use client';

import { IntlProvider } from 'next-intl';

interface I18nProviderProps {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
}

export default function I18nProvider({
  children,
  locale,
  messages,
}: I18nProviderProps) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}
