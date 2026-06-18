import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, googleAuth } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual client ID

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: '100%',
          text: 'signup_with',
          shape: 'rectangular',
        });
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) { initGoogle(); clearInterval(interval); }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true); setError('');
    try {
      const res = await googleAuth({ credential: response.credential });
      login(res.data.token, res.data.name, res.data.email, res.data.avatar);
      navigate('/analyze');
    } catch {
      setError('Google sign-up failed. Please try again.');
    }
    setGoogleLoading(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.name, res.data.email);
      navigate('/analyze');
    } catch {
      setError('Registration failed. This email may already be in use.');
    }
    setLoading(false);
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="auth-brand-name">TruthLens</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start verifying news for free — no credit card needed</p>

        {/* Google Sign Up */}
        <div className="google-btn-wrapper" ref={googleBtnRef} />
        {googleLoading && <p style={{textAlign:'center',fontSize:'13px',color:'var(--text-muted)'}}>Signing up with Google…</p>}

        <div className="divider">or register with email</div>

        {error && (
          <div className="auth-error">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full name</label>
            <input className="input" placeholder="John Doe"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Email address</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {form.password.length > 0 && (
              <div style={{marginTop:'8px'}}>
                <div style={{display:'flex',gap:'4px',marginBottom:'4px'}}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{flex:1,height:'3px',borderRadius:'2px',background: i <= strength ? strengthColor[strength] : 'var(--border)'}} />
                  ))}
                </div>
                <span style={{fontSize:'12px',color:strengthColor[strength]}}>{strengthLabel[strength]}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{padding:'13px',marginTop:'4px'}} disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account…</> : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}