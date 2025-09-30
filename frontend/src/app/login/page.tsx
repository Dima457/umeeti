'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // Здесь будет логика входа
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
             Umeeti
            </h1>
          </div>

          {/* Форма входа */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                name="username"
                type="text"
                required
                placeholder="Телефон, имя пользователя или эл. адрес"
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

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!formData.username || !formData.password}
              >
                Войти
              </button>
            </div>
          </form>

          {/* Забыли пароль */}
          <div className="text-center mt-4">
            <a href="#" className="text-xs text-blue-900 hover:text-blue-700">
              Забыли пароль?
            </a>
          </div>
        </div>

        {/* Регистрация */}
        <div className="bg-white py-4 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-300 mt-4 text-center">
          <p className="text-sm text-gray-700">
            У вас ещё нет аккаунта?{' '}
            <Link href="/register" className="font-medium text-blue-500 hover:text-blue-600">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}