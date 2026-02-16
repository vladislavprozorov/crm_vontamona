# Frontend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Копирование package files
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Установка переменных окружения для сборки
ENV NEXT_PUBLIC_API_URL=http://localhost:3001

# Сборка приложения
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Копирование package files и установка production зависимостей
COPY package*.json ./
RUN npm ci --only=production

# Копирование собранного приложения
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Открытие порта
EXPOSE 3000

# Запуск приложения
CMD ["npm", "start"]
