package main // Объявление пакета main - точка входа в программу

import ( // Импорт необходимых пакетов
	"context" // Для управления контекстом выполнения (таймауты, отмены)
	"fmt"     // Для форматированного ввода/вывода
	"log"     // Для логирования
	"os"      // Для работы с переменными окружения и ОС
	"time"

	"github.com/jackc/pgx/v5"  // Драйвер PostgreSQL для Go
	"github.com/joho/godotenv" // Для загрузки переменных окружения из .env файла
)

func main() {  // Главная функция программы
    time.Sleep(5 * time.Second)
 godotenv.Load()  // Загружаем переменные окружения из файла .env

 // Подключаемся к PostgreSQL
 connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/postgres",  // Формируем строку подключения
  os.Getenv("DB_USER"),      // Получаем имя пользователя БД из переменных окружения
  os.Getenv("DB_PASSWORD"),  // Получаем пароль БД из переменных окружения
  os.Getenv("DB_HOST"),      // Получаем хост БД из переменных окружения
  os.Getenv("DB_PORT"),      // Получаем порт БД из переменных окружения
 )

 conn, err := pgx.Connect(context.Background(), connStr)  // Устанавливаем соединение с PostgreSQL
 if err != nil {  // Проверяем на ошибку подключения
  log.Fatal("Failed to connect to PostgreSQL:", err)  // Логируем и завершаем программу при ошибке
 }
 defer conn.Close(context.Background())  // Отложенное закрытие соединения при выходе из функции

 // Создаем базу данных ЕСЛИ ЕЁ НЕТ
 dbName := os.Getenv("DB_NAME")  // Получаем имя базы данных из переменных окружения
 _, err = conn.Exec(context.Background(),   // Выполняем SQL запрос на создание БД
  fmt.Sprintf("CREATE DATABASE %s", dbName))  // Формируем SQL команду CREATE DATABASE
 
 if err != nil {  // Обрабатываем возможную ошибку
  log.Println("Database might already exist (this is OK):", err)  // Логируем предупреждение если БД уже существует
 } else {
  log.Println("✅ Database created successfully")  // Сообщаем об успешном создании БД
 }

 // Подключаемся к нашей базе
 connStrWithDB := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",  // Формируем новую строку подключения с указанием БД
  os.Getenv("DB_USER"),      // Имя пользователя
  os.Getenv("DB_PASSWORD"),  // Пароль
  os.Getenv("DB_HOST"),      // Хост
  os.Getenv("DB_PORT"),      // Порт
  dbName,                    // Имя базы данных
 )

 dbConn, err := pgx.Connect(context.Background(), connStrWithDB)  // Устанавливаем соединение с конкретной БД
 if err != nil {  // Проверяем ошибку подключения
  log.Fatal("Failed to connect to new database:", err)  // Завершаем программу при ошибке
 }
 defer dbConn.Close(context.Background())  // Отложенное закрытие соединения

 // Создаем таблицы ЕСЛИ ИХ НЕТ
 err = createTables(dbConn)  // Вызываем функцию создания таблиц
 if err != nil {  // Проверяем ошибку создания таблиц
  log.Fatal("Failed to create tables:", err)  // Завершаем программу при ошибке
 }

 log.Println("✅ Database setup completed successfully!")  // Сообщаем об успешном завершении настройки БД
}

func createTables(conn *pgx.Conn) error {  // Функция создания таблиц принимает соединение и возвращает ошибку
 // Используем CREATE TABLE IF NOT EXISTS
 usersTable := `  -- *SQL запрос для создания таблицы пользователей
 CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );`
 profilesTable := `   --* SQL запрос для создания таблицы профилей
 CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,                    -- *Автоинкрементный первичный ключ
  user_id INTEGER REFERENCES users(id),     --* Внешний ключ на таблицу users
  interests TEXT[],                         -- *Массив интересов
  location VARCHAR(100),                    -- *Местоположение
  looking_for VARCHAR(50),                  -- *Кого ищет пользователь
  is_verified BOOLEAN DEFAULT false         --* Флаг верификации (по умолчанию false)
 );`

 datingProfilesTable := `   -- *SQL запрос для создания таблицы dating профилей
 CREATE TABLE IF NOT EXISTS dating_profiles (
  id SERIAL PRIMARY KEY,                    -- *Автоинкрементный первичный ключ
  user_id INTEGER REFERENCES users(id),     -- *Внешний ключ на таблицу users
  photos TEXT[],                            -- *Массив ссылок на фото
  description TEXT,                         -- *Описание профиля
  is_active BOOLEAN DEFAULT true,           -- *Флаг активности (по умолчанию true)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- *Время создания (автоматически)
 );`

 // *Выполняем создание таблиц
 _, err := conn.Exec(context.Background(), usersTable)  // Создаем таблицу users
 if err != nil {  // Проверяем ошибку
  return err  // Возвращаем ошибку если что-то пошло не так
 }

 _, err = conn.Exec(context.Background(), profilesTable)  // Создаем таблицу profiles
 if err != nil {  // Проверяем ошибку
  return err  // Возвращаем ошибку
 }

 _, err = conn.Exec(context.Background(), datingProfilesTable)  // Создаем таблицу dating_profiles
 if err != nil {  // Проверяем ошибку
  return err  // Возвращаем ошибку
 }

 log.Println("✅ Tables created/verified successfully!")  // Сообщаем об успешном создании таблиц
 return nil  // Возвращаем nil - ошибок нет
}


//! СЛУЖЕБНЫЕ СЛОВА GO:
//* package    - объявляет пакет к которому принадлежит файл
//* import     - импортирует внешние пакеты  
//* func       - объявляет функцию
//* var        - объявляет переменную (не используется явно, но под капотом)
//* const      - объявляет константу (не используется явно)
//* if         - условный оператор
//* else       - альтернативная ветка условия
//* return     - возвращает значение из функции
//* defer      - откладывает выполнение функции до выхода из текущей функции

//! ВСТРОЕННЫЕ ФУНКЦИИ:
//* fmt.Sprintf()        - форматирует строку без вывода (возвращает строку)
//* os.Getenv()          - получает значение переменной окружения
//* log.Fatal()          - логирует сообщение и завершает программу с кодом 1
//* log.Println()        - логирует сообщение с переводом строки
//* context.Background() - создает пустой контекст

//! МЕТОДЫ PGX (PostgreSQL драйвер):
//* pgx.Connect() - устанавливает соединение с БД PostgreSQL
//* conn.Exec()   - выполняет SQL запрос без возврата строк
//* conn.Close()  - закрывает соединение с БД

//! SQL КЛЮЧЕВЫЕ СЛОВА:
//* CREATE DATABASE          - создает новую базу данных
//* CREATE TABLE IF NOT EXISTS - создает таблицу если она не существует  
//* SERIAL PRIMARY KEY       - автоинкрементный первичный ключ
//* VARCHAR(n)               - строка переменной длины до n символов
//* TEXT                     - текст неограниченной длины
//* INTEGER                  - целое число
//* BOOLEAN                  - логическое значение true/false
//* TIMESTAMP                - дата и время
//* DEFAULT                  - значение по умолчанию
//* REFERENCES               - ограничение внешнего ключа
//* UNIQUE                   - ограничение уникальности
//* NOT NULL                 - ограничение непустого значения
//* TEXT[]                   - массив текстовых значений

//! ТИПЫ ДАННЫХ POSTGRESQL:
//* SERIAL      - автоинкрементное целое число (1, 2, 3...)
//* VARCHAR     - строка переменной длины с ограничением
//* TEXT        - строка неограниченной длины
//* INTEGER     - целое число
//* BOOLEAN     - true/false
//* TIMESTAMP   - дата и время
//* TEXT[]      - массив текстовых значений

//! ОГРАНИЧЕНИЯ (CONSTRAINTS):
//* PRIMARY KEY - первичный ключ (уникальный идентификатор)
//* FOREIGN KEY - внешний ключ (ссылка на другую таблицу)  
//* UNIQUE      - уникальное значение в столбце
//* NOT NULL    - значение не может быть пустым
//* DEFAULT     - значение по умолчанию если не указано