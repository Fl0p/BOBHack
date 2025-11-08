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
3. Create a new tunnel
4. Configure public hostnames:
   - `bob.aignite.pl` → `http://frontend:80`
   - `api.aignite.pl` → `http://backend:3001`
   - `dify.aignite.pl` → `http://dify-web:3000`
5. Copy the tunnel token

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

Edit `packages/frontend/Dockerfile` if needed to set correct API URL:
```dockerfile
ENV VITE_API_URL=https://api.aignite.pl
```

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

