# React компоненты

Документация React компонентов frontend приложения.

## Структура компонентов

В данный момент приложение имеет простую структуру с одним главным компонентом.

## App

**Расположение**: `packages/frontend/src/App.tsx`

Главный компонент приложения.

### Функциональность

- Отображает приветственное сообщение
- Загружает данные с backend через API `/api/hello`
- Отображает полученное сообщение

### Код

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

Компонент не принимает props.

### State

- `message: string` - сообщение, полученное от backend

### Effects

- Загружает данные при монтировании компонента

---

## Добавление новых компонентов

### Рекомендуемая структура

```
packages/frontend/src/
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.css
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   └── Footer.css
│   └── ...
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   └── ...
├── hooks/
│   └── useApi.ts
├── utils/
│   └── ...
└── types/
    └── ...
```

### Пример создания компонента

```typescript
// src/components/Header/Header.tsx
import './Header.css';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
}
```

### Использование

```typescript
import { Header } from './components/Header/Header';

function App() {
  return (
    <div>
      <Header title="BOBHack" />
      {/* ... */}
    </div>
  );
}
```

## Best Practices

1. **TypeScript**: Всегда типизируйте props и state
2. **Разделение компонентов**: Создавайте отдельные папки для компонентов
3. **Именование**: Используйте PascalCase для компонентов
4. **Props Interface**: Определяйте интерфейсы для props
5. **Экспорт**: Используйте named exports для лучшей читаемости
