# docker setup guide

## overview

This setup includes:
- **frontend** (React + Vite) → `bob.aignite.pl`
- **backend** (Express API) → `api.aignite.pl`
- **dify** (AI Platform) → `dify.aignite.pl`
  - API service
  - Web console
  - Worker service
  - Beat scheduler (Celery Beat)
  - PostgreSQL database
  - Redis cache
  - Sandbox for code execution
  - Plugin daemon system
  - SSRF proxy for security
  - Weaviate vector store (optional)
- **cloudflare tunnel** for domain routing

## prerequisites

1. Docker and Docker Compose installed
2. Cloudflare account with Zero Trust configured
3. Domains configured in Cloudflare

## setup steps

### 1. configure cloudflare tunnel

1. Go to Cloudflare Zero Trust Dashboard
2. Navigate to Access → Tunnels
3. Create a new tunnel (or use existing tunnel "aignite-local")
4. Download the tunnel credentials JSON file
5. Place the credentials file in `.cloudflared/` directory
6. Update `.cloudflared/config.yaml` with your credentials filename

**Important**: The configuration now uses a unified domain approach for Dify. All API endpoints are served under `dify.aignite.pl` with path-based routing:

The configuration supports:
- `bob.aignite.pl` → Frontend (React app)
- `api.aignite.pl` → Backend (Express API)
- `dify.aignite.pl` → Dify platform with path-based routing:
  - `/console/api/*` → Console API
  - `/api/*` → Public API
  - `/v1/*` → v1 API
  - `/files/*` → File uploads/downloads
  - `/internal/*` → Internal API for SSE (Server-Sent Events)
  - `/` (root) → Web Console

Enhanced timeout and streaming support:
- API endpoints use 60-120s connection timeouts
- Disabled chunked encoding for better compatibility
- SSE endpoints support streaming responses

### 2. environment configuration

```bash
# copy example env file
cp .env.example .env

# edit .env and add your values
nano .env
```

Required variables:
- `BACKEND_URL` - backend API URL (e.g., https://api.aignite.pl)
- `DIFY_SECRET_KEY` - generate strong random key (use: `openssl rand -hex 32`)
- `DIFY_DB_PASSWORD` - PostgreSQL database password
- `REDIS_PASSWORD` - Redis cache password
- `PLUGIN_DAEMON_KEY` - Plugin daemon security key
- `PLUGIN_DIFY_INNER_API_KEY` - Internal plugin API key
- `SANDBOX_API_KEY` - Code sandbox API key
- `WEAVIATE_API_KEY` - Weaviate vector store API key (if using Weaviate)

Optional variables:
- `VECTOR_STORE` - Vector database type (default: weaviate)
- `STORAGE_TYPE` - Storage backend (default: local)
- `LOG_LEVEL` - Logging level (default: INFO)
- `MARKETPLACE_ENABLED` - Enable plugin marketplace (default: false)

### 3. update frontend api url

The frontend API URL is configured via the `BACKEND_URL` environment variable in `.env`:
```env
BACKEND_URL=https://api.aignite.pl
```

This value is passed as a build argument in `docker-compose.yml`:
```yaml
frontend:
  build:
    args:
      - VITE_API_URL=${BACKEND_URL}
```

To change the API URL:
1. Edit `.env` and update the `BACKEND_URL` variable
2. Rebuild the frontend container: `docker-compose build frontend`

**Note**: In development mode (without Docker), the frontend uses Vite proxy and connects to `http://localhost:3001`. The `BACKEND_URL` environment variable is only needed for production builds.

### 4. build and run

```bash
# build all services
docker-compose build

# start all services
docker-compose up -d

# view logs
docker-compose logs -f

# check status
docker-compose ps
```

### 5. initialize dify

1. Wait for all services to be healthy
2. Access `https://dify.aignite.pl`
3. Complete initial setup wizard
4. Create admin account

## service details

### frontend
- Container: `bobhack-frontend`
- Internal port: 80
- Public URL: `https://bob.aignite.pl`

### backend
- Container: `bobhack-backend`
- Internal port: 3001
- Public URL: `https://api.aignite.pl`

### dify services
- **dify-web**: Web console (port 3000)
- **dify-api**: API service (port 5001)
- **dify-worker**: Background worker (Celery worker)
- **dify-worker-beat**: Task scheduler (Celery Beat)
- **dify-db**: PostgreSQL database
- **dify-redis**: Redis cache
- **sandbox**: Code execution sandbox (port 8194)
- **plugin_daemon**: Plugin management system (port 5002)
- **ssrf_proxy**: SSRF protection proxy (Squid, port 3128)
- **weaviate**: Vector database (port 8080, optional profile)
- Public URL: `https://dify.aignite.pl`

## advanced features

### vector database profiles

The Weaviate vector store is available as an optional Docker Compose profile:

```bash
# start with weaviate vector store
docker-compose --profile weaviate up -d

# check weaviate status
docker-compose exec weaviate curl -f http://localhost:8080/v1/.well-known/ready
```

### plugin system

The plugin daemon enables extending Dify with custom plugins:
- Plugin daemon runs on port 5002
- Remote plugin debugging available on port 5003 (configurable via `EXPOSE_PLUGIN_DEBUGGING_PORT`)
- Plugins stored in `./volumes/plugin_daemon/`
- Marketplace disabled by default (set `MARKETPLACE_ENABLED=true` to enable)

### code execution sandbox

The sandbox service provides secure code execution:
- Runs in isolated environment with configurable network access
- HTTP/HTTPS proxy through SSRF proxy for security
- Configurable worker timeout (default: 15s)
- Python dependencies can be mounted via `./volumes/sandbox/dependencies/`

### ssrf protection

The SSRF proxy (Squid) protects against Server-Side Request Forgery attacks:
- Filters outbound requests from sandbox
- Configurable via `ssrf_proxy/squid.conf.template`
- Automatically generates SSL certificates for HTTPS inspection
- Logs redirected to Docker logs

## management commands

```bash
# stop all services
docker-compose down

# stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# restart specific service
docker-compose restart frontend

# view logs for specific service
docker-compose logs -f backend

# rebuild after code changes
docker-compose build frontend
docker-compose up -d frontend

# update dify to latest version
docker-compose pull dify-api dify-web dify-worker
docker-compose up -d dify-api dify-web dify-worker
```

## troubleshooting

### check service health
```bash
docker-compose ps
docker-compose logs [service-name]
```

### database connection issues
```bash
# check if database is ready
docker-compose exec dify-db pg_isready -U dify

# access database
docker-compose exec dify-db psql -U dify -d dify
```

### cloudflare tunnel not working
```bash
# check tunnel logs
docker-compose logs cloudflared

# verify credentials file exists
docker-compose exec cloudflared ls -la /etc/cloudflared/
```

### reset dify data
```bash
docker-compose down
docker volume rm bobhack_dify-db-data bobhack_dify-redis-data bobhack_dify-api-storage
docker-compose up -d
```

## security notes

⚠️ **important**: Before deploying to production:

1. Change all default passwords in `.env`
2. Generate strong `DIFY_SECRET_KEY`
3. Review and restrict CORS settings in `docker-compose.yml`
4. Enable HTTPS only in Cloudflare
5. Configure Cloudflare firewall rules
6. Set up regular database backups

## backup

### backup dify data
```bash
# backup database
docker-compose exec dify-db pg_dump -U dify dify > dify_backup_$(date +%Y%m%d).sql

# backup volumes
docker run --rm -v bobhack_dify-api-storage:/data -v $(pwd):/backup alpine tar czf /backup/dify_storage_$(date +%Y%m%d).tar.gz /data
```

### restore dify data
```bash
# restore database
cat dify_backup_20241108.sql | docker-compose exec -T dify-db psql -U dify dify

# restore volumes
docker run --rm -v bobhack_dify-api-storage:/data -v $(pwd):/backup alpine tar xzf /backup/dify_storage_20241108.tar.gz -C /
```

## dify deployment examples

The `example/` directory contains comprehensive Dify deployment examples and templates:

### contents
- **docker-compose templates**: Various deployment configurations
- **nginx configs**: Reverse proxy and SSL setup
- **certbot**: SSL certificate management
- **vector database configs**: ElasticSearch, Couchbase, PGVector, TiDB, MyScale, OpenSearch, OceanBase
- **middleware configs**: Standalone middleware setup for development
- **startup scripts**: Initialization and user setup scripts

### usage
The example directory is based on official Dify deployment templates and provides:
1. Reference implementations for different vector stores
2. SSL/TLS certificate automation with Certbot
3. Production-ready nginx configurations
4. Database initialization scripts
5. Middleware-only deployment for local development

Refer to `example/README.md` for detailed deployment instructions.

## development vs production

For development, you can run services locally without Docker:
```bash
# development mode (local)
yarn dev

# production mode (docker)
docker-compose up -d
```

