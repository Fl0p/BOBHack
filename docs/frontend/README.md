# Frontend документация

React + Vite приложение для BOBHack проекта.

## Содержание

- [Компоненты](./components.md) - описание React компонентов
- [Конфигурация Vite](./vite-configuration.md) - настройки Vite
- [Разработка](./development.md) - руководство по разработке frontend

## Технологии

- **React 18** - UI библиотека
- **TypeScript** - язык программирования
- **Vite** - инструмент сборки и dev-сервер

## Структура

```
packages/frontend/
├── src/
│   ├── main.tsx          # Точка входа
│   ├── App.tsx           # Главный компонент
│   └── App.css           # Стили
├── public/               # Статические файлы
├── dist/                 # Собранное приложение (генерируется)
├── index.html            # HTML шаблон
├── package.json          # Зависимости и скрипты
├── tsconfig.json         # TypeScript конфигурация
└── vite.config.ts        # Vite конфигурация
```

## Быстрые команды

```bash
# Разработка
yarn workspace frontend dev

# Сборка
yarn workspace frontend build

# Preview собранного приложения
yarn workspace frontend preview
```

## Порт

Frontend работает на порте **3000**.
