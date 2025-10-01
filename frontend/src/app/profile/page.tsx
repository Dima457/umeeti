// components/Profile.tsx
export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Баннер профиля */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-400"></div>
        
        {/* Аватар */}
        <div className="absolute -bottom-16 left-6">
          <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Информация профиля */}
      <div className="pt-20 px-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Username</h1>
            <p className="text-gray-500">@username</p>
            <p className="mt-2 text-gray-600">Ваше описание профиля...</p>
          </div>
          
          {/* Кнопка настроек */}
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Статистика */}
        <div className="flex space-x-6 mb-6 text-center">
          <div>
            <div className="font-bold">125</div>
            <div className="text-gray-500 text-sm">Posts</div>
          </div>
          <div>
            <div className="font-bold">1.2K</div>
            <div className="text-gray-500 text-sm">Followers</div>
          </div>
          <div>
            <div className="font-bold">456</div>
            <div className="text-gray-500 text-sm">Following</div>
          </div>
        </div>

        {/* Кнопка создания поста */}
        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium mb-4 opacity-50 cursor-not-allowed">
          Выложить пост
        </button>

        {/* Место для будущих постов */}
        <div className="grid grid-cols-3 gap-1 mt-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">+</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}