import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleScriptLoaded = useRef(false); // ✅ prevents multiple GSI init

  useEffect(() => {
    // Restore user from localStorage
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const avatar = localStorage.getItem('avatar');
    if (token) setUser({ token, name, email, avatar });
    setLoading(false);

    // ✅ Load Google GSI script only ONCE
    if (googleScriptLoaded.current) return;
    googleScriptLoaded.current = true;

    // Check if script already exists in DOM
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (existingScript) return; // ✅ already loaded — don't add again

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const s = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (s) s.remove();
      googleScriptLoaded.current = false;
    };
  }, []);

  const login = (token, name, email = '', avatar = '') => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', name);
    localStorage.setItem('email', email);
    localStorage.setItem('avatar', avatar);
    setUser({ token, name, email, avatar });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    // Sign out from Google
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
      window.google.accounts.id.cancel();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);