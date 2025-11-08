# Backend Development

Guide for developing the backend portion of the project.

## Development Startup

```bash
# From project root
yarn dev:backend

# Or directly from workspace
yarn workspace backend dev

# Or run both frontend and backend
yarn dev
```

The server will start at `http://localhost:3001` with hot reload via `tsx watch`.

## Adding a New API Endpoint

1. Open `packages/backend/src/index.ts`

2. Add a new endpoint:

```typescript
app.get('/api/your-endpoint', (req: Request, res: Response) => {
  res.json({ data: 'your data' });
});
```

3. For POST requests:

```typescript
app.post('/api/create', (req: Request, res: Response) => {
  const { name } = req.body;
  res.json({ success: true, name });
});
```

4. For requests with parameters:

```typescript
app.get('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ userId: id, data: {} });
});
```

5. Update documentation in [api-endpoints.md](./api-endpoints.md)

## Code Structure

As the project grows, it's recommended to split code into modules:

```
packages/backend/src/
├── index.ts              # Main application file
├── routes/
│   ├── users.ts          # User routes
│   ├── posts.ts          # Post routes
│   └── index.ts          # Route aggregator
├── controllers/
│   ├── userController.ts
│   └── postController.ts
├── models/
│   ├── User.ts
│   └── Post.ts
├── middleware/
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── validation.ts
├── services/
│   └── database.ts
└── types/
    └── index.ts          # TypeScript type definitions
```

### Example Modular Structure

**routes/users.ts**:
```typescript
import { Router } from 'express';
import { getUser, createUser } from '../controllers/userController';

const router = Router();

router.get('/:id', getUser);
router.post('/', createUser);

export default router;
```

**index.ts**:
```typescript
import userRoutes from './routes/users';

app.use('/api/users', userRoutes);
```

## Testing

For adding tests, it's recommended to use:
- **Jest** or **Vitest** - test runner
- **Supertest** - for testing HTTP endpoints

### Setup

```bash
yarn workspace backend add -D vitest supertest @types/supertest
```

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('GET /api/hello', () => {
  it('should return hello message', async () => {
    const response = await request(app)
      .get('/api/hello')
      .expect(200);

    expect(response.body.message).toBe('Hello World from Backend!');
  });
});
```

## Debugging

### VS Code

Create `.vscode/launch.json`:

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
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Console Logging

```typescript
console.log('Debug info:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### Using Debugger

```typescript
debugger; // Will pause execution when debugging
```

## Building for Production

```bash
yarn workspace backend build
```

This compiles TypeScript code to the `dist/` directory.

### Running Production Build

```bash
yarn workspace backend start
```

### Docker Production Build

```bash
# Build Docker image
docker build -t bobhack-backend ./packages/backend

# Run container
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  bobhack-backend

# Or use docker-compose
docker-compose up -d backend
```

## Environment Variables

See [configuration.md](./configuration.md) for setting up environment variables.

## Best Practices

1. **Type Safety**: Always use TypeScript types
2. **Error Handling**: Implement proper error handling middleware
3. **Validation**: Validate all input data
4. **Security**: Use helmet, rate limiting, and input sanitization
5. **Logging**: Use structured logging (consider winston or pino)
6. **Testing**: Write tests for critical endpoints
7. **Documentation**: Keep API documentation up to date
