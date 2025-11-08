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

The `.env.example` file includes comprehensive configuration sections:

#### Domain Configuration
```env
BACKEND_URL=https://api.aignite.pl
FRONTEND_URL=https://bob.aignite.pl
DIFY_URL=https://dify.aignite.pl
DIFY_HOST=dify.aignite.pl
```

#### Database Configuration
```env
DB_USERNAME=dify
DB_DATABASE=dify
DB_PLUGIN_DATABASE=dify_plugin
DIFY_DB_PASSWORD=<strong-password>
```

#### Redis Configuration
```env
REDIS_PASSWORD=<strong-password>
```

#### Security Keys
```env
# Main Dify secret key - CRITICAL: Change for production!
DIFY_SECRET_KEY=<generated-key>

# Plugin security keys
PLUGIN_DAEMON_KEY=<generated-key>
PLUGIN_DIFY_INNER_API_KEY=<generated-key>

# Sandbox API key
SANDBOX_API_KEY=<generated-key>

# Vector store API key
WEAVIATE_API_KEY=<generated-key>
```

#### Migration & Deployment
```env
DIFY_MIGRATION_ENABLED=true  # Set to false after first run
DEPLOY_ENV=PRODUCTION
```

#### Storage & Vector Store
```env
STORAGE_TYPE=local
VECTOR_STORE=weaviate
WEAVIATE_ENDPOINT=http://weaviate:8080
WEAVIATE_API_KEY=<generated-key>
```

#### Sandbox Configuration
```env
SANDBOX_ENABLE_NETWORK=true
SANDBOX_WORKER_TIMEOUT=15
SANDBOX_GIN_MODE=release
```

#### Plugin System
```env
MARKETPLACE_ENABLED=false
PLUGIN_DAEMON_PORT=5002
PLUGIN_DEBUGGING_PORT=5003
EXPOSE_PLUGIN_DEBUGGING_PORT=5003
```

#### Logging
```env
LOG_LEVEL=INFO
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
2. Generate strong random keys using secure methods:
   ```bash
   # For DIFY_SECRET_KEY (hex format)
   openssl rand -hex 32

   # For other keys (base64 format)
   openssl rand -base64 32
   ```
3. Change ALL default passwords and keys in `.env.example`
4. Required security keys to generate:
   - `DIFY_SECRET_KEY` - Main application secret
   - `DIFY_DB_PASSWORD` - PostgreSQL password
   - `REDIS_PASSWORD` - Redis authentication
   - `PLUGIN_DAEMON_KEY` - Plugin system security
   - `PLUGIN_DIFY_INNER_API_KEY` - Internal plugin API
   - `SANDBOX_API_KEY` - Sandbox authentication
   - `WEAVIATE_API_KEY` - Vector store authentication
5. Restrict CORS origins to your actual frontend domain
6. Use HTTPS in production (handled by Cloudflare Tunnel)
7. Rotate credentials regularly (at least every 90 days)
8. Enable Redis authentication (already configured in docker-compose.yml)
9. Use internal Docker networks for service isolation
10. Review SSRF proxy configuration for production use

## Network Security

### Docker Networks

The setup uses two Docker networks:
- **bobhack-network**: Main network for public-facing services
- **ssrf_proxy_network**: Internal network for sandbox and SSRF proxy (isolated)

Services on the internal network cannot directly access external resources, enhancing security.

### SSRF Protection

The SSRF proxy filters requests from the sandbox to prevent:
- Server-Side Request Forgery attacks
- Unauthorized access to internal services
- Exposure of sensitive internal infrastructure

Configuration: `ssrf_proxy/squid.conf.template`
