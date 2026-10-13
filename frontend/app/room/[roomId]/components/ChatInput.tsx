import React from 'react';

interface ChatInputProps {
  inputValue: string;
  editingMessageId: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
}

export default function ChatInput({
  inputValue,
  editingMessageId,
  onInputChange,
  onSend,
  onCancelEdit,
}: ChatInputProps) {
  return (
    <div style={{ borderTop: '1px solid #ccc', padding: '0.75rem 1rem', backgroundColor: '#fff' }}>
      {editingMessageId && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
          <span>Editing message...</span>
          <button type="button" onClick={onCancelEdit} style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
            Cancel edit
          </button>
        </div>
      )}
      <form onSubmit={onSend} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '0.6rem 0.8rem' }}
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          style={{ padding: '0.6rem 1.2rem', cursor: 'pointer' }}
        >
          {editingMessageId ? 'Update' : 'Send'}
        </button>
      </form>
    </div>
  );
}
