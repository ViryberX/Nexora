import React from 'react';
import { Bookmark, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Saved: React.FC = () => {
  const navigate = useNavigate();
  
  const savedItems = [
    {
      id: 1,
      title: 'AI Progress Report 2026',
      type: 'Research Report',
      date: 'Saved Oct 1',
    },
    {
      id: 2,
      title: 'Quantum Computing Fundamentals',
      type: 'Video Summary',
      date: 'Saved Sep 28',
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Saved Reports</h1>
        <p className="page-subtitle">Your bookmarked research and summaries.</p>
      </div>

      <div className="history-list">
        {savedItems.map((item) => (
          <div key={item.id} className="history-item glass-panel">
            <div className="history-icon-wrapper" style={{ color: 'var(--accent-secondary)' }}>
              <Bookmark size={18} />
            </div>
            <div className="history-content">
              <h3 className="history-title">{item.title}</h3>
              <span className="history-date">
                <FileText size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {item.type} • {item.date}
              </span>
            </div>
            <button 
              className="history-action"
              onClick={() => {
                navigate('/');
              }}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        ))}
        {savedItems.length === 0 && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <Bookmark size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p>No saved reports yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
