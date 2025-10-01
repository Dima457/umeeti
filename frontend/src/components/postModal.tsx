// components/PostModal.tsx
'use client'

import { useState } from 'react'

interface PostModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PostModal({ isOpen, onClose }: PostModalProps) {
  const [postText, setPostText] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <h2 className="text-lg font-semibold">Create Post</h2>
          <button 
            className={`font-semibold ${
              postText.trim() 
                ? 'text-purple-500 hover:text-purple-600' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={!postText.trim()}
          >
            Share
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center p-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <span className="text-lg">👤</span>
          </div>
          <div>
            <div className="font-semibold">Username</div>
            <div className="text-sm text-gray-500">Public</div>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-4">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-40 resize-none border-0 focus:outline-none text-lg placeholder-gray-400"
          />
        </div>

        {/* Add Media Options */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-gray-600">
            <span>добавить пост</span>
          </div>
          <div className="flex space-x-4 mt-3">
            <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  <path d="m22.7 13.3-2-2c-.2-.2-.4-.3-.7-.3s-.5.1-.7.3l-2 2c-.2.2-.3.4-.3.7s.1.5.3.7l2 2c.2.2.4.3.7.3s.5-.1.7-.3l2-2c.2-.2.3-.4.3-.7s-.1-.5-.3-.7z"/>
                </svg>
              </div>
              <span className="text-sm">фото/видео</span>
            </button>

            <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-sm">Feelings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}