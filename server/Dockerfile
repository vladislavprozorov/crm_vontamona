# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Установка pnpm
RUN npm install -g pnpm

# Копирование package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Установка зависимостей
RUN pnpm install --frozen-lockfile

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Копирование package.json
COPY package.json pnpm-lock.yaml ./

# Установка только production зависимостей
RUN pnpm install --prod --frozen-lockfile

# Копирование собранного приложения
COPY --from=builder /app/dist ./dist

# Открытие порта
EXPOSE 3001

# Запуск приложения
CMD ["node", "dist/main"]
