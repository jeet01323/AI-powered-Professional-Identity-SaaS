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

  // Dynamic Bar chart data (last 7 days)
  const barData = useMemo(() => {
    if (!data?.dailyViews) return [];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split('T')[0];
      const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' });
      days.push({ id: isoDate, label: shortDay });
    }
    
    const mapped = days.map(d => {
      const found = data.dailyViews.find(v => v._id === d.id);
      return { label: d.label, value: found ? found.count : 0 };
    });
    
    const max = Math.max(...mapped.map(m => m.value), 1);
    return mapped.map(m => ({ ...m, pct: (m.value / max) * 100 }));
  }, [data]);

  // Dynamic Browsers
  const browsers = useMemo(() => {
    if (!data?.browserStats) return [];
    const total = data.browserStats.reduce((acc, curr) => acc + curr.count, 0) || 1;
    const colors = ['var(--purple)', 'var(--blue)', '#FF6B6B', '#4ade80', '#facc15'];
    return data.browserStats.map((b, i) => ({
      name: b._id,
      pct: `${Math.round((b.count / total) * 100)}%`,
      width: `${Math.round((b.count / total) * 100)}%`,
      color: colors[i % colors.length],
      flag: '🌐'
    }));
  }, [data]);

  // Dynamic Devices
  const devices = useMemo(() => {
    if (!data?.deviceStats) return [];
    const total = data.deviceStats.reduce((acc, curr) => acc + curr.count, 0) || 1;
    const colors = ['var(--purple)', 'var(--blue)', '#4ade80'];
    return data.deviceStats.map((d, i) => ({
      name: d._id,
      pct: `${Math.round((d.count / total) * 100)}%`,
      color: colors[i % colors.length]
    }));
  }, [data]);

  const totalVisitors = data?.totalViews || 0;
  const uniqueVisitors = data?.uniqueVisitors || 0;

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
              <div className="change" style={{ opacity: 0.6 }}>Lifetime views</div>
            </div>
            <div className="metric-card">
              <div className="label">👤 Unique Visitors</div>
              <div className="value">{uniqueVisitors.toLocaleString()}</div>
              <div className="change" style={{ opacity: 0.6 }}>Distinct IPs</div>
            </div>
            <div className="metric-card">
              <div className="label">🎯 Contact Clicks</div>
              <div className="value">{data?.contactClicks || 0}</div>
              <div className="change" style={{ opacity: 0.6 }}>Clicks on contact info</div>
            </div>
            <div className="metric-card">
              <div className="label">📥 Resume Downloads</div>
              <div className="value">{data?.resumeDownloads || 0}</div>
              <div className="change" style={{ opacity: 0.6 }}>Total downloads</div>
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
              <h4>Top Browsers</h4>
              <div className="donut-wrap">
                {browsers.length === 0 ? <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>No data yet.</div> : null}
                {browsers.map((s) => (
                  <div className="donut-item" key={s.name}>
                    <div className="donut-dot" style={{ background: s.color }} />
                    <span className="donut-name">{s.name}</span>
                    <span className="donut-pct">{s.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Row 2: Top Browsers Bar + Device Types */}
          <div className="chart-row">
            <div className="panel">
              <h4>Browsers Breakdown</h4>
              <div className="geo-grid">
                {browsers.length === 0 ? <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>No data yet.</div> : null}
                {browsers.map((c) => (
                  <div className="geo-item" key={c.name}>
                    <span>{c.flag} {c.name}</span>
                    <div className="geo-bar-bg">
                      <div className="geo-bar-fill" style={{ width: c.width, background: c.color }} />
                    </div>
                    <span style={{ fontSize: '.75rem', color: 'var(--purple)' }}>{c.pct}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <h4>Device Types</h4>
              <div className="donut-wrap">
                {devices.length === 0 ? <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>No data yet.</div> : null}
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
