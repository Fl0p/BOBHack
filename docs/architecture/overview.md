# Общая архитектура проекта

## Обзор

BOBHack - это full-stack приложение, построенное на монорепозитории с использованием Yarn 4 workspaces.

## Технологический стек

### Backend
- **Node.js** - серверная среда выполнения
- **Express.js** - веб-фреймворк
- **TypeScript** - типизированный JavaScript
- **tsx** - TypeScript execution для разработки

### Frontend
- **React 18** - UI библиотека
- **Vite** - инструмент сборки и dev-сервер
- **TypeScript** - типизированный JavaScript

## Структура проекта

```
BOBHack/
├── packages/
│   ├── backend/     # Express API сервер
│   └── frontend/    # React приложение
├── docs/            # Документация
└── package.json     # Workspace конфигурация
```

## Принципы архитектуры

1. **Монорепозиторий**: Весь код находится в одном репозитории, управляемом через Yarn workspaces
2. **Разделение concerns**: Backend и frontend являются независимыми пакетами
3. **Type Safety**: Использование TypeScript на всех уровнях стека
4. **Development Experience**: Конкурентный запуск сервисов для удобства разработки

## Потоки данных

Frontend → Vite Proxy → Backend API → Response → Frontend

Подробнее см. [Коммуникация между сервисами](./communication.md)
