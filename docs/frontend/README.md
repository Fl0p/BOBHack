# Frontend Documentation

React + Vite application for the BOBHack project.

## Table of Contents

- [Components](./components.md) - React components description
- [Vite Configuration](./vite-configuration.md) - Vite settings
- [Development](./development.md) - Frontend development guide

## Technologies

- **React 18** - UI library
- **TypeScript** - Programming language
- **Vite** - Build tool and dev server

## Structure

```
packages/frontend/
├── src/
│   ├── main.tsx          # Application entry point
│   ├── App.tsx           # Main component
│   └── App.css           # Styles
├── public/               # Static files
├── dist/                 # Built application (generated)
├── Dockerfile            # Docker container configuration
├── .dockerignore         # Docker build exclusions
├── nginx.conf            # Production web server config
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration with proxy
```

## Quick Commands

### Development
```bash
# Development mode with hot reload
yarn workspace frontend dev

# Or from project root
yarn dev:frontend

# Or run both frontend and backend
yarn dev
```

### Building
```bash
# Build for production
yarn workspace frontend build
```

### Preview
```bash
# Preview production build locally
yarn workspace frontend preview
```

### Docker
```bash
# Build Docker image
docker build -t bobhack-frontend ./packages/frontend

# Run container
docker run -p 80:80 bobhack-frontend

# Or use docker-compose
docker-compose up frontend
```

## Port

- **Development**: Port **3000**
- **Production (Docker)**: Port **80** (nginx)

## API Integration

Frontend communicates with the backend via:
- **Development**: Vite proxy forwards `/api/*` to `http://localhost:3001`
- **Production**: Direct requests to `https://api.aignite.pl`

See [Vite Configuration](./vite-configuration.md) for proxy setup details.
