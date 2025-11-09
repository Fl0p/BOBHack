import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <section className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="user-welcome">
          <div className="user-info-compact">
            <span className="user-name">{user.name}</span>
          </div>
          <div className="user-avatar-small">
            {user.picture ? (
              <img src={user.picture} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="dashboard-content">
        <div className="dashboard-grid">
          {/* Statistics Cards */}
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <h3>Active Bots</h3>
              <p className="stat-value">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-details">
              <h3>Tasks Completed</h3>
              <p className="stat-value">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-details">
              <h3>Pending Tasks</h3>
              <p className="stat-value">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <h3>Success Rate</h3>
              <p className="stat-value">100%</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <span className="action-icon">🤖</span>
              <span>Create New Bot</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📝</span>
              <span>View Tasks</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📈</span>
              <span>Analytics</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item empty">
              <p>No recent activity. Start by creating your first bot!</p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

