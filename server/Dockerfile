# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Установка pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml docker-entrypoint.sh nest-cli.json tsconfig.build.json tsconfig.json ./
COPY src/ ./src/
# Установка зависимостей
RUN pnpm install --frozen-lockfile

# Сборка приложения
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Копирование package.json
COPY package.json pnpm-lock.yaml ./
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Установка только production зависимостей
RUN pnpm install --prod --frozen-lockfile

# Копирование собранного приложения
COPY --from=builder /app/dist ./dist

# Открытие порта
EXPOSE 3001

ENTRYPOINT ["docker-entrypoint.sh"]
# Запуск приложения
CMD ["node", "dist/main"]
