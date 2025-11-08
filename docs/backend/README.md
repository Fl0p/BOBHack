# Backend Documentation

Express.js server for the BOBHack project.

## Table of Contents

- [API Endpoints](./api-endpoints.md) - All API endpoints documentation
- [Server Configuration](./configuration.md) - Settings and configuration
- [Development](./development.md) - Backend development guide

## Technologies

- **Express.js** - Web framework
- **TypeScript** - Programming language
- **CORS** - Middleware for cross-origin requests
- **tsx** - TypeScript execution for development

## Structure

```
packages/backend/
├── src/
│   └── index.ts          # Main application file
├── dist/                 # Compiled code (generated)
├── Dockerfile            # Docker container configuration
├── .dockerignore         # Docker build exclusions
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Quick Commands

### Development
```bash
# Development with hot reload
yarn workspace backend dev

# Or from project root
yarn dev:backend
```

### Building
```bash
# Compile TypeScript to JavaScript
yarn workspace backend build
```

### Production
```bash
# Run compiled production version
yarn workspace backend start
```

### Docker
```bash
# Build Docker image
docker build -t bobhack-backend ./packages/backend

# Run container
docker run -p 3001:3001 bobhack-backend

# Or use docker-compose
docker-compose up backend
```

## Port

Backend runs on port **3001**.

## Environment Variables

See [Server Configuration](./configuration.md) for details on environment variables and `.env` setup.
