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