import { useContext, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0 && !submitting,
    [email, password, submitting]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setError('');
      await auth.login(email.trim(), password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '2rem',
      background: '#0B0F19',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#151A2E',
        border: '1px solid rgba(108,99,255,0.2)',
        borderRadius: '1.5rem',
        padding: '2.5rem 2rem',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <Link to="/" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
          }}>
            DevCard AI
          </Link>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '1.8rem',
          fontWeight: 800,
          textAlign: 'center',
          margin: '1rem 0 0.25rem',
          background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Welcome Back
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#8892A4',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}>
          Sign in to your DevCard account.
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(255,107,107,0.1)',
            border: '1px solid rgba(255,107,107,0.3)',
            color: '#FF6B6B',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="form-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '0.85rem',
              opacity: canSubmit ? 1 : 0.5,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {submitting ? 'Signing in...' : 'Login →'}
          </button>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.25rem',
          }}>
            <Link
              to="/register"
              style={{
                color: '#6C63FF',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              Create an account
            </Link>
            <Link
              to="/forgot-password"
              style={{
                color: '#8892A4',
                fontWeight: 500,
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
