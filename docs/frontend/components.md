# React Components

Documentation for React components in the frontend application.

## Component Structure

The application follows a modern React architecture with routing, context for state management, and component-based design.

### Current Structure

```
packages/frontend/src/
├── App.tsx                       # Main app with routing
├── App.css                       # Global app styles
├── components/
│   ├── Header.tsx                # Navigation header with auth
│   └── Header.css                # Header styles
├── pages/
│   ├── Home.tsx                  # Home page
│   ├── Home.css                  # Home page styles
│   ├── Login.tsx                 # Login page with Google OAuth
│   └── Login.css                 # Login page styles
└── contexts/
    └── AuthContext.tsx           # Authentication context provider
```

## App

**Location**: `packages/frontend/src/App.tsx`

The main application component with routing and authentication provider.

### Functionality

- Wraps app with GoogleOAuthProvider for Google sign-in
- Provides authentication context to all components
- Sets up React Router with routes
- Includes persistent header across all pages

### Code Structure

```typescript
function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
```

### Dependencies

- `@react-oauth/google` - Google OAuth integration
- `react-router-dom` - Client-side routing
- `AuthContext` - Custom authentication context

---

## Header

**Location**: `packages/frontend/src/components/Header.tsx`

Navigation header with authentication status and controls.

### Functionality

- Displays logo with link to home
- Shows user information when authenticated
- Provides "Join" button for unauthenticated users
- Provides "Logout" button for authenticated users
- Fixed position at top of page

### Props

None (uses AuthContext)

### State

Retrieved from AuthContext:
- `user` - Current authenticated user or null
- `loading` - Authentication check in progress
- `logout` - Function to log out user

### Code Example

```typescript
export const Header = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        {loading ? (
          <div className="user-info">Loading...</div>
        ) : user ? (
          <div className="user-section">
            <div className="user-info">
              {user.picture && (
                <img src={user.picture} alt={user.name} className="user-avatar" />
              )}
              <span className="user-email">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="join-button">
            Join
          </Link>
        )}
        <div className="header-logo">
          <Link to="/">BOBHack</Link>
        </div>
      </div>
    </header>
  );
};
```

### Styles

**Location**: `packages/frontend/src/components/Header.css`

Key styles:
- Fixed positioning with backdrop blur
- Gradient button styling
- User avatar with circular border
- Responsive layout

---

## Home Page

**Location**: `packages/frontend/src/pages/Home.tsx`

Landing page with application overview and feature showcase.

### Functionality

- Hero section with title and subtitle
- Feature cards grid showcasing app capabilities
- About section with description
- Footer with backend connection status
- Fetches `/api/hello` to verify backend connection

### State

- `message: string` - Backend connection status message

### Code Structure

```typescript
export const Home = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/hello`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="home-page">
      {/* Hero, Features, About, Footer sections */}
    </div>
  );
};
```

### Sections

1. **Hero**: Application title and description
2. **Features Grid**: 4 feature cards (AI Automation, Fast Processing, Secure & Reliable, Analytics)
3. **About**: Detailed application description
4. **Footer**: Backend connection status

---

## Login Page

**Location**: `packages/frontend/src/pages/Login.tsx`

Authentication page with Google OAuth sign-in.

### Functionality

- Displays "Sign in with Google" button
- Handles Google OAuth credential response
- Authenticates with backend API
- Redirects to home page on successful login
- Shows error messages on failure

### Dependencies

- `@react-oauth/google` - GoogleLogin component
- `useAuth` hook - Authentication context
- `react-router-dom` - Navigation

### Code Example

```typescript
export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome to BOBHack</h1>
        <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
      </div>
    </div>
  );
};
```

### Flow

1. User clicks "Sign in with Google"
2. Google OAuth modal appears
3. User selects Google account
4. Google returns credential token
5. App sends token to `/api/auth/google`
6. Backend verifies token and creates session
7. Frontend stores user in context
8. User redirected to home page

---

## AuthContext

**Location**: `packages/frontend/src/contexts/AuthContext.tsx`

React Context for managing authentication state across the application.

### Functionality

- Provides centralized authentication state
- Checks authentication status on app load
- Provides login and logout functions
- Exposes user information to all components

### Interface

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;          // Current authenticated user
  loading: boolean;           // Auth check in progress
  login: (userData: User) => void;  // Set authenticated user
  logout: () => Promise<void>;      // Log out and clear session
}
```

### Provider

```typescript
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/user`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... login and logout implementations
};
```

### Usage Hook

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Usage in Components

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <div>Please log in</div>;
}
```

### Key Features

1. **Automatic Auth Check**: Checks if user is logged in on app load
2. **Session Persistence**: Uses cookies for persistent sessions
3. **Global State**: User state available to all components
4. **Type Safety**: Full TypeScript support for user data
5. **Error Handling**: Graceful handling of auth failures

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
