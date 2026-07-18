"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Leaf } from 'lucide-react';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // on initial load or path change - run auth check
    authCheck(pathname);
  }, [pathname]);

  async function authCheck(url: string) {
    const publicPaths = ['/login', '/register'];
    const path = url.split('?')[0];

    // If it's a public path, always allow it
    if (publicPaths.includes(path)) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    const token = localStorage.getItem('token');
    
    try {
      // Validate token or NextAuth session via backend
      const res = await fetch('/api/auth/me', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (res.ok) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        // If they had an invalid token, remove it
        if (token) localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error) {
      setAuthorized(false);
      router.push('/login');
    } finally {
      setChecking(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
        <Leaf className="w-12 h-12 text-green-600 animate-bounce mb-4" />
        <p className="text-green-700 font-medium">Verifying session...</p>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
