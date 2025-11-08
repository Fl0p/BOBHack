# Workspace Structure

## Yarn 4 Workspaces

The project uses Yarn 4.10.3 with workspaces feature for monorepo management.

## Configuration

In the root `package.json`:

```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

## Packages

### Backend (`packages/backend`)
- **Port**: 3001
- **Purpose**: REST API server
- **Entry Point**: `src/index.ts`
- **Docker**: Multi-stage build with Node.js 20
- **Production**: Runs compiled JavaScript from `dist/`

### Frontend (`packages/frontend`)
- **Port**: 3000 (dev), 80 (production)
- **Purpose**: React UI application
- **Entry Point**: `src/main.tsx`
- **Docker**: Multi-stage build with nginx
- **Production**: Serves static files via nginx

## Dependency Management

### Install Dependencies for Entire Project
```bash
yarn install
```

### Add Dependency to Specific Workspace
```bash
# Backend
yarn workspace backend add <package-name>

# Frontend
yarn workspace frontend add <package-name>
```

### Run Commands in Workspace
```bash
yarn workspace <workspace-name> <command>
```

### Examples
```bash
# Build backend
yarn workspace backend build

# Start backend in production mode
yarn workspace backend start

# Build frontend
yarn workspace frontend build

# Run backend tests
yarn workspace backend test
```

## Approach Benefits

1. **Unified Dependency Management**: Shared dependencies are not duplicated
2. **Consistent Versions**: Yarn ensures version consistency across packages
3. **Isolation**: Each package has its own dependencies and configuration
4. **Development Convenience**: Ability to run all services with one command
5. **Selective Builds**: Build only what changed
6. **Type Sharing**: Easy to share TypeScript types between packages (future enhancement)

## File Structure

```
packages/
├── backend/
│   ├── src/
│   │   └── index.ts          # Express server entry point
│   ├── dist/                 # Compiled JavaScript (gitignored)
│   ├── .dockerignore         # Docker build exclusions
│   ├── Dockerfile            # Backend container configuration
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript configuration
│
└── frontend/
    ├── src/
    │   ├── main.tsx          # React entry point
    │   ├── App.tsx           # Main component
    │   └── ...
    ├── dist/                 # Build output (gitignored)
    ├── .dockerignore         # Docker build exclusions
    ├── Dockerfile            # Frontend container configuration
    ├── nginx.conf            # Production web server config
    ├── package.json          # Frontend dependencies
    ├── tsconfig.json         # TypeScript configuration
    └── vite.config.ts        # Vite configuration with proxy
```

## Docker Integration

Each workspace has its own Dockerfile for containerized deployment:

### Backend Dockerfile
- **Stage 1 (builder)**: Install deps, compile TypeScript
- **Stage 2 (production)**: Only production deps and compiled code
- **Base Image**: node:20-alpine
- **Exposed Port**: 3001

### Frontend Dockerfile
- **Stage 1 (builder)**: Install deps, build with Vite
- **Stage 2 (production)**: nginx serving static files
- **Base Image**: node:20-alpine → nginx:alpine
- **Exposed Port**: 80

See [Docker Setup Guide](../docker-setup.md) for deployment instructions.
