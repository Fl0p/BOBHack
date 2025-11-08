# Frontend Development

Guide for developing the frontend portion of the project.

## Development Startup

```bash
# From project root
yarn dev:frontend

# Or directly from workspace
yarn workspace frontend dev

# Or run both frontend and backend
yarn dev
```

The application will open at `http://localhost:3000` with hot reload.

## Adding New Components

1. Create component folder:

```bash
mkdir -p packages/frontend/src/components/MyComponent
```

2. Create component files:

```typescript
// packages/frontend/src/components/MyComponent/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```

3. Add styles (if needed):

```css
/* packages/frontend/src/components/MyComponent/MyComponent.css */
.my-component {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.my-component h2 {
  margin: 0 0 10px 0;
}
```

4. Use the component:

```typescript
import { MyComponent } from './components/MyComponent/MyComponent';

function App() {
  return (
    <MyComponent
      title="Hello"
      onAction={() => console.log('Action!')}
    />
  );
}
```

## Working with API

### Simple fetch

```typescript
const response = await fetch('/api/endpoint');
const data = await response.json();
```

### Custom hook for API

Create `src/hooks/useApi.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
```

Usage:

```typescript
function App() {
  const { data, loading, error } = useApi<{ message: string }>('/api/hello');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.message}</div>;
}
```

### Advanced API utility

Create `src/utils/api.ts`:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || '';

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}
```

## Styling

### CSS Modules

Rename `App.css` to `App.module.css`:

```css
/* App.module.css */
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  color: #333;
}
```

Usage:

```typescript
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Title</h1>
    </div>
  );
}
```

### CSS-in-JS Libraries

You can add styled-components or emotion:

```bash
yarn workspace frontend add styled-components
yarn workspace frontend add -D @types/styled-components
```

Example with styled-components:

```typescript
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background: #f5f5f5;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
`;

function App() {
  return (
    <Container>
      <Title>Hello World</Title>
    </Container>
  );
}
```

### Tailwind CSS

```bash
yarn workspace frontend add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Routing

For multi-page applications, add React Router:

```bash
yarn workspace frontend add react-router-dom
```

Example:

```typescript
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## State Management

For complex state management, consider:
- **Zustand** - lightweight and simple
- **Redux Toolkit** - full-featured
- **Jotai** - atomic state
- **React Query** - for server state

### Zustand Example

```bash
yarn workspace frontend add zustand
```

```typescript
import { create } from 'zustand';

interface Store {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {
  const { count, increment, decrement } = useStore();
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

## Testing

Add Vitest and React Testing Library:

```bash
yarn workspace frontend add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

Example test:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders hello message', () => {
    render(<App />);
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
  });
});
```

## Debugging

### React DevTools

Install browser extension:
- [Chrome/Edge](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Console Logging

```typescript
console.log('Debug:', data);
console.error('Error:', error);
console.table(arrayData);
```

### Vite Inspector

```bash
yarn workspace frontend add -D vite-plugin-inspect
```

Add to `vite.config.ts`:
```typescript
import Inspect from 'vite-plugin-inspect';

export default defineConfig({
  plugins: [react(), Inspect()],
});
```

Visit `http://localhost:3000/__inspect/` to inspect the build.

## Building for Production

```bash
yarn workspace frontend build
```

Output will be in `packages/frontend/dist/`.

### Preview Production Build

```bash
yarn workspace frontend preview
```

### Docker Production Build

```bash
# Build Docker image
docker build -t bobhack-frontend ./packages/frontend

# Run container
docker run -p 80:80 bobhack-frontend

# Or use docker-compose
docker-compose up -d frontend
```

## Performance Optimization

### Code Splitting

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### React.memo

```typescript
import { memo } from 'react';

interface Props {
  title: string;
}

export const ExpensiveComponent = memo(function ExpensiveComponent({ title }: Props) {
  return <div>{title}</div>;
});
```

### useMemo and useCallback

```typescript
import { useMemo, useCallback } from 'react';

function Component({ items }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <div>{/* ... */}</div>;
}
```

## Best Practices

1. **Type Safety**: Always use TypeScript types
2. **Component Organization**: Split into small, reusable components
3. **Custom Hooks**: Extract logic into custom hooks
4. **Clear Naming**: Use descriptive names for variables and functions
5. **Optimization**: Use React.memo for render optimization
6. **Error Handling**: Handle errors in API requests
7. **Accessibility**: Use semantic HTML and ARIA attributes
8. **Testing**: Write tests for critical components
9. **Code Style**: Use consistent formatting (consider Prettier)
10. **Documentation**: Document complex components and functions
