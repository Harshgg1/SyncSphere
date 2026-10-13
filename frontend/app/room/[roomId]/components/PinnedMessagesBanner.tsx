import React from 'react';
import { Message } from '../../../../types';

interface PinnedMessagesBannerProps {
  pinnedMessages: Message[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isAdmin: boolean;
  onUnpin: (msgId: string) => void;
}

export default function PinnedMessagesBanner({
  pinnedMessages,
  isOpen,
  setIsOpen,
  isAdmin,
  onUnpin,
}: PinnedMessagesBannerProps) {
  if (pinnedMessages.length === 0) return null;

  return (
    <div style={{ borderBottom: '1px solid #ccc', backgroundColor: '#fcfcfc', padding: '0.5rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          📌 <strong>Pinned Messages ({pinnedMessages.length})</strong>
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{ padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          {isOpen ? 'Hide' : 'Show All'}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
          {pinnedMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: '0.5rem',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: '#555' }}>
                  <strong>{msg.senderUsername}</strong> -{' '}
                  {new Date(msg.pinnedAt || msg.createdAt).toLocaleString()}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '0.25rem' }}>{msg.content}</div>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => onUnpin(msg.id)}
                  style={{ padding: '0.2rem 0.4rem', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Unpin
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
