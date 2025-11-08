# React Components

Documentation for React components in the frontend application.

## Component Structure

Currently, the application has a simple structure with one main component.

## App

**Location**: `packages/frontend/src/App.tsx`

The main application component.

### Functionality

- Displays a welcome message
- Fetches data from backend via `/api/hello` API
- Displays the received message

### Code

```typescript
function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="App">
      <h1>Hello World from Frontend!</h1>
      <p>{message}</p>
    </div>
  );
}
```

### Props

This component does not accept props.

### State

- `message: string` - Message received from backend

### Effects

- Fetches data when component mounts

---

## Adding New Components

### Recommended Structure

```
packages/frontend/src/
├── components/
│   ├── common/              # Shared components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.css
│   │   │   └── Button.test.tsx
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── Header.css
│   │   └── Footer/
│   │       ├── Footer.tsx
│   │       └── Footer.css
│   └── features/            # Feature-specific components
│       ├── UserProfile/
│       └── Dashboard/
├── pages/                   # Page components (for routing)
│   ├── Home.tsx
│   ├── About.tsx
│   └── NotFound.tsx
├── hooks/                   # Custom React hooks
│   ├── useApi.ts
│   ├── useFetch.ts
│   └── useAuth.ts
├── utils/                   # Utility functions
│   ├── api.ts
│   └── format.ts
├── types/                   # TypeScript type definitions
│   └── index.ts
└── constants/               # Application constants
    └── config.ts
```

### Component Creation Example

**Basic Component**:
```typescript
// src/components/common/Header/Header.tsx
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}
```

**Component with Children**:
```typescript
// src/components/common/Button/Button.tsx
import { ReactNode } from 'react';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### Usage

```typescript
import { Header } from './components/common/Header/Header';
import { Button } from './components/common/Button/Button';

function App() {
  const handleClick = () => {
    console.log('Button clicked');
  };

  return (
    <div>
      <Header title="BOBHack" subtitle="Welcome to our app" />
      <Button onClick={handleClick} variant="primary">
        Click Me
      </Button>
    </div>
  );
}
```

## Custom Hooks Example

```typescript
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
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

**Usage**:
```typescript
function UserProfile() {
  const { data, loading, error } = useFetch<User>('/api/user/123');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.name}</div>;
}
```

## Best Practices

1. **TypeScript**: Always type props, state, and return values
2. **Component Organization**: Create separate folders for each component
3. **Naming Conventions**:
   - Use PascalCase for components
   - Use camelCase for functions and variables
   - Use kebab-case for CSS files
4. **Props Interface**: Define interfaces for all props
5. **Exports**: Use named exports for better readability and refactoring
6. **Single Responsibility**: Each component should do one thing well
7. **Composition**: Build complex UIs from simple components
8. **Prop Destructuring**: Destructure props in function parameters
9. **Default Props**: Use default parameters for optional props
10. **Testing**: Write tests for critical components
