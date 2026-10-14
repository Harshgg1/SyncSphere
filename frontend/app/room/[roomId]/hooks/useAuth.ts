'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // First, verify the session and get user info
        const meRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (!meRes.ok) {
          router.push('/');
          return;
        }
        const meData = await meRes.json();
        setCurrentUser(meData.user);

        // Then, fetch the raw token for WebSocket connections
        const tokenRes = await fetch('/api/auth/token', { credentials: 'include' });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          setToken(tokenData.token);
        }
      } catch {
        router.push('/');
      }
    }
    checkAuth();
  }, [router]);

  // Request notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return { token, currentUser };
}
