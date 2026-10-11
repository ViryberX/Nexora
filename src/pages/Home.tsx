import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Zap, Sparkles, BookOpen } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const [depth, setDepth] = useState<'fast' | 'deep'>('fast');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/research?q=${encodeURIComponent(query)}&depth=${depth}`);
  };

  const suggestions = [
    { text: 'What is the future of quantum computing?', icon: <Zap size={16} /> },
    { text: 'How do LLMs actually work?', icon: <BookOpen size={16} /> },
    { text: 'Compare React vs Vue in 2026', icon: <Search size={16} /> },
  ];

  return (
    <div className="page-container home-container">
      <div className="hero-section animate-fade-in">
        <div className="hero-badge delay-100">
          <Sparkles size={14} className="text-accent" />
          <span>NEXORA AI 2.0 is now live</span>
        </div>
        <h1 className="hero-title delay-200">
          Understand Anything.<br />
          <span className="gradient-text">In Seconds.</span>
        </h1>
        <p className="hero-subtitle delay-300">
          Deep dive into complex topics with web-researched, source-backed answers.
        </p>
      </div>

      <div className="search-section animate-fade-in delay-300">
        <form onSubmit={handleSearch} className="search-box glass-panel">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={24} />
            <input
              type="text"
              className="search-input"
              placeholder="Ask anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-submit" disabled={!query.trim()}>
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="search-options">
            <span className="options-label">Research Depth:</span>
            <button 
              type="button" 
              className={`depth-btn ${depth === 'fast' ? 'active' : ''}`}
              onClick={() => setDepth('fast')}
            >
              Fast
            </button>
            <button 
              type="button" 
              className={`depth-btn ${depth === 'deep' ? 'active' : ''}`}
              onClick={() => setDepth('deep')}
            >
              Deep
            </button>
          </div>
        </form>
      </div>

      <div className="suggestions-section animate-fade-in delay-300">
        <h3 className="suggestions-title">Try these prompts</h3>
        <div className="suggestions-grid">
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              className="suggestion-card glass-panel"
              onClick={() => {
                setQuery(s.text);
              }}
            >
              <div className="suggestion-icon">{s.icon}</div>
              <p className="suggestion-text">{s.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
