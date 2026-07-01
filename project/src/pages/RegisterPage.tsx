import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from './Router';

interface RegisterPageProps {
  onSuccess: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function RegisterPage({ onSuccess, showToast }: RegisterPageProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      showToast(error, 'error');
    } else {
      showToast('Registration successful!', 'success');
      setTimeout(onSuccess, 800);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="auth-title">Join Our Club</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>Create your account and start exploring</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Create a strong password (min 6 chars)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link page="login">Login here</Link>
        </div>
      </div>
    </div>
  );
}
