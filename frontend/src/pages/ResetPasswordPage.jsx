import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.auth.resetPassword(token, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link might be expired.');
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
          Reset Password
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#8892A4',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}>
          Enter your new secure password below.
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

        {success ? (
          <div style={{
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.3)',
            color: '#4ade80',
            padding: '1.25rem',
            borderRadius: '1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Password Reset Successful!</div>
            <div style={{ fontSize: '0.85rem', color: '#8892A4' }}>Redirecting you to login...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
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
              {loading ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
