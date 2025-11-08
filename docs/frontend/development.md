# Frontend разработка

Руководство по разработке frontend части проекта.

## Запуск для разработки

```bash
# Из корня проекта
yarn dev:frontend

# Или напрямую из workspace
yarn workspace frontend dev
```

Приложение откроется на `http://localhost:3000` с hot reload.

## Добавление новых компонентов

1. Создайте папку компонента:

```bash
mkdir -p packages/frontend/src/components/MyComponent
```

2. Создайте файлы компонента:

```typescript
// packages/frontend/src/components/MyComponent/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

3. Добавьте стили (если нужно):

```css
/* packages/frontend/src/components/MyComponent/MyComponent.css */
.my-component {
  padding: 20px;
}
```

4. Используйте компонент:

```typescript
import { MyComponent } from './components/MyComponent/MyComponent';
```

## Работа с API

### Простой fetch

```typescript
const response = await fetch('/api/endpoint');
const data = await response.json();
```

### Custom hook для API

Создайте `src/hooks/useApi.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useApi<T>(url: string) {
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

Использование:

```typescript
function App() {
  const { data, loading, error } = useApi<{ message: string }>('/api/hello');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.message}</div>;
}
```

## Стилизация

### CSS Modules

Переименуйте `App.css` в `App.module.css`:

```css
/* App.module.css */
.container {
  padding: 20px;
}
```

Использование:

```typescript
import styles from './App.module.css';

function App() {
  return <div className={styles.container}>Content</div>;
}
```

### CSS-in-JS библиотеки

Можно добавить styled-components или emotion:

```bash
yarn workspace frontend add styled-components
yarn workspace frontend add -D @types/styled-components
```

## Роутинг

Для многостраничного приложения добавьте React Router:

```bash
yarn workspace frontend add react-router-dom
```

Пример:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## State Management

Для сложного state management можно добавить:
- **Zustand** - легкий и простой
- **Redux Toolkit** - полнофункциональный
- **Jotai** - атомарный state

```bash
yarn workspace frontend add zustand
```

## Тестирование

Добавьте Vitest и React Testing Library:

```bash
yarn workspace frontend add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Создайте `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
});
```

## Отладка

### React DevTools

Установите расширение браузера:
- [Chrome/Edge](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Console logging

```typescript
console.log('Debug:', data);
console.error('Error:', error);
```

### Vite inspector

```bash
yarn workspace frontend add -D vite-plugin-inspect
```

## Сборка для production

```bash
yarn workspace frontend build
```

Результат будет в `packages/frontend/dist/`.

### Предпросмотр production сборки

```bash
yarn workspace frontend preview
```

## Best Practices

1. **Типизация**: Всегда используйте TypeScript типы
2. **Компоненты**: Разделяйте на маленькие переиспользуемые компоненты
3. **Hooks**: Выносите логику в custom hooks
4. **Именование**: Понятные имена для переменных и функций
5. **Оптимизация**: Используйте React.memo для оптимизации рендеринга
6. **Error handling**: Обрабатывайте ошибки в API запросах
