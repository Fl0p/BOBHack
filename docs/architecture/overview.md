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
- **Cloudflare Tunnel** - Secure domain routing
- **Dify** - AI platform integration (PostgreSQL, Redis, API, Worker, Web Console)

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
├── .cloudflared/          # Cloudflare Tunnel configuration
│   └── config.yaml        # Tunnel routing and ingress rules
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
- **API Service**: AI model endpoints
- **Worker**: Background job processing
- **Web Console**: Admin interface
- **PostgreSQL**: Data storage
- **Redis**: Caching and queue management

### Cloudflare Tunnel
- Secure domain routing without exposing ports
- Automatic HTTPS
- Zero Trust security model
