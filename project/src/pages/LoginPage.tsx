import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from './Router';

interface LoginPageProps {
  onSuccess: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function LoginPage({ onSuccess, showToast }: LoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      showToast(error, 'error');
    } else {
      showToast('Login successful!', 'success');
      setTimeout(onSuccess, 800);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="auth-title">Welcome Back</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>Login to continue your cultural journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="your.email@university.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link page="register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
