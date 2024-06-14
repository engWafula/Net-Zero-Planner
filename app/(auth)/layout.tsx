'use client';

import { useSession } from 'next-auth/react';
import AuthHeader from '../components/AuthHeader';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  return (
    <main>
      <AuthHeader />
      {children}
    </main>
  );
}
