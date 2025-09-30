'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    login: '', // Меняем username на login (для нашего API)
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try{
        const response = await fetch('http://localhost:3001/api/auth/login',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData),
        });
        const data = await response.json();

        if(response.ok){
             setMessage('✅ Вход успешен!');
            console.log('Login successful:', data.user);
            //* Сохраняем токен в localStorage
            if(data.token){
                localStorage.setItem('auth-token',data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            //* Редирект на главную страницу через 1 секунду
            setTimeout(()=>{
                router.push('/')
            },1000);
        }else {
        setMessage(`❌ Ошибка: ${data.error || 'Неверные данные для входа'}`);
      }
    } catch (error) {
      setMessage('❌ Ошибка подключения к серверу');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
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

          {/* Сообщение об ошибке/успехе */}
          {message && (
            <div className={`mb-4 p-3 rounded text-sm ${
              message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Форма входа */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                name="login" // Меняем name на login
                type="text"
                required
                placeholder="Телефон, имя пользователя или эл. адрес"
                value={formData.login}
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
                disabled={loading || !formData.login || !formData.password}
              >
                {loading ? 'Вход...' : 'Войти'}
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