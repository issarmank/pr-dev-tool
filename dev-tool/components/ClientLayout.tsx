'use client';

import { SessionProvider } from 'next-auth/react';
import AuthButton from './SessionProviderWrapper';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthButton>
        {children}
      </AuthButton>
    </SessionProvider>
  );
} 