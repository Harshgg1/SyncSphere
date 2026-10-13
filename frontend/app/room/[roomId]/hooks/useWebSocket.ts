'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export function useWebSocket(
  token: string | null,
  roomId: string,
  onMessageRef: React.MutableRefObject<(data: any) => void>
) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  const connectWs = useCallback(() => {
    if (!token) return;
    setWsStatus('connecting');

    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus('connected');
      reconnectAttemptRef.current = 0;
      ws.send(JSON.stringify({ type: 'join_room', payload: { roomId } }));
    };

    ws.onclose = () => {
      setWsStatus('disconnected');
      // Exponential backoff reconnect
      const attempt = reconnectAttemptRef.current;
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      reconnectAttemptRef.current = attempt + 1;
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWs();
      }, delay);
    };

    ws.onerror = () => {
      ws.close();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageRef.current(data);
      } catch {}
    };
  }, [token, roomId, onMessageRef]);

  // Connect on mount, cleanup on unmount
  useEffect(() => {
    if (!token) return;
    connectWs();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on intentional close
        wsRef.current.close();
      }
    };
  }, [token, connectWs]);

  const sendWsMessage = useCallback((type: string, payload: Record<string, any>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  return { wsRef, wsStatus, sendWsMessage };
}
