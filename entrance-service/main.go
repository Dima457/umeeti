package main

import (
 "context"
 "crypto/rand"
 //"encoding/base64"
 "fmt"
 "log"
 "net/http"
 "os"
 "strings"
 "time"

 "github.com/gin-gonic/gin"
 "github.com/golang-jwt/jwt/v5"
 "github.com/jackc/pgx/v5/pgxpool"
 "github.com/joho/godotenv"
 "golang.org/x/crypto/bcrypt"
)

var db *pgxpool.Pool

//* Секрет для JWT - будет установлен при запуске
var jwtSecret []byte

type LoginRequest struct {
 Login    string `json:"login" binding:"required"`
 Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
 Token string       `json:"token"`
 User  UserResponse `json:"user"`
}

type UserResponse struct {
 ID       int    `json:"id"`
 Phone    string `json:"phone"`
 Email    string `json:"email"`
 Username string `json:"username"`
 FullName string `json:"full_name"`
}

//* Claims - данные которые будут в JWT токене
type Claims struct {
 UserID   int    `json:"user_id"`
 Username string `json:"username"`
 jwt.RegisteredClaims
}

func main(){
	godotenv.Load()

	initJWTSecret()

	//* 3. Подключаемся к БД
 connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
  os.Getenv("DB_USER"),
  os.Getenv("DB_PASSWORD"),
  os.Getenv("DB_HOST"),
  os.Getenv("DB_PORT"),
  os.Getenv("DB_NAME"),
 )

 var err error
 db,err = pgxpool.New(context.Background(), connStr)
 if err != nil{
		log.Fatal("Failed to connect to database", err)
 }
 defer db.Close()

 //* 4. Проверяем подключение
 err = db.Ping(context.Background())
 if err != nil{
	log.Fatal("Database ping failed:",err)
 }
 fmt.Println("Entrance service connected to database")

 //* 5. Настраиваем роутер
 r := gin.Default()
  //* CORS middleware
  r.Use(corsMiddleware())
  
  //* Маршруты
 r.POST("/login", loginHandler)
 r.POST("/validate-token", validateTokenHandler)
 r.GET("/health", healthHandler)
 port := os.Getenv("PORT")
 if port == "" {
  port = "8080"
 }
 
 log.Printf("🚀 Entrance service running on port %s", port)
 r.Run(":" + port)
}
//* initJWTSecret - инициализирует секретный ключ для JWT
func initJWTSecret() {
 secretFromEnv := os.Getenv("JWT_SECRET")
 
 if secretFromEnv != "" {
  //* Используем ключ из .env
  jwtSecret = []byte(secretFromEnv)
  log.Println("✅ JWT secret loaded from .env")
 } else {
  //* Генерируем случайный ключ
  jwtSecret = generateRandomSecret()
  log.Printf("⚠️  JWT_SECRET not set in .env, using auto-generated key")
  log.Printf("⚠️  For production, add JWT_SECRET to your .env file")
 }
}

//* generateRandomSecret - генерирует криптографически безопасный ключ
func generateRandomSecret() []byte {
 bytes := make([]byte, 32) //* 32 байта = 256 бит
 _, err := rand.Read(bytes)
 if err != nil {
  log.Fatal("Failed to generate random secret:", err)
 }
 return bytes
}

//* corsMiddleware - настройки CORS
func corsMiddleware() gin.HandlerFunc {
 return func(c *gin.Context) {
  c.Header("Access-Control-Allow-Origin", "*")
  c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  
  if c.Request.Method == "OPTIONS" {
   c.AbortWithStatus(204)
   return
  }
  
  c.Next()
 }
}

//* loginHandler - обработчик входа
func loginHandler(c *gin.Context) {
 var req LoginRequest
 
 if err := c.ShouldBindJSON(&req); err != nil {
  c.JSON(http.StatusBadRequest, gin.H{
   "error":   "Invalid request data",
   "details": err.Error(),
  })
  return
 }

 //* Ищем пользователя
 user, err := findUserByIdentifier(req.Login)
 if err != nil {
  c.JSON(http.StatusUnauthorized, gin.H{
   "error": "Invalid login or password",
  })
  return
 }

 //* Проверяем пароль
 err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
 if err != nil {
  c.JSON(http.StatusUnauthorized, gin.H{
   "error": "Invalid login or password",
  })
  return
 }

 // Генерируем JWT токен
 token, err := generateToken(user.ID, user.Username)
 if err != nil {
  c.JSON(http.StatusInternalServerError, gin.H{
   "error": "Failed to generate token",
  })
  return
 }
 // *Формируем ответ
 response := LoginResponse{
  Token: token,
  User: UserResponse{
   ID:       user.ID,
   Phone:    user.Phone,
   Email:    user.Email,
   Username: user.Username,
   FullName: user.FullName,
  },
 }

 c.JSON(http.StatusOK, response)
}

//* validateTokenHandler - проверяет JWT токен
func validateTokenHandler(c *gin.Context) {
 authHeader := c.GetHeader("Authorization")
 if authHeader == "" {
  c.JSON(http.StatusUnauthorized, gin.H{
   "error": "Authorization header required",
  })
  return
 }

 //* Извлекаем токен из "Bearer <token>"
 tokenString := strings.TrimPrefix(authHeader, "Bearer ")
 if tokenString == authHeader {
  c.JSON(http.StatusUnauthorized, gin.H{
   "error": "Invalid authorization format. Use: Bearer <token>",
  })
  return
 }

 //* Валидируем токен
 claims, err := validateToken(tokenString)
 if err != nil {
  c.JSON(http.StatusUnauthorized, gin.H{
   "error": "Invalid token",
   "details": err.Error(),
  })
  return
 }

 c.JSON(http.StatusOK, gin.H{
  "valid":    true,
  "user_id":  claims.UserID,
  "username": claims.Username,
 })
}

// *Структура для пользователя из БД
type User struct {
 ID           int
 Phone        string
 Email        string
 Username     string
 FullName     string
 PasswordHash string
}

//* findUserByIdentifier - ищет пользователя по логину/email/телефону
func findUserByIdentifier(identifier string) (*User, error) {
 var user User
 
 query := 
  `SELECT id, phone, email, username, full_name, password_hash 
  FROM users 
  WHERE username = $1 OR email = $1 OR phone = $1
  LIMIT 1`
 
 
 err := db.QueryRow(context.Background(), query, identifier).Scan(
  &user.ID, &user.Phone, &user.Email, &user.Username, &user.FullName, &user.PasswordHash,
 )
 
 if err != nil {
  return nil, err
 }
 
 return &user, nil
}

//* generateToken - создает JWT токен
func generateToken(userID int, username string) (string, error) {
 //* Токен действует 24 часа
 expirationTime := time.Now().Add(24 * time.Hour)
 
 claims := &Claims{
  UserID:   userID,
  Username: username,
  RegisteredClaims: jwt.RegisteredClaims{
   ExpiresAt: jwt.NewNumericDate(expirationTime),
   IssuedAt:  jwt.NewNumericDate(time.Now()),
   NotBefore: jwt.NewNumericDate(time.Now()),
   Issuer:    "umeeti-entrance-service",
  },
 }

 //* Создаем токен с алгоритмом HS256
 token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
 
 //* Подписываем токен секретным ключом
 return token.SignedString(jwtSecret)
}

//* validateToken - проверяет JWT токен
func validateToken(tokenString string) (*Claims, error) {
 claims := &Claims{}
 
 //* Парсим токен
 token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
  //* Проверяем алгоритм подписи
  if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
   return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
  }
  return jwtSecret, nil
 })
 
 if err != nil {
  return nil, err
 }
 
 if !token.Valid {
  return nil, fmt.Errorf("invalid token")
 }
 
 return claims, nil
}

func healthHandler(c *gin.Context) {
 c.JSON(http.StatusOK, gin.H{
  "status":  "ok",
  "service": "entrance-service",
 })
}

