'use client';

import { useState, useRef, useCallback } from 'react';

export function useTyping(
  roomId: string,
  sendWsMessage: (type: string, payload: Record<string, any>) => void,
  wsRef: React.MutableRefObject<WebSocket | null>,
  currentUser: { id: string; username: string } | null
) {
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Call when the local user types — debounces start/stop signals
  const emitTyping = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendWsMessage('typing', { roomId, isTyping: true });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        isTypingRef.current = false;
        sendWsMessage('typing', { roomId, isTyping: false });
      }
    }, 2000);
  }, [roomId, sendWsMessage, wsRef]);

  // Call when a message is sent — immediately stops the typing signal
  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendWsMessage('typing', { roomId, isTyping: false });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  }, [roomId, sendWsMessage]);

  // Handle incoming typing WS event
  const handleTypingEvent = useCallback(
    (data: any) => {
      const { userId, username, isTyping: typing } = data;
      if (currentUser && userId === currentUser.id) return;
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (typing) {
          next.set(userId, username);
        } else {
          next.delete(userId);
        }
        return next;
      });
    },
    [currentUser]
  );

  return { typingUsers, emitTyping, stopTyping, handleTypingEvent };
}
