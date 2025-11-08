# Vite Configuration

Documentation for Vite configuration in the frontend application.

## Configuration File

**Location**: `packages/frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

## Plugins

### @vitejs/plugin-react

Official plugin for React support:
- Fast Refresh (hot reload)
- JSX/TSX transformation
- React optimization in production

## Dev Server

### Port

```typescript
server: {
  port: 3000
}
```

Development server runs on port 3000.

### Host

To access from local network, add:

```typescript
server: {
  host: true,
  port: 3000
}
```

This allows access from devices on the same network using your local IP address.

### HTTPS (Optional)

For HTTPS in development:

```typescript
server: {
  https: true,
  port: 3000
}
```

## Proxy Configuration

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
}
```

### Parameters

- **'/api'**: All requests starting with `/api` will be proxied
- **target**: Backend server URL
- **changeOrigin**: Changes the origin header of the request to the target URL

### How it Works

1. Frontend makes a request: `fetch('/api/hello')`
2. Vite intercepts the request
3. Forwards to: `http://localhost:3001/api/hello`
4. Returns response to frontend

See [Service Communication](../architecture/communication.md) for more details.

### Multiple Proxy Targets

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
  '/auth': {
    target: 'http://localhost:3002',
    changeOrigin: true,
  },
}
```

## Additional Configuration

### Path Aliases

```typescript
resolve: {
  alias: {
    '@': '/src',
    '@components': '/src/components',
    '@utils': '/src/utils',
    '@hooks': '/src/hooks',
    '@types': '/src/types',
  },
}
```

Usage:
```typescript
import { Button } from '@components/Button';
import { useFetch } from '@hooks/useFetch';
```

**Note**: Also update `tsconfig.json` for TypeScript support:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

### Environment Variables

Create a `.env` file (optional for development):

```env
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=BOBHack
```

Usage in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || '';
const title = import.meta.env.VITE_APP_TITLE;

// Example: Dynamic API URL usage
fetch(`${apiUrl}/api/endpoint`)
```

**Important**:
- All variables must start with `VITE_` to be accessible in client code
- TypeScript types for env variables are defined in `vite-env.d.ts`:
  ```typescript
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
  }
  ```
- In development, `VITE_API_URL` defaults to empty string (uses Vite proxy)
- In production (Docker), `VITE_API_URL` is set during build via build argument

### Environment Files

- `.env` - Loaded in all cases
- `.env.local` - Loaded in all cases, ignored by git
- `.env.development` - Only loaded in development
- `.env.production` - Only loaded in production

### Build Optimization

```typescript
build: {
  outDir: 'dist',
  sourcemap: true,
  minify: 'terser',
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'router': ['react-router-dom'],
      },
    },
  },
  chunkSizeWarningLimit: 1000,
}
```

### CSS Configuration

```typescript
css: {
  modules: {
    localsConvention: 'camelCase',
  },
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@/styles/variables.scss";`
    }
  }
}
```

## Modes

- **Development**: `yarn dev` - with hot reload and no minification
- **Production**: `yarn build` - optimized build
- **Preview**: `yarn preview` - preview production build locally

## Docker Production Configuration

In Docker, the frontend is built and served by nginx (see `packages/frontend/nginx.conf`):

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

The API URL is configured via environment variable during build:
```dockerfile
ENV VITE_API_URL=https://api.aignite.pl
```

## Useful Links

- [Vite Documentation](https://vitejs.dev/)
- [Vite React Plugin](https://github.com/vitejs/vite-plugin-react)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
