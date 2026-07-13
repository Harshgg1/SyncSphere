import React from 'react';
import { Member } from '../../../../types';

interface SidebarProps {
  members: Member[];
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ members, isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center h-16">
            <h2 className="font-bold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Members <span className="ml-2 text-xs font-bold bg-primary-100 text-primary-700 py-0.5 px-2 rounded-full">{members.length}</span>
            </h2>
            <button className="md:hidden text-gray-400 hover:text-gray-600 cursor-pointer" onClick={onClose}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {members.map((member) => (
              <div key={member.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${member.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{member.username}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {member.online ? 'Online' : member.lastSeen ? `Last seen ${new Date(member.lastSeen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
