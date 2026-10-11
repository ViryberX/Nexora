import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, Link2, BookOpen, Copy, Bookmark, Clock, FileText, Zap, Sparkles, ArrowRight, X, RotateCw } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './Research.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function formatFriendlyError(errorMsg?: string | null): { title: string; message: string; badge: string } {
  if (!errorMsg) {
    return {
      title: 'High Demand on AI Systems',
      message: 'Our research engine is currently busy. Please wait a moment and try your search again.',
      badge: 'High Traffic',
    };
  }
  const lower = errorMsg.toLowerCase();
  if (
    lower.includes('503') ||
    lower.includes('high demand') ||
    lower.includes('overload') ||
    lower.includes('capacity') ||
    lower.includes('busy') ||
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('429') ||
    lower.includes('googlegenerativeai') ||
    lower.includes('service unavailable')
  ) {
    return {
      title: 'AI Servers Experiencing High Demand',
      message: 'The AI research network is experiencing high demand right now. Spikes in traffic are usually brief — please wait a moment and try again.',
      badge: 'Temporary Peak',
    };
  }
  if (lower.includes('timeout') || lower.includes('504')) {
    return {
      title: 'Research Request Timed Out',
      message: 'The web research took a bit longer than expected to synthesize. Please try a simpler search query or switch to Fast Search.',
      badge: 'Timed Out',
    };
  }
  if (lower.includes('failed to fetch') || lower.includes('network') || lower.includes('connection')) {
    return {
      title: 'Connection Interrupted',
      message: 'Unable to reach the server. Please check your internet connection and try your search again.',
      badge: 'Network',
    };
  }
  return {
    title: 'Temporary Service Delay',
    message: 'Our research engine is currently handling high demand. Please take a moment and try your search again.',
    badge: 'Please Retry',
  };
}

const Research: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q');
  const depthParam = searchParams.get('depth') || 'fast';
  
  const [query, setQuery] = useState(queryParam || '');
  const [depth, setDepth] = useState(depthParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [progressMsg, setProgressMsg] = useState('');

  const handleSearch = async (e?: React.FormEvent, searchQ: string = query, searchDepth: string = depth) => {
    e?.preventDefault();
    if (!searchQ.trim()) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    setProgressMsg('Searching the live web for relevant sources...');

    const progressTimer = setTimeout(() => {
      setProgressMsg('Analyzing sources and synthesizing findings...');
    }, 4000);
    
    try {
      const res = await fetch(`${API_BASE}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQ, depth: searchDepth })
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || data.error || 'Research failed');
        }
        
        // Add client timestamp
        data.generatedAt = new Date().toLocaleString();
        setResult(data);
      } else {
        const text = await res.text();
        console.error("Server returned non-JSON:", text);
        if (res.status === 504 || text.includes('timeout')) {
          throw new Error('The research request timed out. Please try a simpler query or Fast Search.');
        } else if (res.status === 500) {
          throw new Error('A critical server error occurred. The backend might be misconfigured or missing API keys.');
        }
        throw new Error(`Unexpected response format from server (${res.status})`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      clearTimeout(progressTimer);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      handleSearch(undefined, queryParam, depthParam);
    }
  }, [queryParam, depthParam]);

  const handleCopy = () => {
    if (!result) return;
    const text = `# ${result.title}\n\n${result.summary}\n\n` + 
                 result.sections?.map((s:any) => `## ${s.heading}\n${s.content}`).join('\n\n') +
                 `\n\n## Sources\n` + result.sources?.map((s:any) => `${s.id}. ${s.title} - ${s.url}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleExportPDF = () => {
    if (!result) return;
    
    // Create a temporary clone of the content to print to avoid UI glitches
    const element = document.querySelector('.article-content') as HTMLElement;
    if (!element) return;
    
    const opt = {
      margin:       10,
      filename:     `${result.title.replace(/\\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const renderTextWithCitations = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const sourceId = parseInt(match[1]);
        const source = result?.sources?.find((s: any) => s.id === sourceId);
        
        if (source) {
          return (
            <a 
              key={index} 
              href={source.url} 
              target="_blank" 
              rel="noreferrer" 
              className="citation-link" 
              title={source.title}
            >
              {part}
            </a>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Web Research</h1>
        <p className="page-subtitle">Get comprehensive, source-backed answers to complex questions.</p>
      </div>

      <form onSubmit={(e) => handleSearch(e)} className="research-form glass-panel">
        <div className="search-input-wrapper">
          <div className="search-icon-wrapper">
            <Search size={22} />
          </div>
          <input 
            type="text" 
            placeholder="What would you like to research?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            autoFocus
          />
          {query.trim() && !loading && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button type="submit" className="search-submit-btn" disabled={loading || !query.trim()}>
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>Research</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
        
        <div className="search-options">
          <span className="depth-label">Research Depth:</span>
          <div className="depth-toggles">
            <button 
              type="button" 
              className={`depth-toggle ${depth === 'fast' ? 'active' : ''}`}
              onClick={() => setDepth('fast')}
            >
              <Zap size={14} />
              <span>Fast Search</span>
            </button>
            <button 
              type="button" 
              className={`depth-toggle ${depth === 'deep' ? 'active' : ''}`}
              onClick={() => setDepth('deep')}
            >
              <Sparkles size={14} />
              <span>Deep Research</span>
            </button>
          </div>
        </div>
      </form>

      {error && (() => {
        const friendly = formatFriendlyError(error);
        return (
          <div className="friendly-error-card glass-panel animate-fade-in">
            <div className="friendly-error-icon-box">
              <Sparkles size={22} className="friendly-error-icon" />
            </div>
            <div className="friendly-error-body">
              <div className="friendly-error-header">
                <h4 className="friendly-error-title">{friendly.title}</h4>
                <span className="friendly-error-badge">{friendly.badge}</span>
              </div>
              <p className="friendly-error-desc">{friendly.message}</p>
            </div>
            <div className="friendly-error-actions">
              <button 
                type="button" 
                className="retry-search-btn"
                onClick={() => handleSearch(undefined, query, depth)}
                disabled={loading || !query.trim()}
              >
                <RotateCw size={15} />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        );
      })()}

      {loading && (
        <div className="loading-state animate-fade-in">
          <div className="research-loading-card glass-panel">
            <div className="loading-indicator">
              <div className="spinner-orbital">
                <div className="spinner-ring outer"></div>
                <div className="spinner-ring inner"></div>
                <Sparkles size={18} className="spinner-center-icon" />
              </div>
              <div className="loading-text-group">
                <div className="loading-status-badge">
                  <span className="live-pulse-dot"></span>
                  <span>{progressMsg.includes('Analyzing') ? 'AI SYNTHESIS & REASONING' : 'LIVE WEB HARVESTING'}</span>
                </div>
                <h3 className="loading-message">{progressMsg}</h3>
                <p className="loading-subtext">Aggregating live web sources and cross-referencing citations with Gemini 3.6 Flash</p>
              </div>
            </div>
            
            <div className="loading-progress-track">
              <div className="loading-progress-shimmer"></div>
            </div>
          </div>

          <div className="research-skeleton">
            <div className="shimmer-box skeleton-title"></div>
            <div className="skeleton-sources">
              {[1, 2, 3].map(i => (
                <div key={i} className="shimmer-box skeleton-source-card">
                  <div className="skeleton-source-favicon"></div>
                  <div className="skeleton-source-lines">
                    <div className="skeleton-line-sm"></div>
                    <div className="skeleton-line-xs"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="shimmer-box skeleton-content-block">
              <div className="skeleton-line" style={{ width: '95%' }}></div>
              <div className="skeleton-line" style={{ width: '88%' }}></div>
              <div className="skeleton-line" style={{ width: '92%' }}></div>
              <div className="skeleton-line" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="research-results animate-fade-in">
          <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h2 className="query-title">{result.title}</h2>
              <span className="depth-badge">{result.depth === 'deep' ? 'Deep Research' : 'Fast Search'}</span>
            </div>
            <div className="meta-actions">
              <button className="icon-btn" onClick={handleCopy} title="Copy Text"><Copy size={18} /></button>
              <button className="icon-btn" onClick={handleExportPDF} title="Download PDF"><FileText size={18} /></button>
              <button className="icon-btn" title="Save to Library"><Bookmark size={18} /></button>
            </div>
          </div>
          
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} /> Generated on {result.generatedAt}
          </div>
          
          <div className="sources-section">
            <h3 className="section-heading"><Link2 size={18} /> Sources</h3>
            <div className="sources-grid">
              {result.sources?.map((source: any, i: number) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={i} className="source-card glass-panel">
                  <span className="source-number">{source.id}</span>
                  <div className="source-info">
                    <span className="source-title">{source.title || new URL(source.url).hostname}</span>
                    <span className="source-domain">{source.domain}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="article-content glass-panel">
            <div className="summary-box">
              <h3 className="section-heading"><BookOpen size={18} /> Executive Summary</h3>
              <p>{result.summary}</p>
            </div>

            <div className="detailed-sections">
              {result.sections?.map((section: any, i: number) => (
                <div key={i} className="content-section">
                  <h4>{section.heading}</h4>
                  <div className="section-body">
                    {section.content.split('\n\n').map((para: string, idx: number) => (
                      <p key={idx}>{renderTextWithCitations(para)}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Research;
