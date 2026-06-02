import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('studyhub_user');
    const token = localStorage.getItem('studyhub_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('studyhub_token', data.token);
      localStorage.setItem('studyhub_user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Welcome back!');
      return true;
    } catch (err) {
      // Demo fallback
      const demoUser = {
        id: '1', name: 'Arjun Sharma',
        email, role: 'CSE — 3rd Year',
        avatar: email.slice(0, 2).toUpperCase()
      };
      localStorage.setItem('studyhub_token', 'demo-token');
      localStorage.setItem('studyhub_user', JSON.stringify(demoUser));
      setUser(demoUser);
      toast.success('Logged in (demo mode)');
      return true;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password);
      localStorage.setItem('studyhub_token', data.token);
      localStorage.setItem('studyhub_user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Account created!');
      return true;
    } catch (err) {
      const newUser = {
        id: Date.now().toString(), name,
        email, role: 'CSE Student',
        avatar: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      };
      localStorage.setItem('studyhub_token', 'demo-token');
      localStorage.setItem('studyhub_user', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('Account created (demo mode)!');
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem('studyhub_token');
    localStorage.removeItem('studyhub_user');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
