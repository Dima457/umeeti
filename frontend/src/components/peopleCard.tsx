// components/PeopleCard.tsx
'use client'

import { useState } from 'react'

interface PeopleCardProps {
  name: string
  age: number
  distance: string
  bio: string
  mutualFriends: number
}

export default function PeopleCard({ 
  name, 
  age, 
  distance, 
  bio, 
  mutualFriends 
}: PeopleCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const handleLike = () => {
    setIsLiked(true)
    // Здесь будет логика для like
  }

  const handleDislike = () => {
    setIsDisliked(true)
    // Здесь будет логика для dislike
  }

  if (isLiked || isDisliked) return null

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto">
      {/* Photo/Image Area */}
      <div className="relative h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
        {/* User Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">{name}, {age}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
                <span className="text-sm">{distance} away</span>
              </div>
              {mutualFriends > 0 && (
                <div className="text-sm opacity-90 mt-1">
                  {mutualFriends} друзья
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Indicators */}
        <div className={`absolute top-4 right-4 p-2 rounded-full border-2 ${
          isLiked ? 'bg-green-500 border-green-500' : 
          isDisliked ? 'bg-red-500 border-red-500' : 'hidden'
        }`}>
          {isLiked && <span className="text-white text-xl">✓</span>}
          {isDisliked && <span className="text-white text-xl">✕</span>}
        </div>
      </div>

      {/* Bio Section */}
      <div className="p-4">
        <p className="text-gray-600 text-sm line-clamp-2">{bio}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
           путешествие
          </span>
          <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs">
            фотография
          </span>
          <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
            коффе
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between p-4 border-t border-gray-100">
        <button 
          onClick={handleDislike}
          className="w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>

        <button 
          onClick={handleLike}
          className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}