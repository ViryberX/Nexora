import React from 'react';
import { User, CreditCard, Monitor } from 'lucide-react';

interface SettingsProps {
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences.</p>
      </div>

      <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <section className="settings-section glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Monitor size={20} className="text-accent" /> Appearance
          </h2>
          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontWeight: 500 }}>Theme</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Select your preferred interface theme.</p>
            </div>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </section>

        <section className="settings-section glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} className="text-accent" /> Account
          </h2>
          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontWeight: 500 }}>Email Address</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>user@example.com</p>
            </div>
            <button className="btn-secondary">Change</button>
          </div>
          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontWeight: 500 }}>Password</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Last changed 3 months ago</p>
            </div>
            <button className="btn-secondary">Update</button>
          </div>
        </section>

        <section className="settings-section glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} className="text-accent" /> Subscription
          </h2>
          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontWeight: 500 }}>Current Plan</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Pro Plan ($20/mo)</p>
            </div>
            <button className="btn-secondary">Manage</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
