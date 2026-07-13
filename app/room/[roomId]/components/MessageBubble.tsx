import React from 'react';
import { Message } from '../../../../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showHeader: boolean;
  onEdit: (msg: Message) => void;
  onDelete: (msgId: string) => void;
  receiptStatus: string;
}

export default function MessageBubble({ message: msg, isOwn, showHeader, onEdit, onDelete, receiptStatus }: MessageBubbleProps) {
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
      {showHeader && (
        <span className="text-xs font-semibold text-gray-500 mb-1 ml-1 mr-1">
          {isOwn ? 'You' : msg.senderUsername}
        </span>
      )}
      <div className="group relative max-w-[85%] sm:max-w-[75%]">
        <div
          className={`px-4 py-2 rounded-2xl shadow-sm ${
            msg.isDeleted
              ? 'bg-gray-100 border border-gray-200 text-gray-500 italic rounded-bl-sm'
              : isOwn
                ? 'bg-primary-600 text-white rounded-br-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
          }`}
        >
          {msg.isDeleted ? (
            'This message was deleted'
          ) : (
            <div className="break-words leading-relaxed text-[15px] whitespace-pre-wrap">{msg.content}</div>
          )}
        </div>

        {/* Message Meta (Time, Edit, Delete, Status) */}
        <div className={`flex items-center mt-1 space-x-2 text-[11px] font-medium text-gray-400 ${isOwn ? 'justify-end mr-1' : 'ml-1'}`}>
          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

          {msg.isEdited && !msg.isDeleted && <span className="italic">(edited)</span>}

          {isOwn && !msg.isDeleted && (
            <div className="hidden group-hover:flex items-center space-x-2">
              <span className="text-gray-300">•</span>
              <button onClick={() => onEdit(msg)} className="hover:text-primary-600 transition-colors cursor-pointer">Edit</button>
              <span className="text-gray-300">•</span>
              <button onClick={() => onDelete(msg.id)} className="hover:text-red-500 transition-colors cursor-pointer">Delete</button>
            </div>
          )}

          {isOwn && !msg.isDeleted && (
            <>
              <span className="text-gray-300 group-hover:hidden">•</span>
              <span className={`group-hover:hidden ${receiptStatus === 'Seen' ? 'text-primary-500 font-bold' : ''}`}>
                {receiptStatus === 'Sent' && '✓'}
                {receiptStatus === 'Delivered' && '✓✓'}
                {receiptStatus === 'Seen' && '✓✓'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
