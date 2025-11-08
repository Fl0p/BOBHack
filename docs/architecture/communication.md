# Коммуникация между сервисами

## Обзор

Frontend и Backend общаются через HTTP API с использованием прокси-конфигурации Vite.

## Архитектура коммуникации

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │ ───────→│ Vite Proxy  │ ───────→│   Express   │
│ :3000       │         │ /api → :3001│         │ Backend     │
└─────────────┘ ←─────── └─────────────┘ ←─────── └─────────────┘
```

## Vite Proxy конфигурация

В `packages/frontend/vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### Как это работает

1. Frontend делает запрос к `/api/hello`
2. Vite перехватывает запрос и перенаправляет его на `http://localhost:3001/api/hello`
3. Backend обрабатывает запрос и возвращает ответ
4. Vite проксирует ответ обратно во Frontend

## CORS

Backend настроен с CORS middleware для разрешения cross-origin запросов:

```typescript
import cors from 'cors';
app.use(cors());
```

Это необходимо для разработки, когда frontend и backend работают на разных портах.

## Пример запроса

### Frontend код
```typescript
fetch('/api/hello')
  .then(res => res.json())
  .then(data => console.log(data))
```

### Backend endpoint
```typescript
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World from Backend!' });
});
```

## Production соображения

В production окружении:
- Frontend билдится в статические файлы
- Backend может раздавать frontend статику
- Или использовать отдельный веб-сервер (nginx) для frontend
