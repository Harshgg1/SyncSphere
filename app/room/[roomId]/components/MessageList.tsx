import React from 'react';
import { Message } from '../../../../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  hasMore: boolean;
  loadingMore: boolean;
  isSearching: boolean;
  searchQuery: string;
  onLoadMore: () => void;
  onEdit: (msg: Message) => void;
  onDelete: (msgId: string) => void;
  getReceiptStatus: (msg: Message) => string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({
  messages,
  currentUserId,
  hasMore,
  loadingMore,
  isSearching,
  searchQuery,
  onLoadMore,
  onEdit,
  onDelete,
  getReceiptStatus,
  messagesEndRef,
  messagesContainerRef,
}: MessageListProps) {
  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] bg-gray-50"
    >
      <div className="max-w-3xl mx-auto flex flex-col justify-end min-h-full">

        {hasMore && !isSearching && (
          <div className="text-center my-4">
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="bg-white border border-gray-200 text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              {loadingMore ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : 'Load Older Messages'}
            </button>
          </div>
        )}

        {isSearching && (
          <div className="bg-yellow-50 text-yellow-800 p-3 rounded-xl text-center text-sm font-medium border border-yellow-200 mb-6 shadow-sm mx-auto max-w-sm">
            Search results for: <span className="font-bold">&quot;{searchQuery}&quot;</span>
          </div>
        )}

        <div className="space-y-5">
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
                showHeader={showHeader}
                onEdit={onEdit}
                onDelete={onDelete}
                receiptStatus={isOwn ? getReceiptStatus(msg) : 'Sent'}
              />
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
