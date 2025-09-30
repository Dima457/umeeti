import { Controller, Post, Body, HttpStatus, HttpException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')                                                   //! ДЕКОРАТОР: Создает контроллер с базовым путем '/auth'
export class AuthController {                                         //! КЛАСС: Основной класс контроллера
    constructor(private readonly authService: AuthService) {}         //! ВНЕДРЕНИЕ ЗАВИСИМОСТИ: Инжектируем AuthService

    @Post('register')                                                 //! ДЕКОРАТОР: Обрабатывает POST /auth/register
    async register(@Body() registerDto: RegisterDto) {                //! МЕТОД: Асинхронный метод регистрации
        try {                                                         //! БЛОК: Начало обработки с try-catch
            return await this.authService.register(registerDto);      //! ВЫЗОВ СЕРВИСА: Вызов бизнес-логики
        } catch (error) {                                             //! ОБРАБОТКА ОШИБОК: Ловим исключения
            throw new HttpException(                                  //! ИСКЛЮЧЕНИЕ: Создаем структурированную ошибку
                error.response?.data || 'Registration failed',        //! ДАННЫЕ: Берем из ошибки или default сообщение
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR, //! СТАТУС: Из ошибки или 500
            );
        }
    }

    @Post('login')                                                    //! ДЕКОРАТОР: Обрабатывает POST /auth/login
    async login(@Body() loginData: LoginDto) {                            
        try{
            return await this.authService.login(loginData);
        }catch(error){
            throw new HttpException(
                error.response?.data||'Login failed',
                error.response?.ststus||HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }                        
    }
}



//! @Controller('path') - ОСНОВНОЙ ДЕКОРАТОР КОНТРОЛЛЕРА
//? Назначает класс как контроллер NestJS
//? Определяет базовый путь для всех маршрутов в классе
//? Пример: @Controller('auth') = все пути начинаются с /auth

//! @Post('endpoint') - ДЕКОРАТОР HTTP МЕТОДА  
//? Определяет метод как обработчик POST запросов
//? Может принимать параметр пути (например: @Post('register'))
//? Соответствует HTTP методу POST

//! @Body() - ДЕКОРАТОР ПАРАМЕТРОВ ЗАПРОСА
//? Извлекает данные из тела HTTP запроса
//? Автоматически парсит JSON в объект JavaScript
//? Может использоваться с DTO для валидации

//! @Injectable() - ДЕКОРАТОР СЕРВИСА
//? Помечает класс как провайдер (сервис)
//? Позволяет использовать Dependency Injection
//? Класс может быть инжектирован в другие классы

//! PRIVATE READONLY - МОДИФИКАТОРЫ ДОСТУПА
//? private - доступ только внутри класса
//? readonly - значение нельзя изменить после инициализации
//? Обеспечивает инкапсуляцию и безопасность

//! CONSTRUCTOR INJECTION - ВНЕДРЕНИЕ ЧЕРЕЗ КОНСТРУКТОР
//? Самый распространенный способ DI в NestJS
//? Framework автоматически создает и инжектирует зависимости
//? Не требует ручного создания экземпляров