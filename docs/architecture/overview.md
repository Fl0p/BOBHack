# Project Architecture Overview

## Overview

BOBHack is a full-stack application built on a monorepo architecture using Yarn 4 workspaces with Docker support for production deployment.

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **tsx** - TypeScript execution for development

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript

### Infrastructure
- **Docker** - Containerization for all services
- **Docker Compose** - Multi-service orchestration
- **Cloudflare Tunnel** - Secure domain routing with SSL termination
- **Dify Platform** - AI platform integration
  - API Service
  - Worker Service (Celery)
  - Beat Scheduler (Celery Beat)
  - Web Console
  - PostgreSQL Database
  - Redis Cache
  - Code Execution Sandbox
  - Plugin Daemon System
  - SSRF Protection Proxy (Squid)
  - Weaviate Vector Store (optional)

## Project Structure

```
BOBHack/
├── packages/
│   ├── backend/           # Express API server
│   │   ├── Dockerfile     # Backend container configuration
│   │   └── src/           # Backend source code
│   └── frontend/          # React application
│       ├── Dockerfile     # Frontend container configuration
│       ├── nginx.conf     # Production web server config
│       ├── vite-env.d.ts  # TypeScript env variable types
│       └── src/           # Frontend source code
├── extension/             # Browser extension
│   ├── manifest.json      # Extension manifest (v3)
│   ├── contentScript.js   # Content script entry point
│   ├── background/        # Background service scripts
│   └── content/           # Content script modules
├── example/               # Dify deployment examples
│   ├── docker-compose*    # Example deployment configs
│   ├── nginx/             # Nginx configuration templates
│   ├── certbot/           # SSL certificate automation
│   └── volumes/           # Volume configuration examples
├── .cloudflared/          # Cloudflare Tunnel configuration
│   └── config.yaml        # Tunnel routing and ingress rules
├── ssrf_proxy/            # SSRF protection configuration
│   ├── squid.conf         # Squid proxy configuration
│   └── docker-entrypoint.sh # Proxy initialization script
├── volumes/               # Docker volume mounts
│   ├── sandbox/           # Sandbox configuration
│   └── plugin_daemon/     # Plugin storage
├── .github/workflows/     # CI/CD pipelines
│   └── build.yml          # Build and deployment workflow
├── scripts/               # Deployment scripts
│   └── rebuild-and-start.sh # Rebuild and restart script
├── docs/                  # Documentation
├── docker-compose.yml     # Multi-service orchestration
├── .dockerignore          # Docker build exclusions
├── .env.example           # Environment variables template
└── package.json           # Workspace configuration
```

## Architecture Principles

1. **Monorepo**: All code in a single repository managed through Yarn workspaces
2. **Separation of Concerns**: Backend and frontend are independent packages
3. **Type Safety**: TypeScript used across the entire stack
4. **Development Experience**: Concurrent service execution for easy development
5. **Containerization**: Docker-based deployment for consistency and scalability
6. **AI Integration**: Dify platform for AI capabilities

## Deployment Modes

### Development Mode
- Services run locally with hot reload
- Vite proxy forwards `/api` requests to backend
- Ports: Frontend (3000), Backend (3001)

### Production Mode (Docker)
- All services containerized
- Cloudflare Tunnel for domain routing
- Services: frontend, backend, dify (API, Worker, Web, DB, Redis)
- Domains:
  - `bob.aignite.pl` → Frontend
  - `api.aignite.pl` → Backend
  - `dify.aignite.pl` → Dify AI Platform

## Data Flow

### Development
```
Browser → Vite Dev Server → Vite Proxy → Backend API → Response → Browser
```

### Production
```
Browser → Cloudflare Tunnel → nginx (Frontend) or Express (Backend) → Response → Browser
```

See [Service Communication](./communication.md) for details.

## External Services

### Dify AI Platform
- **API Service**: AI model endpoints (port 5001)
- **Worker**: Background job processing (Celery)
- **Beat Scheduler**: Task scheduling (Celery Beat)
- **Web Console**: Admin interface (port 3000)
- **PostgreSQL**: Data storage
- **Redis**: Caching and queue management (with authentication)
- **Sandbox**: Isolated code execution environment (port 8194)
- **Plugin Daemon**: Plugin management system (port 5002)
- **SSRF Proxy**: Request filtering and protection (port 3128)
- **Weaviate**: Vector database for embeddings (port 8080, optional)

### Cloudflare Tunnel
- Secure domain routing without exposing ports
- Automatic HTTPS with SSL termination
- Zero Trust security model
- Path-based routing for unified domain approach
- Extended timeouts for streaming and long-running requests (60-120s)
- Support for Server-Sent Events (SSE) and streaming responses

### Security Features
- **SSRF Protection**: Squid proxy filters outbound requests from sandbox
- **Network Isolation**: Internal networks for sensitive services
- **Authentication**: Redis, Weaviate, Plugin Daemon, Sandbox all use API keys
- **Secret Management**: Centralized .env configuration with strong key generation recommendations
