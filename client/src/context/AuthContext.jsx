import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const avatar = localStorage.getItem('avatar');
    if (token) setUser({ token, name, email, avatar });
    setLoading(false);

    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
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
    // Sign out from Google if applicable
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);