package main

import(
    "context"
    "fmt"
    "log"
    "net/http"
    "os"
    "regexp"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/jackc/pgx/v5/pgxpool"
    "github.com/joho/godotenv"
    "golang.org/x/crypto/bcrypt"
)

//!  ГЛОБАЛЬНАЯ ПЕРЕМЕННАЯ: Путь соединений с БД (видна во всем package)
var db *pgxpool.Pool

//! STRUCT: Модель данных для регистрации
type RegisterRequest struct {
    Phone           string `json:"phone" binding:"required"`           //!  Телефон (обязательный)
    Email           string `json:"email" binding:"required,email"`     //!  Email (обязательный + валидация)
    FullName        string `json:"full_name" binding:"required"`       //!  Полное имя (обязательный)
    Username        string `json:"username" binding:"required"`        //!  Юзернейм (обязательный)
    Password        string `json:"password" binding:"required,min=6"`  //!  Пароль (мин. 6 символов)
    PasswordConfirm string `json:"password_confirm" binding:"required"`//!  Подтверждение пароля
}

//! STRUCT: Модель ответа пользователя (без пароля)
type UserResponse struct {
    ID       int    `json:"id"`
    Phone    string `json:"phone"`
    Email    string `json:"email"`
    Username string `json:"username"`
    FullName string `json:"full_name"`
}

func main(){
    //! ЗАГРУЗКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ из .env файла
    godotenv.Load()
    
    //!  ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ
    connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
        os.Getenv("DB_USER"),      //!  Пользователь БД
        os.Getenv("DB_PASSWORD"),  //!  Пароль БД  
        os.Getenv("DB_HOST"),      //!   Хост БД
        os.Getenv("DB_PORT"),      //!  Порт БД
        os.Getenv("DB_NAME"),      //!  Имя базы данных
    )
    
    var err error
    //!  СОЗДАНИЕ ПУЛА СОЕДИНЕНИЙ С БД
    db, err = pgxpool.New(context.Background(), connStr)
    if err != nil {
        log.Fatal("Failed to connect to database", err)  //!  Критическая ошибка подключения
    }
    defer db.Close()  //! Закрытие соединения при завершении программы

    //!  ПРОВЕРКА ПОДКЛЮЧЕНИЯ К БД
    err = db.Ping(context.Background())
    if err != nil {
        log.Fatal("database ping failed", err)  //!  БД недоступна
    }
    fmt.Println("register service connected to database!")  //! Успешное подключение

    //!  СОЗДАНИЕ GIN ROUTER
    r := gin.Default()

    //!  CORS MIDDLEWARE (разрешение кросс-доменных запросов)
    r.Use(func(c *gin.Context){
        c.Header("Access-Control-Allow-Origin", "*")                    //!  Разрешить все домены
        c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")  //!  Разрешенные методы
        c.Header("Access-Control-Allow-Headers", "Content-Type")        //!  Разрешенные заголовки

        if c.Request.Method == "OPTIONS" {  //!  Предварительный CORS запрос
            c.AbortWithStatus(204)          //!  Успешно, нет контента
            return
        }
        c.Next()  //!  Передать управление следующему обработчику
    })

    //!  РЕГИСТРАЦИЯ МАРШРУТОВ
    r.POST("/register", registerHandler)  //!  Регистрация пользователя
    r.GET("/health", healthHandler)       //!  Проверка здоровья сервиса

    //!  НАСТРОЙКА ПОРТА СЕРВЕРА
    port := os.Getenv("PORT")
    if port == "" {  
        port = "8081" //!  Порт по умолчанию
    }
    log.Printf("Register service running on port %s", port)
    r.Run(":" + port)  //!  ЗАПУСК СЕРВЕРА
}

//!  ОБРАБОТЧИК РЕГИСТРАЦИИ
func registerHandler(c *gin.Context){
    var req RegisterRequest  //!  Создание экземпляра структуры запроса

    //!  ВАЛИДАЦИЯ ВХОДЯЩИХ ДАННЫХ (Gin binding)
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error":   "Validation failed",
            "details": err.Error(),  //!  Детали ошибки валидации
        })
        return
    }
	//!  ДОПОЛНИТЕЛЬНАЯ ВАЛИДАЦИЯ (кастомная логика)
    if err := validateRegistration(req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }
    
    //!  ПРОВЕРКА УНИКАЛЬНОСТИ ДАННЫХ В БД
    if err := checkUniqueFields(req); err != nil {
        c.JSON(http.StatusConflict, gin.H{  //!  409 Conflict - данные уже существуют
            "error": err.Error(),
        })
        return
    }
    
    //!  ХЕШИРОВАНИЕ ПАРОЛЯ
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to process password",
        })
        return
    }
    
    //! СОХРАНЕНИЕ ПОЛЬЗОВАТЕЛЯ В БАЗЕ ДАННЫХ
    var userID int 
    err = db.QueryRow(context.Background(),
        `INSERT INTO users (phone, email, username, full_name, password_hash) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`, 
        req.Phone, req.Email, req.Username, req.FullName, string(hashedPassword),
    ).Scan(&userID)    
    if err != nil {
        log.Printf("Database error %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to create user",
        })
        return
    }
    
    //!  УСПЕШНЫЙ ОТВЕТ
    response := UserResponse{
        ID:       userID,
        Phone:    req.Phone,
        Email:    req.Email,
        Username: req.Username,
        FullName: req.FullName,
    }
    c.JSON(http.StatusCreated, gin.H{  //!  201 Created
        "message": "User registered successfully",
        "user":    response,
    })
}

//!  ФУНКЦИЯ ВАЛИДАЦИИ РЕГИСТРАЦИОННЫХ ДАННЫХ
func validateRegistration(req RegisterRequest) error{
    //!  ПРОВЕРКА СОВПАДЕНИЯ ПАРОЛЕЙ
    if req.Password != req.PasswordConfirm {
        return fmt.Errorf("password do not match")  //!  ОШИБКА: должно быть "do not" → "do not"
    }

    //! 📞 ВАЛИДАЦИЯ ТЕЛЕФОНА (русский формат)
    phoneRegex := regexp.MustCompile(`^\+7\d{10}$`)
    if !phoneRegex.MatchString(req.Phone) {
        return fmt.Errorf("phone must be in format +7XXXXXXXXXX")
    }
    
    //!  ВАЛИДАЦИЯ USERNAME (только буквы, цифры, подчеркивание)
    usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
    if !usernameRegex.MatchString(req.Username) {
        return fmt.Errorf("username can only contain letters, numbers and underscores")
    }
    
    //!  ВАЛИДАЦИЯ ФИО (минимум имя и фамилия)
    nameParts := strings.Split(strings.TrimSpace(req.FullName), " ")
    if len(nameParts) < 2 {
        return fmt.Errorf("full name must contain at least first and last name")
    }
    return nil
}

//!  ПРОВЕРКА УНИКАЛЬНОСТИ ПОЛЕЙ В БАЗЕ ДАННЫХ
func checkUniqueFields(req RegisterRequest) error {
    var exists bool  //!  ЛОКАЛЬНАЯ ПЕРЕМЕННАЯ: флаг существования записи

    //!  ПРОВЕРКА ТЕЛЕФОНА
    err := db.QueryRow(context.Background(),
        "SELECT EXISTS(SELECT 1 FROM users WHERE phone = $1)", 
        req.Phone).Scan(&exists)
    if err != nil {
        return fmt.Errorf("database error")
    }
    if exists {
        return fmt.Errorf("phone already registered")
    }
    
    //! ПРОВЕРКА ПОЧТЫ
    err = db.QueryRow(context.Background(),
        "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
        req.Email).Scan(&exists)
    if err != nil {
        return fmt.Errorf("database error")
    }
    if exists {
        return fmt.Errorf("email already registered")
    }   
    
    //!  ПРОВЕРКА USERNAME
    err = db.QueryRow(context.Background(),
        "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)",
        req.Username).Scan(&exists)  //! 🐛 ОШИБКА: Должно быть req.Username, а не req.Email
    if err != nil {
        return fmt.Errorf("database error")
    }
    if exists {
        return fmt.Errorf("username already registered")
    }   
    return nil
}
//*  HANDLER ПРОВЕРКИ ЗДОРОВЬЯ СЕРВИСА
func healthHandler(c *gin.Context){
    c.JSON(http.StatusOK, gin.H{
        "status":  "ok",
        "service": "register-service",
    })
}


//! 🏗️  СТРУКТУРЫ (STRUCTS):
//? type Name struct { Field Type tag } - модель данных
//? binding:"required" - обязательное поле (Gin валидация)
//? json:"field" - название поля в JSON

//! 🌐 HTTP HANDLERS:
//? c.JSON(status, data) - отправка JSON ответа
//? c.ShouldBindJSON() - парсинг JSON в структуру
//? http.StatusBadRequest - HTTP статус 400

//! 🗄️  РАБОТА С БАЗОЙ ДАННЫХ:
//? pgxpool.New() - создание пула соединений
//? db.QueryRow().Scan() - выполнение запроса и сканирование результата
//? db.Ping() - проверка соединения с БД

//! 🔐 БЕЗОПАСНОСТЬ:
//? bcrypt.GenerateFromPassword() - хеширование пароля
//? regexp.MustCompile() - компиляция регулярных выражений

//! ⚙️  MIDDLEWARE:
//? r.Use() - регистрация middleware
//? CORS - Cross-Origin Resource Sharing
//? c.Next() - передача управления следующему обработчику

//! 🏷️ PACKAGE MAIN - ОСНОВНОЙ ПАКЕТ:
//? package - объявляет пакет
//? main - специальное имя для исполняемых программ

//! 📥 IMPORT - ИМПОРТ ПАКЕТОВ:
//? import - ключевое слово для импорта
//? () - группировка нескольких импортов

//! 🎯 СТАНДАРТНЫЕ ПАКЕТЫ:
//? "context" - Context (тип для управления временем жизни)
//? "fmt" - Format (функции форматированного ввода-вывода)
//? "log" - Log (функции логирования)
//? "net/http" - HTTP (протокол передачи данных)
//? "os" - Operating System (взаимодействие с ОС)
//? "regexp" - Regular Expressions (регулярные выражения)
//? "strings" - Strings (функции для работы со строками)

//! 🎯 ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ:
//? var - объявление переменной
//? db - имя переменной
//? * - оператор указателя
//? pgxpool.Pool - тип данных (пул соединений)

//! 🏷️ STRUCT - СТРУКТУРЫ ДАННЫХ:
//? type - объявление типа
//? struct - составной тип данных
//? string - тип данных строка
//? json:"..." - теги для JSON маршалинга
//? binding:"..." - теги валидации Gin

//! 🎯 MAIN FUNCTION:
//? func - объявление функции
//? main() - точка входа программы

//! 🔧 ENVIRONMENT:
//? godotenv.Load() - функция загрузки .env файла

//! 🗄️ DATABASE CONNECTION:
//? fmt.Sprintf() - функция форматирования строк
//? os.Getenv() - функция получения переменной окружения
//? pgxpool.New() - конструктор пула соединений
//? context.Background() - создание корневого контекста
//? log.Fatal() - функция логирования с выходом
//? defer - отложенное выполнение
//? db.Close() - метод закрытия соединения
//? db.Ping() - метод проверки соединения

//! 🌐 GIN ROUTER:
//? gin.Default() - создание роутера с middleware по умолчанию
//? r.Use() - метод добавления middleware
//? gin.Context - тип контекста запроса

//! 🎯 CORS MIDDLEWARE:
//? c.Header() - метод установки HTTP заголовка
//? c.Request.Method - поле метода запроса
//? c.AbortWithStatus() - метод завершения с статусом
//? c.Next() - метод передачи следующему обработчику

//! 🛣️ ROUTES:
//? r.POST() - метод регистрации POST маршрута
//? r.GET() - метод регистрации GET маршрута
//? r.Run() - метод запуска сервера

//! 🎯 HANDLER FUNCTION:
//? registerHandler - имя функции-обработчика
//? c.ShouldBindJSON() - метод парсинга JSON в структуру
//? c.JSON() - метод отправки JSON ответа
//? http.StatusBadRequest - константа HTTP статуса

//! 🔐 PASSWORD HASHING:
//? bcrypt.GenerateFromPassword() - функция хеширования пароля
//? []byte() - преобразование строки в байты
//? bcrypt.DefaultCost - константа сложности хеширования

//! 💾 DATABASE OPERATIONS:
//? db.QueryRow() - метод выполнения SQL запроса
//? .Scan() - метод сканирования результата в переменные
//? context.Background() - базовый контекст

//! 🎯 VALIDATION:
//? validateRegistration - функция валидации
//? fmt.Errorf() - функция создания ошибки
//? regexp.MustCompile() - компиляция регулярного выражения
//? .MatchString() - метод проверки соответствия регулярке
//? strings.Split() - функция разделения строки
//? strings.TrimSpace() - функция обрезки пробелов
//? len() - встроенная функция длины

//! 🔎 UNIQUE CHECK:
//? checkUniqueFields - функция проверки уникальности
//? db.QueryRow() - SQL запрос
//? .Scan() - сканирование результата
//? EXISTS() - SQL функция проверки существования

//! 🎯 HEALTH HANDLER:
//? healthHandler - функция проверки здоровья
//? c.JSON() - отправка JSON ответа
//? http.StatusOK - константа статуса 200
//? gin.H{} - сокращение для map[string]interface{}

