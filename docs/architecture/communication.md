# Service Communication

## Overview

Frontend and Backend communicate through HTTP API using Vite's proxy configuration in development, and through Cloudflare Tunnel in production.

## Communication Architecture

### Development Mode
```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │ ───────→│ Vite Proxy  │ ───────→│   Express   │
│ :3000       │         │ /api → :3001│         │ Backend     │
└─────────────┘ ←─────── └─────────────┘ ←─────── └─────────────┘
```

### Production Mode (Docker)
```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Browser   │ ───────→│ Cloudflare       │ ───────→│   nginx     │
│             │         │ Tunnel           │         │ (Frontend)  │
│             │         │                  │         └─────────────┘
│             │         │ bob.aignite.pl   │
│             │         │ api.aignite.pl   │         ┌─────────────┐
│             │         │ dify.aignite.pl  │ ───────→│   Express   │
│             │         │                  │         │ (Backend)   │
└─────────────┘ ←─────── └──────────────────┘ ←─────── └─────────────┘
```

## Vite Proxy Configuration

In `packages/frontend/vite.config.ts`:

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

### How it Works

1. Frontend makes a request to `/api/hello`
2. Vite intercepts the request and forwards it to `http://localhost:3001/api/hello`
3. Backend processes the request and returns a response
4. Vite proxies the response back to the Frontend

## CORS

Backend is configured with CORS middleware to allow cross-origin requests:

```typescript
import cors from 'cors';
app.use(cors());
```

This is necessary for development when frontend and backend run on different ports.

## Request Example

### Frontend Code
```typescript
fetch('/api/hello')
  .then(res => res.json())
  .then(data => console.log(data))
```

### Backend Endpoint
```typescript
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World from Backend!' });
});
```

## Production Considerations

### Docker Deployment
In production environment:
- Frontend is built into static files and served by nginx
- Backend runs as a Node.js Express server
- Both are containerized separately
- Cloudflare Tunnel routes traffic based on domain:
  - `bob.aignite.pl` → Frontend (nginx on port 80)
  - `api.aignite.pl` → Backend (Express on port 3001)
  - `dify.aignite.pl` → Dify Web Console (port 3000)

### Service Discovery
Services communicate within Docker network:
- Frontend container: `frontend:80`
- Backend container: `backend:3001`
- Dify API: `dify-api:5001`
- Dify Web: `dify-web:3000`

### Security
- All external traffic goes through Cloudflare Tunnel (HTTPS)
- Internal Docker network communication
- CORS should be restricted to actual frontend domain in production
