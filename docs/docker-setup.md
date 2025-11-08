# docker setup guide

## overview

This setup includes:
- **frontend** (React + Vite) → `bob.aignite.pl`
- **backend** (Express API) → `api.aignite.pl`
- **dify** (AI Platform) → `dify.aignite.pl`
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
6. Update `.cloudflared/config.yaml` with your credentials filename:
   ```yaml
   tunnel: aignite-local
   credentials-file: /etc/cloudflared/YOUR-TUNNEL-ID.json

   ingress:
     - hostname: bob.aignite.pl
       service: http://frontend:80
     - hostname: api.aignite.pl
       service: http://backend:3001
     - hostname: dify.aignite.pl
       service: http://dify-web:3000
     - hostname: dify-api.aignite.pl
       service: http://dify-api:5001
     - service: http_status:404
   ```
7. The configuration supports:
   - `bob.aignite.pl` → Frontend (React app)
   - `api.aignite.pl` → Backend (Express API)
   - `dify.aignite.pl` → Dify Web Console
   - `dify-api.aignite.pl` → Dify API (direct access)

### 2. environment configuration

```bash
# copy example env file
cp .env.example .env

# edit .env and add your values
nano .env
```

Required variables:
- `CLOUDFLARE_TUNNEL_TOKEN` - from Cloudflare dashboard
- `DIFY_SECRET_KEY` - generate strong random key
- `DIFY_DB_PASSWORD` - generate strong password

### 3. update frontend api url

The frontend API URL is configured as a build argument in `docker-compose.yml`:
```yaml
frontend:
  build:
    context: ./packages/frontend
    dockerfile: Dockerfile
    args:
      - VITE_API_URL=https://api.aignite.pl
```

This value is then used during the Docker build in `packages/frontend/Dockerfile`:
```dockerfile
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
```

To change the API URL:
1. Edit `docker-compose.yml` and update the `VITE_API_URL` build argument
2. Rebuild the frontend container: `docker-compose build frontend`

**Note**: In development mode (without Docker), the frontend uses Vite proxy and connects to `http://localhost:3001`. The `VITE_API_URL` environment variable is only needed for production builds.

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
- **dify-worker**: Background worker
- **dify-db**: PostgreSQL database
- **dify-redis**: Redis cache
- Public URL: `https://dify.aignite.pl`

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

# verify tunnel token is set
docker-compose exec cloudflared env | grep TUNNEL_TOKEN
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

## development vs production

For development, you can run services locally without Docker:
```bash
# development mode (local)
yarn dev

# production mode (docker)
docker-compose up -d
```

