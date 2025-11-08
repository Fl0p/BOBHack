# Vite конфигурация

Документация по настройке Vite для frontend приложения.

## Конфигурационный файл

**Расположение**: `packages/frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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

## Плагины

### @vitejs/plugin-react

Официальный плагин для поддержки React:
- Fast Refresh (горячая перезагрузка)
- JSX/TSX трансформация
- Оптимизация React в production

## Dev Server

### Порт

```typescript
server: {
  port: 3000
}
```

Сервер разработки запускается на порту 3000.

### Host

Для доступа из локальной сети добавьте:

```typescript
server: {
  host: true,
  port: 3000
}
```

## Proxy конфигурация

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
}
```

### Параметры

- **'/api'**: Все запросы начинающиеся с `/api` будут проксированы
- **target**: URL backend сервера
- **changeOrigin**: Изменяет origin заголовок запроса на target URL

### Как работает

1. Frontend делает запрос: `fetch('/api/hello')`
2. Vite перехватывает запрос
3. Перенаправляет на: `http://localhost:3001/api/hello`
4. Возвращает ответ frontend'у

Подробнее см. [Коммуникация между сервисами](../architecture/communication.md)

## Дополнительные настройки

### Алиасы путей

```typescript
resolve: {
  alias: {
    '@': '/src',
    '@components': '/src/components',
    '@utils': '/src/utils',
  },
}
```

Использование:
```typescript
import { Button } from '@components/Button';
```

### Environment переменные

Создайте `.env` файл:

```env
VITE_API_URL=http://localhost:3001
```

Использование в коде:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

**Важно**: Все переменные должны начинаться с `VITE_` для доступа в клиентском коде.

### Build оптимизация

```typescript
build: {
  outDir: 'dist',
  sourcemap: true,
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
      },
    },
  },
}
```

## Режимы

- **Development**: `yarn dev` - с hot reload и без минификации
- **Production**: `yarn build` - оптимизированная сборка
- **Preview**: `yarn preview` - предпросмотр production сборки

## Полезные ссылки

- [Vite документация](https://vitejs.dev/)
- [Vite React Plugin](https://github.com/vitejs/vite-plugin-react)
