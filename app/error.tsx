'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('UI Crashed:', error);
  }, [error]);

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
      <h2>Something went wrong</h2>
      <p>A critical error occurred while rendering this page.</p>
      <button onClick={() => reset()} type="button" style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Recover Session
      </button>
    </div>
  );
}
