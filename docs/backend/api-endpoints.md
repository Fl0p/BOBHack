# API Endpoints

Documentation for all backend server API endpoints.

## Base URL

- **Development**: `http://localhost:3001`
- **From Frontend (Development)**: `/api` (proxied through Vite)
- **Production**: `https://api.aignite.pl`

## Endpoints

### GET /api/hello

Test endpoint to verify API functionality.

**Code Location**: `packages/backend/src/index.ts:10`

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

#### Usage Examples

**cURL (Development)**:
```bash
curl http://localhost:3001/api/hello
```

**cURL (Production)**:
```bash
curl https://api.aignite.pl/api/hello
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

**React Hook Example**:
```typescript
import { useEffect, useState } from 'react';

function HelloComponent() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return <div>{message}</div>;
}
```

---

## Adding New Endpoints

When adding new endpoints, update this documentation with:
- HTTP method and path
- Functionality description
- Request parameters (query, body, headers)
- Response format (with TypeScript types)
- Status codes (success and error cases)
- Usage examples (cURL, fetch, TypeScript)
- Authentication requirements (if any)

### Example Template

```markdown
### POST /api/resource

Brief description of what this endpoint does.

**Code Location**: `packages/backend/src/routes/resource.ts:XX`

#### Request

**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (if required)

**Body**:
\`\`\`json
{
  "field": "value"
}
\`\`\`

#### Response

**Success (200 OK)**:
\`\`\`json
{
  "id": "123",
  "created": true
}
\`\`\`

**Error (400 Bad Request)**:
\`\`\`json
{
  "error": "Invalid request",
  "details": "Field 'field' is required"
}
\`\`\`

#### Usage Example

\`\`\`typescript
const response = await fetch('/api/resource', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ field: 'value' }),
});
const data = await response.json();
\`\`\`
```
