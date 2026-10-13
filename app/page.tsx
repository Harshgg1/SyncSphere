'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Room } from '../types';
import { toast } from 'sonner';

export default function HomePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchRooms();
    }
  }, [token]);

  async function fetchRooms() {
    try {
      const res = await fetch('/api/rooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const rawRooms = Array.isArray(data) ? data : data.rooms || [];
        setRooms(
          rawRooms.map((r: any) => ({
            id: r.id,
            name: r.name,
            memberCount: r._count?.members || r.memberCount || 0,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    }
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || data.message || 'Authentication failed');
        setIsSubmitting(false);
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setUsername('');
      setPassword('');
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully');
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setRooms([]);
    toast.info('Logged out securely');
  }

  async function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRoomName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || data.message || 'Failed to create room');
        return;
      }
      setNewRoomName('');
      fetchRooms();
      toast.success('Room created successfully');
    } catch (err) {
      toast.error('Network error while creating room');
    }
  }

  async function handleJoinRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!joinRoomId.trim()) return;
    try {
      const res = await fetch(`/api/rooms/${joinRoomId.trim()}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || data.message || 'Failed to join room');
        return;
      }
      setJoinRoomId('');
      fetchRooms();
      toast.success('Joined room successfully');
    } catch (err) {
      toast.error('Network error while joining room');
    }
  }

  if (!token) {
    return (
      <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '1rem' }}>
        <h1>SyncSphere</h1>
        <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>

        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !username || !password}
            style={{ width: '100%', padding: '0.5rem', cursor: 'pointer' }}
          >
            {isSubmitting ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setUsername('');
              setPassword('');
            }}
            style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>SyncSphere</h1>
          <p style={{ margin: '0.25rem 0 0 0' }}>Logged in as: <strong>{user?.username}</strong></p>
        </div>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      <main>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <section style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <h3>Create Room</h3>
            <form onSubmit={handleCreateRoom}>
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. Engineering Team"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <button type="submit" disabled={!newRoomName.trim()} style={{ width: '100%', padding: '0.5rem', cursor: 'pointer' }}>
                Create Room
              </button>
            </form>
          </section>

          <section style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <h3>Join Room</h3>
            <form onSubmit={handleJoinRoom}>
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Paste Room ID here"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <button type="submit" disabled={!joinRoomId.trim()} style={{ width: '100%', padding: '0.5rem', cursor: 'pointer' }}>
                Join Room
              </button>
            </form>
          </section>
        </div>

        <section style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h3>Your Rooms ({rooms.length})</h3>

          {rooms.length === 0 ? (
            <p>No active rooms. Create or join one to start messaging.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {rooms.map((room) => (
                <li
                  key={room.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <div>
                    <strong>{room.name}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      {room.memberCount || 1} members | ID: <code>{room.id}</code>{' '}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(room.id);
                          setCopiedId(room.id);
                          toast.success('Room ID copied to clipboard');
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {copiedId === room.id ? 'Copied!' : 'Copy ID'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => router.push(`/room/${room.id}`)}
                      style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                    >
                      Open
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}