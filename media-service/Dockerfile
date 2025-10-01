FROM golang:1.25-alpine

WORKDIR /app

# Копируем файлы зависимостей
COPY go.mod go.sum ./
RUN go mod download

# Копируем исходный код
COPY . .

# Создаем папку для загрузок
RUN mkdir -p uploads/avatars uploads/posts

# Собираем приложение
RUN go build -o main .

# Экспонируем порт
EXPOSE 8083

# Запускаем приложение
CMD ["./main"]