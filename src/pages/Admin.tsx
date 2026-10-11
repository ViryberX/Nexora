import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Activity, CheckCircle, XCircle, BarChart3, AlertTriangle } from 'lucide-react';
import './Admin.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const Admin: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/stats`);
        if (!res.ok) throw new Error('Failed to load admin stats');
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="page-container"><div className="loading-state">Loading Admin Dashboard...</div></div>;
  }

  if (error) {
    return <div className="page-container"><div className="error-message">{error}</div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ShieldAlert size={32} className="text-accent" />
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Platform overview and system health.</p>
        </div>
      </div>

      <div className="admin-grid">
        {/* Metric Cards */}
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <Users size={20} className="text-secondary" />
            <h3>Total Users</h3>
          </div>
          <p className="metric-value">{stats.users.toLocaleString()}</p>
        </div>
        
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <Activity size={20} className="text-secondary" />
            <h3>Total Sessions</h3>
          </div>
          <p className="metric-value">{stats.totalSessions.toLocaleString()}</p>
        </div>



        <div className="metric-card glass-panel">
          <div className="metric-header">
            <BarChart3 size={20} className="text-secondary" />
            <h3>Web Searches</h3>
          </div>
          <p className="metric-value">{stats.webSearches.toLocaleString()}</p>
        </div>
      </div>

      <div className="admin-sections">
        {/* System Health */}
        <section className="glass-panel admin-section">
          <h2>System Health & Providers</h2>
          <div className="provider-list">
            <div className="provider-item">
              <span className="provider-name">LLM Provider (Gemini)</span>
              {stats.providers.gemini ? 
                <span className="status-badge success"><CheckCircle size={14}/> Configured</span> : 
                <span className="status-badge error"><XCircle size={14}/> Missing API Key</span>
              }
            </div>
            <div className="provider-item">
              <span className="provider-name">Search Provider (Tavily)</span>
              {stats.providers.tavily ? 
                <span className="status-badge success"><CheckCircle size={14}/> Configured</span> : 
                <span className="status-badge error"><XCircle size={14}/> Missing API Key</span>
              }
            </div>
          </div>
        </section>

        {/* Error Logs Summary */}
        <section className="glass-panel admin-section">
          <h2>Recent Anomalies</h2>
          {stats.errorsLast24h > 0 ? (
            <div className="alert-box warning">
              <AlertTriangle size={20} />
              <div>
                <strong>{stats.errorsLast24h} errors</strong> recorded in the last 24 hours. 
                Check server logs for rate-limiting or provider timeouts.
              </div>
            </div>
          ) : (
            <div className="alert-box success">
              <CheckCircle size={20} />
              <div>No significant errors in the last 24 hours. Systems nominal.</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;
