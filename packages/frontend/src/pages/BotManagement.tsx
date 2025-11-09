import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './BotManagement.css';

interface Bot {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'error';
  tasksCompleted: number;
  lastActive: string;
}

export const BotManagement = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [bots] = useState<Bot[]>([
    {
      id: 1,
      name: 'FormsFillerBot',
      status: 'active',
      tasksCompleted: 312,
      lastActive: '1 minute ago'
    },
    {
      id: 2,
      name: 'TaxReportBot',
      status: 'active',
      tasksCompleted: 278,
      lastActive: '3 minutes ago'
    },
    {
      id: 3,
      name: 'Email Processor Bot',
      status: 'active',
      tasksCompleted: 245,
      lastActive: '2 minutes ago'
    },
    {
      id: 4,
      name: 'Data Entry Bot',
      status: 'active',
      tasksCompleted: 189,
      lastActive: '5 minutes ago'
    },
    {
      id: 5,
      name: 'Report Generator',
      status: 'inactive',
      tasksCompleted: 156,
      lastActive: '1 hour ago'
    },
    {
      id: 6,
      name: 'InvoiceProcessorBot',
      status: 'active',
      tasksCompleted: 423,
      lastActive: '30 seconds ago'
    },
    {
      id: 7,
      name: 'PayrollBot',
      status: 'active',
      tasksCompleted: 198,
      lastActive: '4 minutes ago'
    },
    {
      id: 8,
      name: 'DocumentArchiverBot',
      status: 'inactive',
      tasksCompleted: 567,
      lastActive: '2 hours ago'
    },
    {
      id: 9,
      name: 'ExpenseTrackerBot',
      status: 'active',
      tasksCompleted: 334,
      lastActive: '6 minutes ago'
    },
    {
      id: 10,
      name: 'ComplianceCheckerBot',
      status: 'error',
      tasksCompleted: 89,
      lastActive: '3 hours ago'
    }
  ]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAddBot = () => {
    alert('Add New Bot functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="bot-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bot-management-page">
      {/* Header */}
      <section className="bot-management-header">
        <div className="header-left">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1 className="bot-management-title">Bot Management</h1>
        </div>
        <div className="header-actions">
          <button onClick={handleAddBot} className="add-bot-btn">
            <span className="btn-icon">🤖</span>
            <span>Add New Bot</span>
          </button>
          <div className="user-section">
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
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Bot List */}
      <section className="bot-list-section">
        <div className="section-header">
          <h2>Active Bots</h2>
          <span className="bot-count">{bots.length} bots</span>
        </div>

        <div className="bot-grid">
          {bots.map((bot) => (
            <div key={bot.id} className="bot-card">
              <div className="bot-card-header">
                <div className="bot-info">
                  <h3 className="bot-name">{bot.name}</h3>
                  <span className={`bot-status status-${bot.status}`}>
                    {bot.status}
                  </span>
                </div>
                <div className="bot-actions">
                  <button className="bot-action-btn" title="Edit">
                    ⚙️
                  </button>
                  <button className="bot-action-btn" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>

              <div className="bot-stats">
                <div className="stat-item">
                  <span className="stat-label">Tasks Completed</span>
                  <span className="stat-value">{bot.tasksCompleted}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Last Active</span>
                  <span className="stat-value">{bot.lastActive}</span>
                </div>
              </div>

              <div className="bot-card-footer">
                <button className="bot-control-btn start-btn">
                  {bot.status === 'active' ? '⏸️ Pause' : '▶️ Start'}
                </button>
                <button className="bot-control-btn view-btn">
                  📊 View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Empty State for no bots */}
      {bots.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <h3>No bots yet</h3>
          <p>Create your first bot to get started with automation</p>
          <button onClick={handleAddBot} className="add-bot-empty-btn">
            Add New Bot
          </button>
        </div>
      )}
    </div>
  );
};

