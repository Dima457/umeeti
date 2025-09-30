import { Module } from '@nestjs/common';                              //! ИСПРАВЛЕНО: Было 'module', теперь '@nestjs/common'
import { HttpModule } from '@nestjs/axios';                           //! ИМПОРТ: Модуль для HTTP-запросов
import { AuthService } from "./auth.service";                         //! ИМПОРТ: Наш сервис
import { AuthController } from "./auth.controller";                   //! ИМПОРТ: Наш контроллер

@Module({                                                             //! ДЕКОРАТОР: Определяет модуль приложения
    imports: [HttpModule],                                            //! ИМПОРТЫ: Регистрируем HttpModule
    controllers: [AuthController],                                    //! КОНТРОЛЛЕРЫ: Регистрируем контроллер
    providers: [AuthService],                                         
})
export class AuthModule {}                                            //! ЭКСПОРТ: Экспортируем модуль



//! AuthController - КЛАСС КОНТРОЛЛЕРА
//? Обрабатывает входящие HTTP запросы
//? Содержит методы-обработчики маршрутов
//? Возвращает responses клиенту

//! AuthService - КЛАСС СЕРВИСА (БИЗНЕС-ЛОГИКА)
//? Содержит основную бизнес-логику приложения
//? Выполняет сложные операции, работа с данными
//? Может вызывать другие сервисы или внешние API

//! AuthModule - КЛАСС МОДУЛЯ
//? Организует структуру функционального модуля
//? Регистрирует контроллеры и провайдеры
//? Может импортировать другие модули