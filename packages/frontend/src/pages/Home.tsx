import { useState, useEffect } from 'react';
import './Home.css';

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
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Back Office Operations Bot Solution
          </h1>
          <p className="hero-subtitle">
            Automate routine back-office operations with intelligent bots
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Automation</h3>
            <p>Intelligent bots for automating repetitive tasks</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Processing</h3>
            <p>Instant request processing and real-time operations</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Reliable</h3>
            <p>Secure data storage and reliable system operation</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Detailed analytics and monitoring of all operations</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About the Solution</h2>
        <p>
          BOOB Solution is a modern platform for automating back-office operations. 
          The system helps automate routine tasks, improves work efficiency, 
          and reduces the likelihood of errors in operational processes.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-status">
          <span className="status-badge">{message || 'Connecting...'}</span>
        </div>
      </footer>
    </div>
  );
};

