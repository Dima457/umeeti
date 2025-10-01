// components/Navbar.tsx
'use client'

import { useState } from 'react'

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('home')

  const tabs = [
    { id: 'home', label: 'Главная', icon: '🏠' },
    { id: 'friends', label: 'Друзья', icon: '👥' },
    { id: 'chat', label: 'Чат', icon: '💬' },
    { id: 'profile', label: 'Профиль', icon: '👤' },
  ]

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 safe-area-bottom">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-6 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-purple-500'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="w-1 h-1 bg-purple-500 rounded-full mt-1"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}