'use client';
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // In CI or local without a valid Privy app ID, render children without the provider
  if (!appId || appId.startsWith('dummy')) {
    return <>{children}</>;
  }

  return (
    <BasePrivyProvider
      appId={appId}
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: 'dark',
          accentColor: '#8b29f3',
          logo: '/logo.png',
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  );
}
