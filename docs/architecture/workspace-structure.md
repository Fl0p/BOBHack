# Workspace структура

## Yarn 4 Workspaces

Проект использует Yarn 4.10.3 с функцией workspaces для управления монорепозиторием.

## Конфигурация

В корневом `package.json`:

```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

## Пакеты

### Backend (`packages/backend`)
- **Порт**: 3001
- **Назначение**: REST API сервер
- **Точка входа**: `src/index.ts`

### Frontend (`packages/frontend`)
- **Порт**: 3000
- **Назначение**: React UI приложение
- **Точка входа**: `src/main.tsx`

## Управление зависимостями

### Установка зависимостей для всего проекта
```bash
yarn install
```

### Добавление зависимости в конкретный workspace
```bash
# Backend
yarn workspace backend add <package-name>

# Frontend
yarn workspace frontend add <package-name>
```

### Запуск команд в workspace
```bash
yarn workspace <workspace-name> <command>
```

## Преимущества подхода

1. **Единое управление зависимостями**: Общие зависимости не дублируются
2. **Консистентные версии**: Yarn обеспечивает согласованность версий между пакетами
3. **Изоляция**: Каждый пакет имеет свои собственные зависимости и конфигурацию
4. **Удобство разработки**: Возможность запускать все сервисы одной командой
