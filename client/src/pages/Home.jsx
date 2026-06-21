import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: '🧠',
    title: 'LLM-Powered Analysis',
    desc: 'Built on Llama 3.3 70B via Groq — analyzes tone, structure, and credibility signals in milliseconds.',
    color: '#3b82f6',
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    desc: 'Get credibility score, sentiment breakdown, and red flags in under 3 seconds.',
    color: '#10b981',
  },
  {
    icon: '📊',
    title: 'Reliability Score',
    desc: 'Every article gets a 0–100 credibility rating with detailed AI reasoning behind the verdict.',
    color: '#f59e0b',
  },
  {
    icon: '📁',
    title: 'History Dashboard',
    desc: 'Track all past analyses, spot patterns, and review previous verdicts anytime.',
    color: '#8b5cf6',
  },
  {
    icon: '🔍',
    title: 'NLP Insights',
    desc: 'Sentiment analysis, subjectivity detection, and linguistic pattern recognition.',
    color: '#ec4899',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'Google OAuth authentication. Your content is never stored without consent.',
    color: '#14b8a6',
  },
];

const stats = [
  { value: '94%', label: 'Accuracy rate' },
  { value: '<3s', label: 'Analysis time' },
  { value: '50K+', label: 'Articles analyzed' },
  { value: 'Free', label: 'To get started' },
];

const steps = [
  { num: '01', title: 'Paste your content', desc: 'Copy any news article, headline, or social media post.' },
  { num: '02', title: 'AI analyzes it', desc: 'Our LLM model checks credibility, tone, and red flags instantly.' },
  { num: '03', title: 'Get your verdict', desc: 'Receive a detailed report with score, sentiment, and explanation.' },
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
          VerifyAI uses advanced LLM and NLP to instantly verify news articles,
          headlines, and social media content — giving you a credibility score you can trust.
        </p>
        <div className="hero-actions">
          <Link to="/analyze" className="btn btn-primary btn-lg">
            🔍 Analyze Now — It's Free
          </Link>
          <Link to="/register" className="btn btn-outline btn-lg">Create Account</Link>
        </div>
        <div className="hero-stats">
          {stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-eyebrow">How it works</p>
            <h2 className="section-title">Fact-check in 3 simple steps</h2>
          </div>
          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.num} className="step-card">
                <span className="step-num">{s.num}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
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
                <div className="feature-icon" style={{ background: `${f.color}18` }}>
                  <span style={{ fontSize: '22px' }}>{f.icon}</span>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Badge */}
      <section className="tech-section">
        <div className="section-inner">
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>Built with</p>
          <div className="tech-badges">
            {['React', 'Node.js', 'Python', 'Flask', 'MongoDB', 'Groq LLM', 'Llama 3.3', 'JWT Auth'].map(t => (
              <span key={t} className="tech-badge">{t}</span>
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