# Backend разработка

Руководство по разработке backend части проекта.

## Запуск для разработки

```bash
# Из корня проекта
yarn dev:backend

# Или напрямую из workspace
yarn workspace backend dev
```

Сервер запустится на `http://localhost:3001` с hot reload через `tsx watch`.

## Добавление нового API endpoint

1. Откройте `packages/backend/src/index.ts`

2. Добавьте новый endpoint:

```typescript
app.get('/api/your-endpoint', (req: Request, res: Response) => {
  res.json({ data: 'your data' });
});
```

3. Для POST запросов:

```typescript
app.post('/api/create', (req: Request, res: Response) => {
  const { name } = req.body;
  res.json({ success: true, name });
});
```

4. Обновите документацию в [api-endpoints.md](./api-endpoints.md)

## Структурирование кода

По мере роста проекта, рекомендуется разделить код на модули:

```
packages/backend/src/
├── index.ts              # Главный файл
├── routes/
│   ├── users.ts          # User routes
│   └── posts.ts          # Post routes
├── controllers/
│   ├── userController.ts
│   └── postController.ts
├── models/
│   └── ...
└── middleware/
    └── ...
```

## Тестирование

Для добавления тестов рекомендуется использовать:
- **Jest** или **Vitest** - test runner
- **Supertest** - для тестирования HTTP endpoints

```bash
yarn workspace backend add -D vitest supertest @types/supertest
```

## Отладка

### VS Code

Создайте `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/packages/backend",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Console logging

```typescript
console.log('Debug info:', data);
console.error('Error:', error);
```

## Сборка для production

```bash
yarn workspace backend build
```

Это скомпилирует TypeScript код в директорию `dist/`.

Запуск production версии:

```bash
yarn workspace backend start
```
