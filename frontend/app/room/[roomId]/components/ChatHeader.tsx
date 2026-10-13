import React from 'react';
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  roomName: string;
  roomId: string;
  wsStatus: 'connecting' | 'connected' | 'disconnected';
  onToggleSidebar: () => void;
  onLeave: () => void;
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
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedId(roomId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <header
      style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{ padding: '0.35rem 0.6rem', cursor: 'pointer' }}
          title="Toggle Members List"
        >
          Members
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{roomName || roomId}</h2>
            <span
              style={{
                fontSize: '0.75rem',
                color: wsStatus === 'connected' ? 'green' : wsStatus === 'connecting' ? 'orange' : 'red',
              }}
            >
              ● {wsStatus}
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>
            ID: <code>{roomId}</code>{' '}
            <button
              type="button"
              onClick={handleCopy}
              style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', cursor: 'pointer' }}
            >
              {copiedId === roomId ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <form onSubmit={onSearch} style={{ display: 'flex', gap: '0.25rem' }}>
          <input
            type="text"
            placeholder="Search messages..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            style={{ padding: '0.35rem 0.5rem' }}
          />
          <button type="submit" style={{ padding: '0.35rem 0.6rem', cursor: 'pointer' }}>
            Search
          </button>
          {isSearching && (
            <button
              type="button"
              onClick={onClearSearch}
              style={{ padding: '0.35rem 0.6rem', cursor: 'pointer' }}
            >
              Clear
            </button>
          )}
        </form>

        <button
          type="button"
          onClick={() => router.push('/')}
          style={{ padding: '0.35rem 0.6rem', cursor: 'pointer' }}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={onLeave}
          style={{ padding: '0.35rem 0.6rem', cursor: 'pointer', color: 'red' }}
        >
          Leave
        </button>
      </div>
    </header>
  );
}
