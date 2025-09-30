'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register attempt:', formData);
    // Здесь будет логика регистрации
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-300">
          {/* Логотип */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Instagram
            </h1>
            <p className="text-gray-600 mt-2 text-sm">Зарегистрируйтесь, чтобы смотреть фото и видео ваших друзей.</p>
          </div>

          {/* Форма регистрации */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <input
                name="email"
                type="email"
                required
                placeholder="Эл. адрес"
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
              />
            </div>

            <div>
              <input
                name="fullName"
                type="text"
                required
                placeholder="Имя и фамилия"
                value={formData.fullName}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
              />
            </div>

            <div>
              <input
                name="username"
                type="text"
                required
                placeholder="Имя пользователя"
                value={formData.username}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
              />
            </div>

            <div>
              <input
                name="password"
                type="password"
                required
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
              />
            </div>

            <div className="text-xs text-gray-500 text-center pt-2">
              <p>Регистрируясь, вы принимаете наши Условия, Политику конфиденциальности и Политику в отношении файлов cookie.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!formData.email || !formData.fullName || !formData.username || !formData.password}
              >
                Регистрация
              </button>
            </div>
          </form>
        </div>

        {/* Вход */}
        <div className="bg-white py-4 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-300 mt-4 text-center">
          <p className="text-sm text-gray-700">
            Есть аккаунт?{' '}
            <Link href="/login" className="font-medium text-blue-500 hover:text-blue-600">
              Вход
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}