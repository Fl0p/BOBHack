# API Endpoints

Documentation for all backend server API endpoints.

## Base URL

- **Development**: `http://localhost:3001`
- **From Frontend (Development)**: `/api` (proxied through Vite)
- **Production**: `https://api.aignite.pl`

## Authentication

All OAuth endpoints use session-based authentication with `express-session`. Credentials are sent via cookies.

**Session Configuration**:
- Cookie-based sessions
- HttpOnly cookies for security
- 24-hour session lifetime
- Secure cookies in production (HTTPS only)

**Code Location**: `packages/backend/src/index.ts:23-46`

---

## Endpoints

### POST /api/auth/google

Authenticate user with Google OAuth2 credentials.

**Code Location**: `packages/backend/src/index.ts:48-110`

#### Request

**Headers**:
- `Content-Type: application/json`

**Body**:
```json
{
  "credential": "google_id_token_here"
}
```

#### Response

**Success (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

**Error (400 Bad Request)**:
```json
{
  "error": "No credential provided"
}
```

**Error (401 Unauthorized)**:
```json
{
  "error": "Invalid token"
}
```

**Error (500 Internal Server Error)**:
```json
{
  "error": "Authentication failed",
  "message": "Error details"
}
```

#### Usage Example

```typescript
const response = await fetch('/api/auth/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: send cookies
  body: JSON.stringify({ credential: googleIdToken }),
});
const data = await response.json();
```

**React with @react-oauth/google**:
```typescript
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={async (credentialResponse) => {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });
    const data = await response.json();
    console.log('User:', data.user);
  }}
  onError={() => console.log('Login Failed')}
/>
```

---

### GET /api/auth/user

Get current authenticated user information.

**Code Location**: `packages/backend/src/index.ts:112-121`

#### Request

```http
GET /api/auth/user HTTP/1.1
```

**Important**: Must include credentials (cookies) in request.

#### Response

**Success (200 OK)**:
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

**Error (401 Unauthorized)**:
```json
{
  "error": "Not authenticated"
}
```

#### Usage Example

```typescript
const response = await fetch('/api/auth/user', {
  credentials: 'include', // Important: send cookies
});

if (response.ok) {
  const data = await response.json();
  console.log('Current user:', data.user);
} else {
  console.log('Not logged in');
}
```

---

### POST /api/auth/logout

Logout current user and destroy session.

**Code Location**: `packages/backend/src/index.ts:123-133`

#### Request

```http
POST /api/auth/logout HTTP/1.1
```

**Important**: Must include credentials (cookies) in request.

#### Response

**Success (200 OK)**:
```json
{
  "success": true
}
```

**Error (500 Internal Server Error)**:
```json
{
  "error": "Logout failed"
}
```

#### Usage Example

```typescript
const response = await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include', // Important: send cookies
});

if (response.ok) {
  console.log('Logged out successfully');
  // Redirect to login or home page
}
```

---

### GET /api/hello

Test endpoint to verify API functionality and database connection.

**Code Location**: `packages/backend/src/index.ts:135`

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
