import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase Auth is not properly configured. Cannot login as Admin.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="login-box glass">
        <div className="login-header">
          <div className="login-icon-wrapper text-gradient">
            <ShieldCheck size={48} />
          </div>
          <h1 className="login-title">Admin <span className="text-gradient">Access</span></h1>
          <p className="login-subtitle">Secure dashboard authentication</p>
        </div>

        {error && <div className="login-error glass">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group-login">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com" 
                required 
              />
            </div>
          </div>
          
          <div className="form-group-login">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full login-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : (
              <>Secure Connect <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="login-back">
          <a href="/" className="back-link">← Return to Portfolio</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
