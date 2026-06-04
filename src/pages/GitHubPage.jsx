import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function GitHubPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubData, setGithubData] = useState(null);

  useEffect(() => {
    api.profile.getMe()
      .then(async (data) => {
        let currentUname = data?.githubData?.username || '';
        
        // Extract from social links if available
        const githubLink = data?.socialLinks?.find(link => 
          link.platform?.toLowerCase() === 'github' || link.url?.includes('github.com')
        )?.url;
        
        if (githubLink) {
          const parts = githubLink.replace(/\/$/, '').split('/');
          const extracted = parts[parts.length - 1];
          if (extracted) currentUname = extracted;
        }

        if (currentUname) {
          setUsername(currentUname);
          if (data?.githubData?.username) {
            setGithubData(data.githubData);
          }
          // Auto-sync real time data
          setLoading(true);
          try {
            const res = await api.github.connect({ username: currentUname });
            setGithubData(res.githubData);
          } catch (err) {
            console.error('Auto-sync failed', err);
          } finally {
            setLoading(false);
          }
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
      toast.success('GitHub connected successfully!');
    } catch (err) {
      toast.error('Failed to connect GitHub: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const repos = githubData?.repositories || [];
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks || 0), 0);
  const followers = githubData?.followers ?? 0;
  const repoCount = githubData?.publicRepos ?? repos.length;

  // Top repositories sorted by stars
  const displayRepos = [...repos].sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 5);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>GitHub Integration</h2>
        {githubData && (
          <button className="btn-outline" onClick={handleConnect} disabled={loading} style={{ fontSize: '.8rem', padding: '.4rem .8rem' }}>
            {loading ? 'Syncing...' : '🔄 Sync Real-Time Data'}
          </button>
        )}
      </div>

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
          <div className="value">{githubData ? repoCount : 48}</div>
        </div>
        <div className="metric-card">
          <div className="label">⭐ Total Stars</div>
          <div className="value">{githubData ? totalStars : 312}</div>
        </div>
        <div className="metric-card">
          <div className="label">🔀 Forks</div>
          <div className="value">{githubData ? totalForks : 94}</div>
        </div>
        <div className="metric-card">
          <div className="label">👥 Followers</div>
          <div className="value">{githubData ? followers : 156}</div>
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
          {githubData && displayRepos.length === 0 && (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '.85rem' }}>
              No public repositories found.
            </div>
          )}
          {!githubData && (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '.85rem' }}>
              Connect your account to see your top repositories.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
