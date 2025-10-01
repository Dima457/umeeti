// app/chat/page.tsx
'use client'
import { useState } from 'react'
import ChatList from '../../components/chatList'
import ChatWindow from '../../components/chatWindow'
import Navbar from '@/components/navbar'

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
     
      
      <main className="flex h-[calc(100vh-140px)] pb-20">
        {/* Chat List */}
        <div className={`${
          selectedChat 
            ? 'hidden md:block md:w-1/3 lg:w-1/4' 
            : 'w-full md:w-1/3 lg:w-1/4'
        } border-r border-gray-200`}>
          <ChatList />
        </div>

        {/* Chat Window */}
        <div className={`${
          selectedChat 
            ? 'w-full md:w-2/3 lg:w-3/4' 
            : 'hidden md:block md:w-2/3 lg:w-3/4'
        }`}>
          <ChatWindow />
        </div>
      </main>

      <Navbar />
    </div>
  )
}