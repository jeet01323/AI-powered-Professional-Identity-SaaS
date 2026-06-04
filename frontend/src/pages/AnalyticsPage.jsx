import { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/api';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.getDashboard()
      .then(res => {
        if (res) setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Bar chart data (last 7 days) — from HTML reference
  const barData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const vals = [120, 185, 95, 230, 178, 142, 298];
    const max = Math.max(...vals);
    return days.map((d, i) => ({ label: d, value: vals[i], pct: (vals[i] / max) * 100 }));
  }, []);

  // Traffic sources mock data
  const trafficSources = [
    { name: 'Direct Link', pct: '42%', color: 'var(--purple)' },
    { name: 'Google Search', pct: '28%', color: 'var(--blue)' },
    { name: 'LinkedIn', pct: '18%', color: '#FF6B6B' },
    { name: 'QR Code Scan', pct: '12%', color: '#4ade80' },
  ];

  // Top countries mock data
  const countries = [
    { flag: '🇮🇳', name: 'India', pct: '48%', width: '90%' },
    { flag: '🇺🇸', name: 'USA', pct: '22%', width: '50%' },
    { flag: '🇬🇧', name: 'UK', pct: '12%', width: '28%' },
    { flag: '🇩🇪', name: 'Germany', pct: '8%', width: '18%' },
    { flag: '🇨🇦', name: 'Canada', pct: '6%', width: '15%' },
    { flag: '🌍', name: 'Others', pct: '4%', width: '10%' },
  ];

  // Device types mock data
  const devices = [
    { name: 'Mobile', pct: '54%', color: 'var(--purple)' },
    { name: 'Desktop', pct: '38%', color: 'var(--blue)' },
    { name: 'Tablet', pct: '8%', color: '#4ade80' },
  ];

  const totalVisitors = data?.profileViews || 3841;
  const uniqueVisitors = data?.qrScans ? data.profileViews - data.qrScans : 2294;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>Analytics Dashboard</h2>

      {loading ? (
        <div style={{ padding: '24px', color: 'var(--muted)' }}>Loading analytics...</div>
      ) : (
        <>
          {/* Analytics Grid - 4 Stat Cards */}
          <div className="analytics-grid">
            <div className="metric-card">
              <div className="label">👁 Total Visitors</div>
              <div className="value">{totalVisitors.toLocaleString()}</div>
              <div className="change">↑ 18% this month</div>
            </div>
            <div className="metric-card">
              <div className="label">👤 Unique Visitors</div>
              <div className="value">{uniqueVisitors.toLocaleString()}</div>
              <div className="change">↑ 12% this month</div>
            </div>
            <div className="metric-card">
              <div className="label">🎯 Lead Conversion</div>
              <div className="value">6.2%</div>
              <div className="change">↑ 0.8% this month</div>
            </div>
            <div className="metric-card">
              <div className="label">📈 Profile Score</div>
              <div className="value">88/100</div>
              <div className="change">↑ 3 pts this week</div>
            </div>
          </div>

          {/* Chart Row 1: Bar Chart + Traffic Sources */}
          <div className="chart-row">
            <div className="panel">
              <h4>Profile Views — Last 7 Days</h4>
              <div className="bar-chart">
                {barData.map((d) => (
                  <div className="bar-wrap" key={d.label}>
                    <div className="bar" style={{ height: `${d.pct}%` }} />
                    <div className="bar-label">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <h4>Traffic Sources</h4>
              <div className="donut-wrap">
                {trafficSources.map((s) => (
                  <div className="donut-item" key={s.name}>
                    <div className="donut-dot" style={{ background: s.color }} />
                    <span className="donut-name">{s.name}</span>
                    <span className="donut-pct">{s.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Row 2: Top Countries + Device Types */}
          <div className="chart-row">
            <div className="panel">
              <h4>Top Countries</h4>
              <div className="geo-grid">
                {countries.map((c) => (
                  <div className="geo-item" key={c.name}>
                    <span>{c.flag} {c.name}</span>
                    <div className="geo-bar-bg">
                      <div className="geo-bar-fill" style={{ width: c.width }} />
                    </div>
                    <span style={{ fontSize: '.75rem', color: 'var(--purple)' }}>{c.pct}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <h4>Device Types</h4>
              <div className="donut-wrap">
                {devices.map((d) => (
                  <div className="donut-item" key={d.name}>
                    <div className="donut-dot" style={{ background: d.color }} />
                    <span className="donut-name">{d.name}</span>
                    <span className="donut-pct">{d.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
