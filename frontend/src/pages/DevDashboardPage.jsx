import { useMemo, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { AuthContext } from '../context/AuthContext';

export default function DevDashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    profileViews: 0,
    qrScans: 0,
    resumeDownloads: 0,
    contactClicks: 0,
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.analytics.getDashboard(),
      api.profile.getMe()
    ])
      .then(([analyticsData, profileData]) => {
        if (analyticsData) setAnalytics(analyticsData);
        if (profileData) setProfile(profileData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const data = useMemo(() => {
    let score = 0;
    const activity = [];
    let suggestions = [];

    if (profile) {
      if (profile.displayName) score += 10;
      if (profile.bio) { score += 20; } else { suggestions.push('Write a professional bio'); }
      if (profile.headline) { score += 15; } else { suggestions.push('Add a catchy headline'); }
      if (profile.skills?.length > 0) { score += 15; } else { suggestions.push('List your technical skills'); }
      if (profile.projects?.length > 0) { score += 20; } else { suggestions.push('Add projects to your portfolio'); }
      if (profile.resumeUrl) { score += 10; } else { suggestions.push('Upload your resume'); }
      if (profile.profilePhoto) { score += 10; } else { suggestions.push('Upload a profile photo'); }

      if (profile.updatedAt) {
        activity.push({ title: 'Profile last updated', time: new Date(profile.updatedAt).toLocaleDateString() });
      }
      if (profile.githubData?.username) {
        activity.push({ title: 'GitHub account synced', time: 'Active' });
      }
      if (profile.projects?.length > 0) {
        activity.push({ title: `${profile.projects.length} project(s) in portfolio`, time: 'Active' });
      }
      if (profile.isPublished) {
        activity.push({ title: 'Profile is live and visible', time: 'Active' });
      }
    }

    if (suggestions.length === 0) suggestions.push('Your profile looks great!');
    if (activity.length === 0) activity.push({ title: 'Welcome to DevCard AI!', time: 'Just now' });

    return {
      stats: [
        { label: 'Profile Views', value: analytics.totalViews || analytics.profileViews || 0, hint: 'All time' },
        { label: 'QR Scans', value: analytics.qrScans, hint: 'All time' },
        { label: 'Resume Downloads', value: analytics.resumeDownloads, hint: 'All time' },
        { label: 'Contact Clicks', value: analytics.contactClicks, hint: 'All time' },
      ],
      suggestions,
      score,
      activity,
    };
  }, [analytics, profile]);

  // Generate heatmap cells (random, like the HTML reference does)
  const heatmapCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < 364; i++) {
      const r = Math.random();
      let level = '';
      if (r > 0.9) level = 'l4';
      else if (r > 0.75) level = 'l3';
      else if (r > 0.55) level = 'l2';
      else if (r > 0.35) level = 'l1';
      cells.push(level);
    }
    return cells;
  }, []);

  const userName = user?.name || profile?.displayName || 'Developer';
  const profileScore = data.score;

  // AI suggestion items matching the HTML reference
  const aiSuggestions = [
    { icon: '✨', text: 'Improve your headline — click to generate', path: '/app/ai-studio' },
    { icon: '📁', text: 'Add 2 more projects to boost visibility', path: '/app/profile-builder' },
    { icon: '🎯', text: 'Optimize profile for recruiter searches', path: '/app/ai-studio' },
    { icon: '🔗', text: 'Add LinkedIn & Twitter social links', path: '/app/profile-builder' },
  ];

  // Mock leads (HTML reference data)
  const recentLeads = [
    { initials: 'AK', name: 'Amit Kumar', time: '2 hours ago · Mumbai' },
    { initials: 'SR', name: 'Sara Rahman', time: 'Yesterday · Bangalore' },
    { initials: 'JM', name: 'John Miller', time: '2 days ago · London' },
  ];

  return (
    <div>
      {/* Welcome Card */}
      <div className="welcome-card">
        <div>
          <h2>Hello {userName} 👋</h2>
          <p>Your profile is {profileScore}% complete. Keep going!</p>
        </div>
        <div className="progress-ring">
          <div
            className="ring"
            style={{ background: `conic-gradient(var(--purple) ${profileScore}%, rgba(108,99,255,0.2) 0)` }}
          >
            {profileScore}%
          </div>
          <div style={{ fontSize: '.8rem', color: 'var(--muted)', maxWidth: '80px' }}>
            Complete your bio to reach 100%
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="label">👁️ Profile Views</div>
          <div className="value">{(analytics.totalViews || analytics.profileViews || 0).toLocaleString()}</div>
          <div className="change">↑ 12% this week</div>
        </div>
        <div className="metric-card">
          <div className="label">❤️ Engagement</div>
          <div className="value">{analytics.contactClicks || 68}%</div>
          <div className="change">↑ 5% this week</div>
        </div>
        <div className="metric-card">
          <div className="label">📥 Leads</div>
          <div className="value">{analytics.resumeDownloads || 23}</div>
          <div className="change">↑ 3 new today</div>
        </div>
        <div className="metric-card">
          <div className="label">🌍 Countries</div>
          <div className="value">14</div>
          <div className="change">+2 this month</div>
        </div>
      </div>

      {/* Two Column: AI Suggestions + Recent Leads */}
      <div className="two-col">
        <div className="panel">
          <h4>🤖 AI Suggestions</h4>
          {aiSuggestions.map((s, i) => (
            <div
              className="ai-suggestion"
              key={i}
              onClick={() => navigate(s.path)}
              style={{ cursor: 'pointer' }}
            >
              <span>{s.icon}</span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>
        <div className="panel">
          <h4>🧑‍💼 Recent Leads</h4>
          {recentLeads.map((lead, i) => (
            <div className="lead-item" key={i}>
              <div className="lead-avatar">{lead.initials}</div>
              <div>
                <div className="lead-name">{lead.name}</div>
                <div className="lead-time">{lead.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Activity Heatmap */}
      <div className="panel" style={{ marginTop: '1rem' }}>
        <h4>🐙 GitHub Activity</h4>
        <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.5rem' }}>
          482 contributions in the last year
        </p>
        <div className="heatmap">
          {heatmapCells.map((level, i) => (
            <div key={i} className={`heatmap-cell${level ? ' ' + level : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
