import React from 'react';
import { Member } from '../../../../types';

interface SidebarProps {
  members: Member[];
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ members, isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside
      style={{
        width: '260px',
        borderRight: '1px solid #ccc',
        height: '100%',
        overflowY: 'auto',
        padding: '1rem',
        backgroundColor: '#f9f9f9',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Members ({members.length})</h3>
        <button type="button" onClick={onClose} style={{ padding: '0.2rem 0.5rem', cursor: 'pointer' }} title="Close sidebar">
          Close
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {members.map((member) => (
          <li
            key={member.id}
            style={{
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <div>
              <strong>{member.username}</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: member.online ? 'green' : '#777' }}>
              ● {member.online ? 'Online' : member.lastSeen ? `Last seen ${new Date(member.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Offline'}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
