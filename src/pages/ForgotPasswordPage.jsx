import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.forgotPassword({ email });
      // In a real app, the backend would email this. Since we have no SMTP, we just show it for the demo.
      if (res.resetUrl) {
        setResetUrl(res.resetUrl);
      } else {
        alert("Check your email for the reset link.");
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
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
          fontSize: '1.6rem',
          fontWeight: 800,
          textAlign: 'center',
          margin: '1rem 0 0.25rem',
          color: '#F8FAFC',
        }}>
          Forgot Password
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#8892A4',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}>
          Enter your email to receive a reset link.
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

        {resetUrl ? (
          <div style={{
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.3)',
            color: '#4ade80',
            padding: '1.25rem',
            borderRadius: '1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>
              Email Sent (Simulated)!
            </div>
            <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#8892A4' }}>
              Since we do not have an SMTP server configured yet, click the link below to securely reset your password.
            </div>
            <a
              href={resetUrl}
              className="btn-primary"
              style={{
                display: 'inline-block',
                width: '100%',
                padding: '0.85rem',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Reset Password
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={{
            color: '#6C63FF',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}>
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
