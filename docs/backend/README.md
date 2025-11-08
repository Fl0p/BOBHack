# Backend документация

Express.js сервер для BOBHack проекта.

## Содержание

- [API Endpoints](./api-endpoints.md) - описание всех API эндпоинтов
- [Конфигурация сервера](./configuration.md) - настройки и конфигурация
- [Разработка](./development.md) - руководство по разработке backend

## Технологии

- **Express.js** - веб-фреймворк
- **TypeScript** - язык программирования
- **CORS** - middleware для cross-origin запросов
- **tsx** - TypeScript execution для разработки

## Структура

```
packages/backend/
├── src/
│   └── index.ts          # Главный файл приложения
├── dist/                 # Скомпилированный код (генерируется)
├── package.json          # Зависимости и скрипты
└── tsconfig.json         # TypeScript конфигурация
```

## Быстрые команды

```bash
# Разработка с hot reload
yarn workspace backend dev

# Сборка
yarn workspace backend build

# Production запуск
yarn workspace backend start
```

## Порт

Backend работает на порте **3001**.
