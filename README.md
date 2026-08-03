# Meridian Weather

A full-stack weather application built with **Laravel 11** (REST API + JWT Auth) and **React 19** (Vite, Tailwind CSS v4, Framer Motion).

---

## Technology Stack

### Backend
| Concern | Package |
|---|---|
| Framework | Laravel 11 |
| Authentication | `php-open-source-saver/jwt-auth` v2 |
| Database | MySQL 8+ |
| Weather Data | OpenWeather Current Weather API |
| HTTP Client | Laravel built-in `Http` facade (Guzzle) |
| Caching | File cache (10-minute TTL per city) |

### Frontend
| Concern | Package |
|---|---|
| Build tool | Vite 8 |
| UI library | React 19 |
| Routing | React Router DOM v7 |
| HTTP | Axios (JWT interceptor) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Notifications | React Hot Toast |
| Icons | Lucide React |

---

## Prerequisites

- **Backend:** PHP 8.2+, Composer 2+ (for Laravel 11)
- **Frontend:** Node.js 20+ (for React 19)
- **Database:** MySQL 8+
- **API:** Free [OpenWeather API key](https://openweathermap.org/api) (Current Weather Data)

---

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env

# Fill in DB_DATABASE, DB_USERNAME, DB_PASSWORD, OPENWEATHER_API_KEY
php artisan key:generate
php artisan jwt:secret

# Option A — run migrations
php artisan migrate

# Option B — import the plain SQL file
# mysql -u root -p < database/schema.sql

php artisan serve
# API available at http://localhost:8000/api
```

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:8000/api
npm run dev
# App available at http://localhost:5173
```

---

## API Reference

All endpoints are prefixed with `/api`.  
Protected endpoints require: `Authorization: Bearer <access_token>`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | Public | Create account + receive JWT |
| POST | `/api/login` | Public | Sign in + receive JWT |
| POST | `/api/logout` | Required | Invalidate token |
| GET | `/api/profile` | Required | Authenticated user |

#### Register body
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}
```

#### Login body
```json
{ "email": "jane@example.com", "password": "secret123" }
```

Both return:
```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": { "id": 1, "name": "Jane Smith", "email": "jane@example.com" }
}
```

### Weather

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/weather?city={name}` | Required | Current conditions |

#### Response 200
```json
{
  "data": {
    "city": "Karachi",
    "country": "PK",
    "temperature": 34.2,
    "feels_like": 38.1,
    "humidity": 72,
    "wind_speed": 4.5,
    "condition": "Haze",
    "description": "haze",
    "icon": "50d",
    "fetched_at": "2026-08-03T18:00:00+00:00"
  }
}
```

---

## Project Structure

```
meridian-weather/
├── backend/                         Laravel 11 API
│   ├── app/
│   │   ├── Exceptions/CityNotFoundException.php
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   └── WeatherController.php
│   │   ├── Http/Requests/
│   │   │   ├── LoginRequest.php
│   │   │   ├── RegisterRequest.php
│   │   │   └── WeatherRequest.php
│   │   ├── Models/User.php          implements JWTSubject
│   │   └── Services/WeatherService.php
│   ├── bootstrap/app.php            CORS, JSON exceptions
│   ├── config/auth.php              api guard → jwt driver
│   ├── config/cors.php
│   ├── config/services.php          openweather keys
│   ├── database/migrations/
│   ├── database/schema.sql          plain SQL alternative
│   ├── routes/api.php
│   └── .env.example
│
└── frontend/                        React 19 SPA
    ├── src/
    │   ├── components/
    │   │   ├── AuthLayout.jsx       split-screen shell
    │   │   ├── CitySearch.jsx
    │   │   ├── FormField.jsx
    │   │   ├── LoadingScreen.jsx
    │   │   ├── MetricTile.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── PublicRoute.jsx
    │   │   ├── SkyStrip.jsx         signature animated panel
    │   │   └── WeatherCard.jsx
    │   ├── context/AuthContext.jsx  JWT session management
    │   ├── lib/api.js               Axios + JWT interceptors
    │   ├── lib/schemas.js           Zod validation schemas
    │   └── pages/
    │       ├── Dashboard.jsx
    │       ├── Login.jsx
    │       ├── NotFound.jsx
    │       └── Register.jsx
    └── .env.example
```

---

## Key Implementation Notes

**JWT flow** — Login/register returns an `access_token`. Axios attaches it as `Authorization: Bearer <token>` on every request. A 401 clears the token so route guards redirect to `/login`.

**Route protection** — `ProtectedRoute` wraps the dashboard; `PublicRoute` wraps login/register. Both prevent the opposite state from accessing the route. A `LoadingScreen` prevents flashing while the stored token is being server-verified on first load.

**Error handling** — `WeatherService` throws `CityNotFoundException` (→ 404) and `RuntimeException` (→ 503). `bootstrap/app.php` converts Laravel's `AuthenticationException` and `NotFoundHttpException` to JSON on `api/*` so no HTML ever leaks to the client.

**Caching** — Weather data is cached per city for 10 minutes (`Cache::remember`), reducing OpenWeather API usage without requiring Redis.

---

MIT

---

## Database Schema

```sql
-- Meridian Weather — MySQL schema
-- Alternative to running `php artisan migrate`.
-- Run: mysql -u root -p meridian_weather < database/schema.sql

CREATE DATABASE IF NOT EXISTS `meridian_weather`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `meridian_weather`;

CREATE TABLE IF NOT EXISTS `users` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`              VARCHAR(255) NOT NULL,
  `email`             VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password`                     VARCHAR(255) NOT NULL,
  `verification_code`            VARCHAR(6) NULL DEFAULT NULL,
  `verification_code_expires_at` TIMESTAMP NULL DEFAULT NULL,
  `remember_token`               VARCHAR(100) NULL DEFAULT NULL,
  `created_at`                   TIMESTAMP NULL DEFAULT NULL,
  `updated_at`        TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email`      VARCHAR(255) NOT NULL,
  `token`      VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `migrations` (
  `id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` VARCHAR(255) NOT NULL,
  `batch`     INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

