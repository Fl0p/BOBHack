import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Use environment variable for API URL, fallback to /api for dev
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/hello`)
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

export default App;

