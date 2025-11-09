import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { BotManagement } from './pages/BotManagement';
import { ViewTasks } from './pages/ViewTasks';
import './App.css';

// Google Client ID from client_secret.json
const GOOGLE_CLIENT_ID = '850281472355-q3pdt0o2t34rs4ng980nfs97bdir0i9f.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bots" element={<BotManagement />} />
            <Route path="/tasks" element={<ViewTasks />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

