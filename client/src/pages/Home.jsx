import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Transformer AI Model',
    desc: 'Built on RoBERTa, trained on thousands of verified and fake news samples for high-accuracy classification.',
    color: '#3b82f6',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Instant Analysis',
    desc: 'Get a credibility score, sentiment breakdown, and linguistic insights in under 3 seconds.',
    color: '#10b981',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Reliability Score',
    desc: 'Every article gets a 0–100 credibility rating with detailed reasoning behind the verdict.',
    color: '#f59e0b',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'History Dashboard',
    desc: 'Track all your past analyses, spot patterns, and review previous verdicts anytime.',
    color: '#8b5cf6',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'NLP Insights',
    desc: 'Sentiment analysis, subjectivity detection, and linguistic pattern recognition in one place.',
    color: '#ec4899',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Secure & Private',
    desc: 'Your analyzed content is never stored without consent. Google OAuth for safe authentication.',
    color: '#14b8a6',
  },
];

const stats = [
  { value: '94%', label: 'Accuracy rate' },
  { value: '<3s', label: 'Analysis time' },
  { value: '50K+', label: 'Articles analyzed' },
  { value: 'Free', label: 'To get started' },
];

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          AI-Powered Fake News Detection
        </div>
        <h1 className="hero-title">
          See through the noise.<br />
          <span className="hero-accent">Find the truth.</span>
        </h1>
        <p className="hero-subtitle">
          TruthLens uses transformer AI and NLP to instantly verify news articles,
          headlines, and social media content — giving you a credibility score you can trust.
        </p>
        <div className="hero-actions">
          <Link to="/analyze" className="btn btn-primary btn-lg">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Analyze Now — It's Free
          </Link>
          <Link to="/register" className="btn btn-outline btn-lg">Create Account</Link>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-eyebrow">Capabilities</p>
            <h2 className="section-title">Everything you need to spot misinformation</h2>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ color: f.color, background: `${f.color}18` }}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Start verifying news today</h2>
          <p className="cta-sub">No credit card required. Analyze your first article in seconds.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get started free</Link>
            <Link to="/analyze" className="btn btn-outline btn-lg">Try without signing up</Link>
          </div>
        </div>
      </section>
    </div>
  );
}