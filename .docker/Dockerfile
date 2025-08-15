# Stage 1: Build
FROM node:20.19.4-alpine AS builder

WORKDIR /app

# 1. Копируем только файлы зависимостей
COPY ./src/package.json ./src/yarn.lock ./

# 2. Устанавливаем ВСЕ зависимости
RUN yarn install --pure-lockfile

# 3. Копируем исходный код
COPY ./src .

# 4. Собираем проект
RUN yarn build

# Stage 2: Production
FROM node:20.19.4-alpine

WORKDIR /app

# Копируем только необходимые файлы
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./app/yarn.lock ./

# Устанавливаем ТОЛЬКО production-зависимости (без --frozen-lockfile)
RUN yarn install --production

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]