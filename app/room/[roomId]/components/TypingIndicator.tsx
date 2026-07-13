import React from 'react';

interface TypingIndicatorProps {
  typingUsers: Map<string, string>;
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  return (
    <div className="px-4 py-1 bg-gray-50 absolute bottom-20 left-0 text-xs font-medium text-gray-500 italic h-6 flex items-center">
      {typingUsers.size > 0 && (
        <span className="flex items-center">
          <span className="flex space-x-1 mr-2">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </span>
          {Array.from(typingUsers.values()).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing
        </span>
      )}
    </div>
  );
}
