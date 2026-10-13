'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useWebSocket } from './hooks/useWebSocket';
import { useRoomData } from './hooks/useRoomData';
import { useMessages } from './hooks/useMessages';
import { useTyping } from './hooks/useTyping';
import { usePinnedMessages } from './hooks/usePinnedMessages';

// Components
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import TypingIndicator from './components/TypingIndicator';
import ChatInput from './components/ChatInput';
import PinnedMessagesBanner from './components/PinnedMessagesBanner';

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  // Sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- Hooks ---
  const { token, currentUser } = useAuth();

  // WS message dispatcher ref — updated after all hooks are ready
  const onMessageRef = useRef<(data: any) => void>(() => {});

  const { wsRef, wsStatus, sendWsMessage } = useWebSocket(token, roomId, onMessageRef);
  const { roomName, members, adminId, handlePresence, handleLeave } = useRoomData(token, roomId);
  const {
    pinnedMessages, isPinnedOpen, setIsPinnedOpen, handlePinEvent,
  } = usePinnedMessages(token, roomId);

  const {
    messages, hasMore, loadingMore,
    inputValue, setInputValue, editingMessageId,
    handleSend, handleEdit, cancelEdit, handleDelete, loadMore,
    isSearching, searchQuery, searchInput, setSearchInput,
    handleSearch, clearSearch,
    handleNewMessage, handleEditMessage, handleDeleteMessage, handleReadReceipt,
    handlePinMessageEvent, handleUnpinMessageEvent, handlePin, handleUnpin,
    getReceiptStatus,
    messagesEndRef, messagesContainerRef,
  } = useMessages(token, roomId, currentUser, sendWsMessage, wsRef);

  const { typingUsers, emitTyping, stopTyping, handleTypingEvent } = useTyping(roomId, sendWsMessage, wsRef, currentUser);

  // Wire WS message dispatcher — always uses latest handler references
  useEffect(() => {
    onMessageRef.current = (data: any) => {
      switch (data.type) {
        case 'new_message':     handleNewMessage(data);   break;
        case 'typing':          handleTypingEvent(data);  break;
        case 'message_edited':  handleEditMessage(data);  break;
        case 'message_deleted': handleDeleteMessage(data); break;
        case 'message_pinned':
          handlePinMessageEvent(data);
          handlePinEvent(data);
          break;
        case 'message_unpinned':
          handleUnpinMessageEvent(data);
          handlePinEvent(data);
          break;
        case 'presence':        handlePresence(data);     break;
        case 'read_receipt':    handleReadReceipt(data);  break;
        case 'error':           console.error('WS error:', data.message); break;
        case 'rate_limited':    console.warn('Rate limited:', data.message); break;
      }
    };
  });

  // --- Orchestrated handlers ---
  function onSend(e: React.FormEvent) {
    handleSend(e);
    stopTyping();
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    emitTyping();
  }

  const isAdmin = currentUser?.id === adminId;

  // --- Loading state ---
  if (!token || !currentUser) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Sidebar - Members */}
      <Sidebar
        members={members}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', position: 'relative' }}>
        <ChatHeader
          roomName={roomName}
          roomId={roomId}
          wsStatus={wsStatus}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onLeave={handleLeave}
          searchInput={searchInput}
          isSearching={isSearching}
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
          onClearSearch={clearSearch}
        />

        <PinnedMessagesBanner
          pinnedMessages={pinnedMessages}
          isOpen={isPinnedOpen}
          setIsOpen={setIsPinnedOpen}
          isAdmin={isAdmin}
          onUnpin={handleUnpin}
        />

        <MessageList
          messages={messages}
          currentUserId={currentUser.id}
          isAdmin={isAdmin}
          hasMore={hasMore}
          loadingMore={loadingMore}
          isSearching={isSearching}
          searchQuery={searchQuery}
          onLoadMore={loadMore}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPin={handlePin}
          onUnpin={handleUnpin}
          getReceiptStatus={getReceiptStatus}
          messagesEndRef={messagesEndRef}
          messagesContainerRef={messagesContainerRef}
        />

        <TypingIndicator typingUsers={typingUsers} />

        <ChatInput
          inputValue={inputValue}
          editingMessageId={editingMessageId}
          onInputChange={onInputChange}
          onSend={onSend}
          onCancelEdit={cancelEdit}
        />
      </div>
    </div>
  );
}