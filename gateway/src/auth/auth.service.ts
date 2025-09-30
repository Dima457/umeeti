import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()                                                         //! ДЕКОРАТОР: Позволяет инжектировать сервис как зависимость
export class AuthService {                                            //! КЛАСС: Сервис с бизнес-логикой
    constructor(private readonly httpService: HttpService) {}         //! ВНЕДРЕНИЕ: Инжектируем HttpService для HTTP-запросов

    private readonly REGISTER_SERVICE_URL = 'http://localhost:8081';
    private readonly LOGIN_SERVICE_URL =  'http://localhost:8080/login';                                                          //! КОНСТАНТА: URL внешнего сервиса регистрации

    async register(registerDto: RegisterDto) {                        //! МЕТОД: Основная логика регистрации
        try {                                                         //! БЛОК: Обработка успешного запроса и ошибок
            const response = await firstValueFrom(                    //! ПРОМИСИФИКАЦИЯ: Преобразуем Observable в Promise
                this.httpService.post(                                //! HTTP ЗАПРОС: POST запрос к внешнему сервису
                    `${this.REGISTER_SERVICE_URL}/register`,          //! URL: Полный адрес эндпоинта
                    registerDto                                       //! ТЕЛО: Данные для регистрации
                )
            );
            return response.data;                                     //! ВОЗВРАТ: Возвращаем данные от внешнего сервиса
        } catch (error) {                                             //! ОБРАБОТКА ОШИБОК: Ловим ошибки HTTP-запроса
            if (error.response) {                                     //! УСЛОВИЕ: Если есть структурированный ответ
                throw new HttpException(                              //! ИСКЛЮЧЕНИЕ: Пробрасываем ошибку от внешнего сервиса
                    error.response.data, 
                    error.response.status
                );
            }
            throw new HttpException(                                  //! ИСКЛЮЧЕНИЕ: Сервис недоступен
                'Register service unavailable', 
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }
    async login(loginDto:LoginDto){
        try{
            const response = await firstValueFrom(
                this.httpService.post(`${this.LOGIN_SERVICE_URL}`,loginDto)
            );
            return response.data;
        }catch(error){
            if (error.response){
                throw new HttpException(error.response.data, error.response.ststus);
            }
            throw new HttpException('Login service unavaliable', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}

//! constructor() - КОНСТРУКТОР КЛАССА
//? Специальный метод для инициализации объектов
//? В NestJS используется для Dependency Injection
//? Пример: constructor(private service: Service) {}

//! async/await - АСИНХРОННОЕ ПРОГРАММИРОВАНИЕ
//? async - объявляет асинхронную функцию
//? await - ожидает выполнение Promise
//? Позволяет писать неблокирующий код

//! firstValueFrom() - ПРЕОБРАЗОВАНИЕ OBSERVABLE
//? Преобразует RxJS Observable в Promise
//? Позволяет использовать async/await с Observable
//? Из библиотеки 'rxjs'

//! 🔄 OBSERVABLE - ЛЕНИВЫЙ ПОТОК ДАННЫХ
//? 📍 Не выполняется до активации (подписки)
//? 📍 Может испускать множество значений
//? 📍 Работает с событиями во времени
//? 📍 Можно отменить в любой момент

//! 🔔 ПОДПИСКА (SUBSCRIPTION) - АКТИВАЦИЯ ПОТОКА
//? 📍 Запускает выполнение Observable
//? 📍 Без подписки Observable "спит"
//? 📍 С подпиской Observable "просыпается"
//? 📍 Можно отписаться чтобы остановить

//! Observable - ЭТО ПОТОК ДАННЫХ
//? Представляет ленивую коллекцию значений over time
//? Может испускать multiple values (множество значений)
//? Асинхронный и может работать с событиями, HTTP запросами и т.д.

//! HttpException() - КЛАСС ИСКЛЮЧЕНИЙ
//? Создает структурированные HTTP ошибки
//? Принимает сообщение и статус код
//? Автоматически обрабатывается NestJS Exception Filter

//! HttpStatus - ПЕРЕЧИСЛЕНИЕ HTTP СТАТУСОВ
//? Содержит константы HTTP статус кодов
//? Пример: HttpStatus.OK (200), HttpStatus.NOT_FOUND (404)
//? Упрощает чтение кода

//! HttpService - СЕРВИС HTTP ЗАПРОСОВ
//? Обертка над axios для выполнения HTTP запросов
//? Возвращает Observable (RxJS)
//? Из модуля @nestjs/axios

//! RegisterDto - DATA TRANSFER OBJECT (DTO)
//? Объект для передачи данных между слоями
//? Обычно используется для валидации входящих данных
//? Определяет структуру ожидаемых данных


//! СТАТУС КОДЫ ОШИБОК:
//? HttpStatus.INTERNAL_SERVER_ERROR (500) - Внутренняя ошибка сервера
//? HttpStatus.SERVICE_UNAVAILABLE (503) - Сервис недоступен
//? HttpStatus.BAD_REQUEST (400) - Неверный запрос

