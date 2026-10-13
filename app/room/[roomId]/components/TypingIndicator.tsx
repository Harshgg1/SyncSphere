import React from 'react';

interface TypingIndicatorProps {
  typingUsers: Map<string, string>;
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.size === 0) return null;

  return (
    <div style={{ padding: '0.25rem 1rem', fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>
      {Array.from(typingUsers.values()).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
    </div>
  );
}
