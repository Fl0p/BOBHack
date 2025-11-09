import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './ViewTasks.css';

interface Task {
  id: number;
  name: string;
  bot: string;
  status: 'completed' | 'in-progress' | 'pending' | 'failed';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
}

export const ViewTasks = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      name: 'Process Invoice #10234',
      bot: 'InvoiceProcessorBot',
      status: 'completed',
      priority: 'high',
      progress: 100,
      startTime: '10:23 AM',
      endTime: '10:25 AM',
      duration: '2 min'
    },
    {
      id: 2,
      name: 'Fill Tax Form 2024-Q3',
      bot: 'TaxReportBot',
      status: 'in-progress',
      priority: 'high',
      progress: 65,
      startTime: '10:30 AM'
    },
    {
      id: 3,
      name: 'Generate Monthly Report',
      bot: 'Report Generator',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      startTime: '11:00 AM'
    },
    {
      id: 4,
      name: 'Archive Documents Q2',
      bot: 'DocumentArchiverBot',
      status: 'completed',
      priority: 'low',
      progress: 100,
      startTime: '09:15 AM',
      endTime: '09:45 AM',
      duration: '30 min'
    },
    {
      id: 5,
      name: 'Check Compliance Rules',
      bot: 'ComplianceCheckerBot',
      status: 'failed',
      priority: 'high',
      progress: 45,
      startTime: '08:30 AM',
      endTime: '08:42 AM',
      duration: '12 min'
    },
    {
      id: 6,
      name: 'Process Payroll Data',
      bot: 'PayrollBot',
      status: 'in-progress',
      priority: 'high',
      progress: 82,
      startTime: '10:15 AM'
    },
    {
      id: 7,
      name: 'Extract Email Attachments',
      bot: 'Email Processor Bot',
      status: 'completed',
      priority: 'medium',
      progress: 100,
      startTime: '09:00 AM',
      endTime: '09:10 AM',
      duration: '10 min'
    },
    {
      id: 8,
      name: 'Track Expenses Q3',
      bot: 'ExpenseTrackerBot',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      startTime: '11:30 AM'
    },
    {
      id: 9,
      name: 'Fill Customer Form #4521',
      bot: 'FormsFillerBot',
      status: 'completed',
      priority: 'low',
      progress: 100,
      startTime: '08:00 AM',
      endTime: '08:05 AM',
      duration: '5 min'
    },
    {
      id: 10,
      name: 'Enter Sales Data',
      bot: 'Data Entry Bot',
      status: 'in-progress',
      priority: 'medium',
      progress: 38,
      startTime: '10:45 AM'
    },
    {
      id: 11,
      name: 'Process Invoice #10235',
      bot: 'InvoiceProcessorBot',
      status: 'pending',
      priority: 'high',
      progress: 0,
      startTime: '12:00 PM'
    },
    {
      id: 12,
      name: 'Backup Database',
      bot: 'DocumentArchiverBot',
      status: 'completed',
      priority: 'high',
      progress: 100,
      startTime: '07:00 AM',
      endTime: '07:45 AM',
      duration: '45 min'
    }
  ]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    successRate: Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
  };

  if (loading) {
    return (
      <div className="view-tasks-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '⏳';
      case 'pending': return '⏱️';
      case 'failed': return '❌';
      default: return '📝';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="view-tasks-page">
      {/* Header */}
      <section className="view-tasks-header">
        <div className="header-left">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1 className="view-tasks-title">View Tasks</h1>
        </div>
        <div className="header-actions">
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

      {/* Statistics Section */}
      <section className="tasks-statistics">
        <div className="stats-grid">
          <div className="stat-card-small">
            <div className="stat-icon-small">📊</div>
            <div className="stat-content">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-number">{stats.total}</span>
            </div>
          </div>
          <div className="stat-card-small completed">
            <div className="stat-icon-small">✅</div>
            <div className="stat-content">
              <span className="stat-label">Completed</span>
              <span className="stat-number">{stats.completed}</span>
            </div>
          </div>
          <div className="stat-card-small in-progress">
            <div className="stat-icon-small">⏳</div>
            <div className="stat-content">
              <span className="stat-label">In Progress</span>
              <span className="stat-number">{stats.inProgress}</span>
            </div>
          </div>
          <div className="stat-card-small pending">
            <div className="stat-icon-small">⏱️</div>
            <div className="stat-content">
              <span className="stat-label">Pending</span>
              <span className="stat-number">{stats.pending}</span>
            </div>
          </div>
          <div className="stat-card-small failed">
            <div className="stat-icon-small">❌</div>
            <div className="stat-content">
              <span className="stat-label">Failed</span>
              <span className="stat-number">{stats.failed}</span>
            </div>
          </div>
          <div className="stat-card-small success-rate">
            <div className="stat-icon-small">📈</div>
            <div className="stat-content">
              <span className="stat-label">Success Rate</span>
              <span className="stat-number">{stats.successRate}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks Table */}
      <section className="tasks-table-section">
        <div className="section-header">
          <h2>All Tasks</h2>
          <div className="filter-controls">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Completed</button>
            <button className="filter-btn">In Progress</button>
            <button className="filter-btn">Pending</button>
          </div>
        </div>

        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task Name</th>
                <th>Bot</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Progress</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className={`task-row status-${task.status}`}>
                  <td className="task-id">#{task.id}</td>
                  <td className="task-name">{task.name}</td>
                  <td className="task-bot">{task.bot}</td>
                  <td className="task-status">
                    <span className={`status-badge ${task.status}`}>
                      {getStatusIcon(task.status)} {task.status}
                    </span>
                  </td>
                  <td className="task-priority">
                    <span className={`priority-badge ${task.priority}`}>
                      {getPriorityIcon(task.priority)} {task.priority}
                    </span>
                  </td>
                  <td className="task-progress">
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${task.progress}%` }}></div>
                      <span className="progress-text">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="task-time">{task.startTime}</td>
                  <td className="task-time">{task.endTime || '-'}</td>
                  <td className="task-duration">{task.duration || '-'}</td>
                  <td className="task-actions">
                    <button className="action-icon-btn" title="View Details">👁️</button>
                    <button className="action-icon-btn" title="Retry">🔄</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

