import React from 'react';
import { Message } from '../../../../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isAdmin: boolean;
  showHeader: boolean;
  onEdit: (msg: Message) => void;
  onDelete: (msgId: string) => void;
  onPin: (msgId: string) => void;
  onUnpin: (msgId: string) => void;
  receiptStatus: string;
}

export default function MessageBubble({
  message: msg,
  isOwn,
  isAdmin,
  showHeader,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  receiptStatus,
}: MessageBubbleProps) {
  const canEdit = isOwn && !msg.isDeleted;
  const canDelete = (isOwn || isAdmin) && !msg.isDeleted;
  const canPin = isAdmin && !msg.isDeleted;
  const showActions = canEdit || canDelete || canPin;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: '0.5rem',
      }}
    >
      {showHeader && (
        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.2rem' }}>
          {msg.isPinned && '📌 '}
          <strong>{isOwn ? 'You' : msg.senderUsername}</strong>
        </div>
      )}
      {!showHeader && msg.isPinned && (
        <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '0.1rem' }}>📌 Pinned</div>
      )}

      <div
        style={{
          maxWidth: '75%',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '0.5rem 0.75rem',
          backgroundColor: msg.isDeleted ? '#f5f5f5' : isOwn ? '#e8f4fd' : '#ffffff',
        }}
      >
        {msg.isDeleted ? (
          <em style={{ color: '#888' }}>This message was deleted</em>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</div>
        )}

        <div
          style={{
            fontSize: '0.75rem',
            color: '#777',
            marginTop: '0.35rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: isOwn ? 'flex-end' : 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <span>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {msg.isEdited && !msg.isDeleted && <span>(edited)</span>}

          {isOwn && !msg.isDeleted && <span>✓ {receiptStatus}</span>}

          {showActions && (
            <span style={{ display: 'inline-flex', gap: '0.35rem', marginLeft: '0.25rem' }}>
              {canPin && (
                <button
                  type="button"
                  onClick={() => (msg.isPinned ? onUnpin(msg.id) : onPin(msg.id))}
                  style={{ fontSize: '0.7rem', cursor: 'pointer', padding: '0.1rem 0.3rem' }}
                >
                  {msg.isPinned ? 'Unpin' : 'Pin'}
                </button>
              )}
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(msg)}
                  style={{ fontSize: '0.7rem', cursor: 'pointer', padding: '0.1rem 0.3rem' }}
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(msg.id)}
                  style={{ fontSize: '0.7rem', cursor: 'pointer', padding: '0.1rem 0.3rem', color: 'red' }}
                >
                  Delete
                </button>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
