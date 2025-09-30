FROM node:18-alpine

WORKDIR /app

# Копируем package файлы
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Экспонируем порт
EXPOSE 3001

# Запускаем приложение
CMD ["npm", "run", "start:dev"]
