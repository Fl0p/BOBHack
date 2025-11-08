# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BOBHack is a full-stack application using Yarn 4 workspaces with a Node.js/Express backend and React/Vite frontend.

## Architecture

### Monorepo Structure
- **Yarn 4 Workspaces**: This project uses Yarn 4.10.3 with a workspace setup under `packages/*`
- **Backend** (`packages/backend`): Express server on port 3001
- **Frontend** (`packages/frontend`): React + Vite on port 3000

### Communication Flow
- Frontend proxies `/api/*` requests to backend via Vite's proxy configuration (packages/frontend/vite.config.ts:8-12)
- Backend enables CORS for cross-origin requests
- API endpoints are defined in packages/backend/src/index.ts

## Development Commands

### Setup
```bash
# Enable Yarn 4.10.3
corepack enable
corepack prepare yarn@4.10.3 --activate

# Install all workspace dependencies
yarn install
```

### Running the Application
```bash
# Run both backend and frontend concurrently
yarn dev

# Run backend only (http://localhost:3001)
yarn dev:backend

# Run frontend only (http://localhost:3000)
yarn dev:frontend
```

### Building
```bash
# Build backend (TypeScript compilation)
yarn workspace backend build

# Build frontend (TypeScript + Vite build)
yarn workspace frontend build
```

### Individual Workspace Commands
```bash
# Run commands in specific workspace
yarn workspace backend <command>
yarn workspace frontend <command>

# Example: Start production backend
yarn workspace backend start
```

## Technology Stack

### Backend
- Node.js with ES modules (`"type": "module"`)
- Express.js for API server
- TypeScript
- tsx for development with hot reload
- CORS middleware enabled

### Frontend
- React 18
- TypeScript
- Vite for build tooling and dev server
- Vite proxy configured to forward `/api` requests to backend

## Key Configuration Files

- Root `package.json`: Workspace definitions and concurrent dev script
- `packages/backend/package.json`: Backend dependencies and scripts
- `packages/frontend/package.json`: Frontend dependencies and scripts
- `packages/frontend/vite.config.ts`: Vite config with proxy to backend at port 3001
