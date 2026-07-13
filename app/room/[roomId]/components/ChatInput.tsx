import React from 'react';

interface ChatInputProps {
  inputValue: string;
  editingMessageId: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
}

export default function ChatInput({ inputValue, editingMessageId, onInputChange, onSend, onCancelEdit }: ChatInputProps) {
  return (
    <div className="bg-white border-t border-gray-200 p-3 sm:p-4 z-10">
      {editingMessageId && (
        <div className="flex items-center justify-between bg-primary-50 px-4 py-2 rounded-t-xl border-x border-t border-primary-100 text-sm">
          <span className="text-primary-700 font-medium flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Editing message
          </span>
          <button onClick={onCancelEdit} className="text-gray-500 hover:text-gray-800 cursor-pointer p-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <form onSubmit={onSend} className="max-w-3xl mx-auto flex items-end space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={onInputChange}
            placeholder="Type your message..."
            className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white outline-none transition-all shadow-sm ${editingMessageId ? 'rounded-b-xl rounded-t-none border-t-0' : 'rounded-2xl'}`}
          />
        </div>
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-2xl p-3 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer disabled:cursor-not-allowed h-12 w-12 flex-shrink-0"
        >
          {editingMessageId ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
