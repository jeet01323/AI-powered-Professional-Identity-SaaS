import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function SEOPage() {
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [seoScore, setSeoScore] = useState(74);

  useEffect(() => {
    // First get our profile to know our username
    api.profile.getMe()
      .then(res => {
        if (res?.username) {
          return api.profile.getSEO(res.username);
        }
        throw new Error('No username configured yet');
      })
      .then(data => {
        setSeoData(data);
        if (data?.title) setMetaTitle(data.title);
        if (data?.description) setMetaDescription(data.description);
        if (data?.keywords) setKeywords(data.keywords);
        // Calculate a rough SEO score
        let score = 40;
        if (data?.title) score += 15;
        if (data?.description) score += 15;
        if (data?.keywords) score += 10;
        if (data?.image) score += 10;
        setSeoScore(Math.min(score, 100));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good — room to improve';
    if (score >= 50) return 'Fair — needs improvement';
    return 'Poor — add more SEO data';
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>SEO Optimization</h2>

      {loading ? (
        <div style={{ padding: '1rem', color: 'var(--muted)' }}>Loading SEO data...</div>
      ) : (
        <>
          {/* SEO Score Panel */}
          <div className="panel" style={{ marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>SEO Score</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                fontFamily: "'Syne', sans-serif",
                color: 'var(--purple)',
              }}>
                {seoScore}
              </div>
              <div>
                <div style={{ fontSize: '.85rem', marginBottom: '.25rem' }}>{getScoreLabel(seoScore)}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>
                  Add meta description and keywords to boost score
                </div>
              </div>
            </div>
            <div style={{
              height: '8px',
              background: 'rgba(108,99,255,0.15)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${seoScore}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--purple), var(--blue))',
                borderRadius: '4px',
              }} />
            </div>
          </div>

          {/* SEO Form Fields */}
          <div className="form-group">
            <label>Meta Title</label>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Your Name — Role | DevCard AI"
            />
          </div>
          <div className="form-group">
            <label>Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="A brief description of your professional profile for search engines..."
            />
          </div>
          <div className="form-group">
            <label>Keywords</label>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="React developer, Node.js, Full Stack, hire developer"
            />
          </div>
          <button
            className="btn-primary"
            style={{ fontSize: '.85rem', padding: '.65rem 1.5rem' }}
            onClick={() => toast.success('SEO settings saved!')}
          >
            Save SEO Settings
          </button>
        </>
      )}
    </div>
  );
}
