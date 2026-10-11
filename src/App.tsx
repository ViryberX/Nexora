import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, Sun, Moon, Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Research from './pages/Research';
import History from './pages/History';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import './App.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className="app-container">
        {/* Mobile Header Bar */}
        <header className="mobile-header">
          <div className="mobile-logo">
            <Sparkles className="logo-icon" size={20} />
            <span className="logo-text">NEXORA <span className="logo-badge">AI</span></span>
          </div>
          <div className="mobile-header-actions">
            <button className="mobile-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(true)} 
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </header>

        <Sidebar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/research" element={<Research />} />
            <Route path="/history" element={<History />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/settings" element={<Settings theme={theme} setTheme={setTheme} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
