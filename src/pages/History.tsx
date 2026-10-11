import React from 'react';
import { Clock, Search, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './History.css';

const History: React.FC = () => {
  const navigate = useNavigate();
  
  const historyItems = [
    {
      id: 1,
      type: 'research',
      title: 'What is the future of quantum computing?',
      date: '2 hours ago',
      icon: <Search size={18} />
    },
    {
      id: 3,
      type: 'research',
      title: 'How do LLMs actually work?',
      date: 'Yesterday',
      icon: <Search size={18} />
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">History</h1>
          <p className="page-subtitle">Your recent searches and video summaries.</p>
        </div>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trash2 size={16} /> Clear History
        </button>
      </div>

      <div className="history-list">
        {historyItems.map((item) => (
          <div key={item.id} className="history-item glass-panel">
            <div className="history-icon-wrapper">
              {item.icon}
            </div>
            <div className="history-content">
              <h3 className="history-title">{item.title}</h3>
              <span className="history-date">
                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {item.date}
              </span>
            </div>
            <button 
              className="history-action"
              onClick={() => {
                navigate(`/research?q=${encodeURIComponent(item.title)}`);
              }}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
