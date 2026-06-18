import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, googleAuth } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';


const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  // Google Login Response Handler
  const handleGoogleResponse = useCallback(async (response) => {
    if (!response.credential) {
      setError('Google Sign-In response is missing.');
      return;
    }

    setGoogleLoading(true);
    setError('');
    
    try {
      const res = await googleAuth({ credential: response.credential });
      // Context mein user data save karein
      login(res.data.token, res.data.name, res.data.email, res.data.avatar);
      navigate('/analyze');
    } catch (err) {
      console.error("Google Login Error:", err);
      setError('Google sign-in failed. Please try again or check your internet.');
    } finally {
      setGoogleLoading(false);
    }
  }, [login, navigate]);

  // Google Script Initialization
  useEffect(() => {
    const initGoogle = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: googleBtnRef.current.offsetWidth,
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) { 
          initGoogle(); 
          clearInterval(interval); 
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [handleGoogleResponse]);

  // Email/Password Form Handler
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.email || !form.password) { 
      setError('Please fill in all fields.'); 
      return; 
    }
    
    setLoading(true); 
    setError('');
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.name, res.data.email);
      navigate('/analyze');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

        {/* Google Button Container */}
        <div className="google-btn-wrapper" ref={googleBtnRef} />
        
        {googleLoading && (
          <p style={{textAlign:'center', fontSize:'13px', color:'var(--text-muted)'}}>
            Signing in with Google…
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" id="email" value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})} required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" id="password" value={form.password} 
              onChange={(e) => setForm({...form, password: e.target.value})} required 
            />
          </div>
          
          {error && <p className="error-msg">{error}</p>}
          
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}