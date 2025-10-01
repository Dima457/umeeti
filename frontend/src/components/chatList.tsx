// components/ChatList.tsx
'use client'

import { useState } from 'react'

export default function ChatList() {
  const [chats, setChats] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="bg-white h-full overflow-y-auto">
      {/* Search Bar */}
      <div  className="p-4 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-full px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {chats.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
          <p className="text-gray-500 text-sm">Start a conversation to see your chats here</p>
        </div>
      )}

      {/* Chat List - будет заполняться при появлении чатов */}
      <div className="divide-y divide-gray-100">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Chat Info */}
            <div className="flex-1 ml-3 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 truncate">User Name</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap">Time</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 truncate">Last message preview...</p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                  1
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}