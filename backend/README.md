# Express Auth Backend

Express.js backend с JWT авторизацией (access/refresh tokens) и MongoDB.

## Возможности

- Регистрация пользователей с проверкой уникальности email
- Авторизация по email и паролю
- JWT токены (access и refresh)
- Защищенные эндпоинты
- Обновление профиля пользователя
- Docker и Docker Compose для простого развертывания

## Технологии

- Node.js 20
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Docker & Docker Compose

## Структура проекта

```
/
├── src/
│   ├── config/
│   │   └── database.js          # Подключение к MongoDB
│   ├── models/
│   │   └── User.js              # Mongoose модель пользователя
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── routes/
│   │   └── auth.js              # Роуты авторизации
│   ├── controllers/
│   │   └── authController.js    # Контроллеры
│   ├── utils/
│   │   └── tokenUtils.js        # JWT утилиты
│   └── app.js                   # Основной файл
├── .env                         # Переменные окружения
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## API Endpoints

### Публичные эндпоинты

#### 1. Регистрация

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "createdAt": "..."
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### 2. Вход

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 3. Обновление access token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

### Защищенные эндпоинты (требуют Authorization header)

#### 4. Выход

```http
POST /api/auth/logout
Authorization: Bearer {accessToken}
```

#### 5. Получить текущего пользователя

```http
GET /api/auth/me
Authorization: Bearer {accessToken}
```

#### 6. Обновить профиль

```http
PUT /api/auth/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

### Health Check

```http
GET /health
```

## Запуск с Docker Compose

### 1. Клонировать репозиторий и перейти в директорию

```bash
cd express-backed
```

### 2. Настроить переменные окружения

Скопируйте `.env.example` в `.env` и измените значения:

```bash
cp .env.example .env
```

**Важно:** Измените `JWT_ACCESS_SECRET` и `JWT_REFRESH_SECRET` на свои уникальные значения в production!

### 3. Запустить приложение

```bash
docker-compose up -d
```

Приложение будет доступно на `http://localhost:3000`

### 4. Просмотр логов

```bash
docker-compose logs -f app
```

### 5. Остановить приложение

```bash
docker-compose down
```

### 6. Остановить и удалить volumes (включая данные БД)

```bash
docker-compose down -v
```

## Запуск без Docker (локально)

### 1. Установить зависимости

```bash
npm install
```

### 2. Запустить MongoDB локально

Убедитесь, что MongoDB запущен и измените `MONGODB_URI` в `.env`:

```
MONGODB_URI=mongodb://localhost:27017/express-auth
```

### 3. Запустить приложение

```bash
# Production
npm start

# Development с автоперезагрузкой
npm run dev
```

## Переменные окружения

| Переменная             | Описание                           | По умолчанию                         |
| ---------------------- | ---------------------------------- | ------------------------------------ |
| PORT                   | Порт сервера                       | 3000                                 |
| MONGODB_URI            | URI подключения к MongoDB          | mongodb://mongodb:27017/express-auth |
| JWT_ACCESS_SECRET      | Секретный ключ для access token    | -                                    |
| JWT_REFRESH_SECRET     | Секретный ключ для refresh token   | -                                    |
| JWT_ACCESS_EXPIRES_IN  | Время жизни access token           | 15m                                  |
| JWT_REFRESH_EXPIRES_IN | Время жизни refresh token          | 7d                                   |
| NODE_ENV               | Окружение (development/production) | development                          |

## Валидация

- **Email**: Должен быть валидным форматом и уникальным
- **Password**: Минимум 6 символов
- Пароли хешируются с использованием bcrypt (10 salt rounds)

## Безопасность

- Пароли хешируются перед сохранением
- Access token действителен 15 минут
- Refresh token действителен 7 дней и хранится в БД
- Защищенные роуты требуют валидный access token
- CORS включен для всех источников (настройте в production)

## Примеры использования

### Регистрация и получение токенов

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Вход

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Получение данных пользователя

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Обновление токена

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

## Разработка

### Структура ответов API

Успешный ответ:

```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

Ошибка:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Лицензия

ISC
