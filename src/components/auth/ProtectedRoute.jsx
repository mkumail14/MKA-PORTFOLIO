import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader pulse-dot"></div>
        <p className="mt-4 text-gradient">Verifying Credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || !auth) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="glass p-8" style={{ padding: '3rem', borderRadius: '16px', maxWidth: '400px' }}>
          <ShieldAlert size={48} className="text-gradient mx-auto mb-4" />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You need administrator privileges to access this area.</p>
          <a href="/admin/login" className="btn btn-primary">Go to Login</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
