"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(pathname);
  }, [pathname]);

  function authCheck(url: string) {
    // public paths that don't require authentication
    const publicPaths = ['/login', '/register'];
    const path = url.split('?')[0];

    const token = localStorage.getItem('token');

    if (!token && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }

  return authorized ? <>{children}</> : null;
}
