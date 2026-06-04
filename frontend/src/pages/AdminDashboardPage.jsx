import { useState, useEffect } from 'react';
import { api } from '../lib/api';

function StatCard({ title, value, icon }) {
  return (
    <div className="metric-card">
      <div className="label">
        <span>{icon}</span> {title}
      </div>
      <div className="value">{value}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.admin.getDashboard()
      .then(setStats)
      .catch(err => setError(err.message || 'Failed to load admin stats'))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div style={{
        padding: '3rem 2rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div className="panel" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.3rem',
            fontWeight: 800,
            color: '#FF6B6B',
            marginBottom: '0.5rem',
          }}>
            Access Denied
          </h2>
          <p style={{ color: '#8892A4', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{error}</p>
          <p style={{ color: '#8892A4', fontSize: '0.85rem' }}>You need to be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '1.6rem',
          fontWeight: 800,
          color: '#F8FAFC',
          marginBottom: '0.25rem',
        }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#8892A4', fontSize: '0.9rem' }}>
          Real-time platform statistics and activity metrics.
        </p>
      </div>

      {loading ? (
        <div style={{
          display: 'grid',
          placeItems: 'center',
          height: '200px',
          color: '#8892A4',
          fontSize: '0.95rem',
        }}>
          Loading real-time data...
        </div>
      ) : stats ? (
        <div className="metrics-grid">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
          />
          <StatCard
            title="Active Profiles"
            value={stats.totalProfiles}
            icon="✨"
          />
          <StatCard
            title="Messages Sent"
            value={stats.totalContacts}
            icon="✉️"
          />
          <StatCard
            title="Analytics Events"
            value={stats.totalAnalyticsEvents}
            icon="📈"
          />
        </div>
      ) : null}
    </div>
  );
}
