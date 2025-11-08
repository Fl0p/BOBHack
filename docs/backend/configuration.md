# Backend Configuration

## Environment Variables

The project includes a `.env.example` file in the root directory that provides templates for all required environment variables.

### Setup

```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env
```

### Environment Variables Structure

The `.env.example` file includes:

```env
# Cloudflare Tunnel Token
# Get this from Cloudflare Zero Trust dashboard: Access → Tunnels → Your Tunnel → Configure
CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token-here

# Dify Security Keys
# Generate strong random keys for production (use: openssl rand -hex 32)
DIFY_SECRET_KEY=your-secret-key-change-me-use-openssl-rand-hex-32
DIFY_DB_PASSWORD=your-strong-db-password-change-me

# Domain Configuration (for reference)
FRONTEND_URL=https://bob.aignite.pl
BACKEND_URL=https://api.aignite.pl
DIFY_URL=https://dify.aignite.pl
```

### Backend-Specific Configuration

Currently, the backend is configured with hardcoded values, but it's recommended to use environment variables:

```env
PORT=3001
NODE_ENV=development
```

## Server Port

Current port is defined in `packages/backend/src/index.ts:5`:

```typescript
const PORT = 3001;
```

Recommended to use environment variable:

```typescript
const PORT = process.env.PORT || 3001;
```

## Middleware

### CORS

CORS configuration in `packages/backend/src/index.ts:7`:

```typescript
app.use(cors());
```

By default, all origins are allowed. For production, it's recommended to restrict:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

### Body Parser

Express built-in JSON parser:

```typescript
app.use(express.json());
```

## TypeScript Configuration

The `packages/backend/tsconfig.json` file contains TypeScript compiler settings for the backend.

Key settings:
- **target**: ES version for compilation
- **module**: Module system type (ESM)
- **outDir**: Directory for compiled files (`dist/`)

## Package.json Configuration

```json
{
  "type": "module"
}
```

This means the project uses ES modules (import/export) instead of CommonJS (require/module.exports).

## Docker Configuration

### Development
Backend runs with hot reload using `tsx`:
```bash
yarn dev:backend
```

### Production (Docker)
The backend is containerized using a multi-stage Dockerfile:

1. **Builder stage**: Installs dependencies and compiles TypeScript
2. **Production stage**: Contains only production dependencies and compiled code

Environment variables in Docker:
```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
```

See [Docker Setup Guide](../docker-setup.md) for details.

## Security Considerations

⚠️ **Important for Production:**

1. Never commit `.env` files to version control (already in `.gitignore`)
2. Use strong random keys for `DIFY_SECRET_KEY` (minimum 32 characters)
3. Change default database passwords
4. Restrict CORS origins to your actual frontend domain
5. Use HTTPS in production (handled by Cloudflare Tunnel)
6. Rotate credentials regularly
