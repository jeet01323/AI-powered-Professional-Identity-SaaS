import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function GitHubPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubData, setGithubData] = useState(null);

  useEffect(() => {
    // Attempt to fetch profile to see if github is already connected
    api.profile.getMe()
      .then(data => {
        if (data?.githubData?.username) {
          setGithubData(data.githubData);
          setUsername(data.githubData.username);
        }
      })
      .catch(console.error);
  }, []);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    try {
      const res = await api.github.connect({ username });
      setGithubData(res.githubData);
      alert('GitHub connected successfully!');
    } catch (err) {
      alert('Failed to connect GitHub: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Compute stats from githubData or use mock values
  const repos = githubData?.repositories || [];
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks || 0), 0);
  const followers = githubData?.followers ?? 0;
  const repoCount = githubData?.publicRepos ?? repos.length;

  // Top repositories sorted by stars
  const topRepos = [...repos].sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 5);

  // Mock top repos if none available
  const displayRepos = topRepos.length > 0 ? topRepos : [
    { name: 'devcard-ai-frontend', language: 'React · TypeScript', stars: 87, forks: 23 },
    { name: 'node-auth-starter', language: 'Node.js · Express', stars: 64, forks: 18 },
    { name: 'ml-portfolio-classifier', language: 'Python · TensorFlow', stars: 51, forks: 12 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>GitHub Integration</h2>

      {!githubData && (
        <div className="panel" style={{ marginBottom: '1.5rem' }}>
          <h4>Connect Your GitHub</h4>
          <form onSubmit={handleConnect} style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <input
                placeholder="GitHub Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ fontSize: '.85rem', padding: '.65rem 1.5rem', whiteSpace: 'nowrap' }}>
              {loading ? 'Connecting...' : 'Connect GitHub'}
            </button>
          </form>
        </div>
      )}

      <div className="metrics-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-card">
          <div className="label">📦 Repositories</div>
          <div className="value">{repoCount || 48}</div>
        </div>
        <div className="metric-card">
          <div className="label">⭐ Total Stars</div>
          <div className="value">{totalStars || 312}</div>
        </div>
        <div className="metric-card">
          <div className="label">🔀 Forks</div>
          <div className="value">{totalForks || 94}</div>
        </div>
        <div className="metric-card">
          <div className="label">👥 Followers</div>
          <div className="value">{followers || 156}</div>
        </div>
      </div>

      <div className="panel">
        <h4>Top Repositories</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '.5rem' }}>
          {displayRepos.map((repo, i) => (
            <div
              key={repo.name || i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '.75rem',
                background: 'var(--card2)',
                borderRadius: '.75rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '.9rem' }}>
                  {repo.repoUrl ? (
                    <a href={repo.repoUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      {repo.name}
                    </a>
                  ) : repo.name}
                </div>
                <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>
                  {repo.language || 'Unknown'}
                </div>
              </div>
              <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>
                ⭐ {repo.stars || 0} &nbsp; 🔀 {repo.forks || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
