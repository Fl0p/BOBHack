import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Generate random statistics
  const stats = {
    activeBots: Math.floor(Math.random() * 3) + 2,
    tasksCompleted: Math.floor(Math.random() * 500) + 100,
    pendingTasks: Math.floor(Math.random() * 50) + 10,
    successRate: Math.floor(Math.random() * 15) + 85
  };

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
          <button onClick={handleLogout} className="dashboard-logout-btn">
            Logout
          </button>
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
              <p className="stat-value">{stats.activeBots}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-details">
              <h3>Tasks Completed</h3>
              <p className="stat-value">{stats.tasksCompleted}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-details">
              <h3>Pending Tasks</h3>
              <p className="stat-value">{stats.pendingTasks}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <h3>Success Rate</h3>
              <p className="stat-value">{stats.successRate}%</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/bots')}>
              <span className="action-icon">🤖</span>
              <span>Bot Management</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/tasks')}>
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

