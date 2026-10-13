import React from 'react';
import { Message } from '../../../../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isAdmin: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  isSearching: boolean;
  searchQuery: string;
  onLoadMore: () => void;
  onEdit: (msg: Message) => void;
  onDelete: (msgId: string) => void;
  onPin: (msgId: string) => void;
  onUnpin: (msgId: string) => void;
  getReceiptStatus: (msg: Message) => string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({
  messages,
  currentUserId,
  isAdmin,
  hasMore,
  loadingMore,
  isSearching,
  searchQuery,
  onLoadMore,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  getReceiptStatus,
  messagesEndRef,
  messagesContainerRef,
}: MessageListProps) {
  return (
    <div
      ref={messagesContainerRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {hasMore && !isSearching && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}
          >
            {loadingMore ? 'Loading older messages...' : 'Load Older Messages'}
          </button>
        </div>
      )}

      {isSearching && (
        <div style={{ padding: '0.5rem', backgroundColor: '#eef', marginBottom: '1rem', textAlign: 'center' }}>
          Search results for: <strong>&quot;{searchQuery}&quot;</strong>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
        {messages.map((msg, index) => {
          const isOwn = msg.senderId === currentUserId;
          const showHeader =
            index === 0 ||
            messages[index - 1].senderId !== msg.senderId ||
            new Date(msg.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 5 * 60 * 1000;

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={isOwn}
              isAdmin={isAdmin}
              showHeader={showHeader}
              onEdit={onEdit}
              onDelete={onDelete}
              onPin={onPin}
              onUnpin={onUnpin}
              receiptStatus={isOwn ? getReceiptStatus(msg) : 'Sent'}
            />
          );
        })}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}
