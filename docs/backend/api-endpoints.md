# API Endpoints

Документация всех API эндпоинтов backend сервера.

## Base URL

- **Development**: `http://localhost:3001`
- **From Frontend**: `/api` (проксируется через Vite)

## Endpoints

### GET /api/hello

Тестовый эндпоинт для проверки работы API.

**Расположение в коде**: `packages/backend/src/index.ts:10`

#### Request

```http
GET /api/hello HTTP/1.1
```

#### Response

```json
{
  "message": "Hello World from Backend!"
}
```

**Status Code**: 200 OK

#### Пример использования

**cURL**:
```bash
curl http://localhost:3001/api/hello
```

**JavaScript (fetch)**:
```javascript
fetch('/api/hello')
  .then(res => res.json())
  .then(data => console.log(data.message))
```

**TypeScript**:
```typescript
const response = await fetch('/api/hello');
const data: { message: string } = await response.json();
console.log(data.message);
```

---

## Добавление новых endpoints

При добавлении новых эндпоинтов, обновите эту документацию с:
- HTTP метод и путь
- Описание функциональности
- Параметры запроса
- Формат ответа
- Примеры использования
- Коды статусов
