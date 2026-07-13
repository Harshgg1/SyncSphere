import React from 'react';
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  roomName: string;
  roomId: string;
  wsStatus: 'connecting' | 'connected' | 'disconnected';
  onToggleSidebar: () => void;
  onLeave: () => void;
  // Search
  searchInput: string;
  isSearching: boolean;
  onSearchInputChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClearSearch: () => void;
}

export default function ChatHeader({
  roomName,
  roomId,
  wsStatus,
  onToggleSidebar,
  onLeave,
  searchInput,
  isSearching,
  onSearchInputChange,
  onSearch,
  onClearSearch,
}: ChatHeaderProps) {
  const router = useRouter();

  return (
    <>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between h-16 shadow-sm z-10">
        <div className="flex items-center min-w-0">
          <button className="md:hidden mr-3 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={onToggleSidebar}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex flex-col min-w-0 mr-4">
            <h1 className="text-lg font-bold text-gray-900 truncate flex items-center">
              <span className="truncate">{roomName || roomId}</span>
              <span className={`ml-2 w-2 h-2 rounded-full ${wsStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : wsStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`} title={`WebSocket: ${wsStatus}`}></span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Desktop Search */}
          <form onSubmit={onSearch} className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              className="w-48 pl-9 pr-8 py-1.5 bg-gray-100 border-transparent rounded-full text-sm focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {isSearching && (
              <button type="button" onClick={onClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>
          <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer hidden sm:block" title="Back to Dashboard">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <button onClick={onLeave} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center border border-red-100 shadow-sm">
            <span className="hidden sm:inline">Leave</span>
            <svg className="w-4 h-4 sm:ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search — Below header, visible only on small screens */}
      <div className="sm:hidden px-4 py-2 border-b border-gray-200 bg-gray-50">
        <form onSubmit={onSearch} className="flex items-center relative w-full">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-white border border-gray-300 rounded-full text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {isSearching && (
            <button type="button" onClick={onClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>
      </div>
    </>
  );
}
