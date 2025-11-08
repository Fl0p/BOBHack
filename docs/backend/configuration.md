# Конфигурация Backend

## Переменные окружения

В данный момент backend не использует файл `.env`, но вы можете добавить его для хранения конфигурации.

### Рекомендуемая структура .env

```env
PORT=3001
NODE_ENV=development
```

## Порт сервера

Текущий порт задан в `packages/backend/src/index.ts:5`:

```typescript
const PORT = 3001;
```

Рекомендуется вынести в переменную окружения:

```typescript
const PORT = process.env.PORT || 3001;
```

## Middleware

### CORS

Конфигурация CORS в `packages/backend/src/index.ts:7`:

```typescript
app.use(cors());
```

По умолчанию разрешены все origins. Для production рекомендуется ограничить:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

### Body Parser

Express встроенный JSON parser:

```typescript
app.use(express.json());
```

## TypeScript конфигурация

Файл `packages/backend/tsconfig.json` содержит настройки компилятора TypeScript для backend.

Ключевые настройки:
- **target**: ES версия для компиляции
- **module**: Тип модульной системы (ESM)
- **outDir**: Директория для скомпилированных файлов (`dist/`)

## Package.json конфигурация

```json
{
  "type": "module"
}
```

Это означает, что проект использует ES модули (import/export) вместо CommonJS (require/module.exports).
