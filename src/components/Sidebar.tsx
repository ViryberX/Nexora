import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Globe, Clock, Bookmark, Settings, Sun, Moon, Sparkles, ShieldAlert, X } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ theme, toggleTheme, isOpen = false, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <Sparkles className="logo-icon" size={24} />
            <h1 className="logo-text">NEXORA <span className="logo-badge">AI</span></h1>
          </div>
          {onClose && (
            <button className="mobile-close-btn" onClick={onClose} aria-label="Close menu">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">Discover</h3>
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end onClick={onClose}>
              <Search size={18} />
              <span>Search</span>
            </NavLink>
            <NavLink to="/research" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <Globe size={18} />
              <span>Web Research</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Library</h3>
            <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <Clock size={18} />
              <span>History</span>
            </NavLink>
            <NavLink to="/saved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <Bookmark size={18} />
              <span>Saved Reports</span>
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <ShieldAlert size={18} />
            <span>Admin</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <div className="user-profile">
            <div className="avatar">U</div>
            <div className="user-info">
              <span className="user-name">User</span>
              <span className="user-plan">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
