import { useContext, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RegisterPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () =>
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      !submitting,
    [name, email, password, submitting]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setError('');
      await auth.register({ name: name.trim(), email: email.trim(), password });
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
          Create Account
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#8892A4',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}>
          Join DevCard AI and build your developer identity.
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
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              autoComplete="name"
              placeholder="Your full name"
            />
          </div>

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
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              opacity: canSubmit ? 1 : 0.5,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {submitting ? 'Creating account...' : 'Register →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
            <Link
              to="/login"
              style={{
                color: '#6C63FF',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
