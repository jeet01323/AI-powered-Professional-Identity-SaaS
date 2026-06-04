import { useNavigate } from 'react-router-dom';
import DevProfileCard from './DevProfileCard';

export default function DevCardLanding() {
  const navigate = useNavigate();

  return (
    <div className="page active">
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow"></div>
        <p><span className="tag-purple">✨ AI-Powered Platform</span></p>
        <h1>
          Your Developer Portfolio<br />
          Wasn't Built for <span>2026.</span><br />
          DevCard AI Is.
        </h1>
        <p>
          Create a stunning developer profile, generate professional bios with AI,
          showcase GitHub achievements, track visitors, manage leads, and grow your
          personal brand — all from one powerful platform.
        </p>
        <div className="btn-group">
          <button className="btn-primary" onClick={() => navigate('/register')}>
            🚀 Build My DevCard
          </button>
          <button className="btn-outline" onClick={() => navigate('/login')}>
            ✨ View Demo Profile
          </button>
        </div>

        {/* Card Preview */}
        <div style={{ maxWidth: '420px', margin: '3rem auto 0' }}>
          <DevProfileCard />
          <div className="float-badges">
            <div className="badge" style={{ top: 0, left: 0 }}>🤖 AI Bio Generated</div>
            <div className="badge" style={{ top: '5px', right: 0 }}>📊 Live Analytics</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '4rem 2rem' }}>
        <div className="centered">
          <div className="section-label">✨ Everything You Need</div>
        </div>
        <h2 className="section-title">One Platform. Infinite Possibilities.</h2>
        <p className="section-sub">
          DevCard AI combines the power of AI, portfolio management, and analytics
          into one seamless developer identity platform.
        </p>
        <div className="features-grid">
          {[
            { icon: '🤖', title: 'AI Bio Generator', desc: 'Generate professional developer bios instantly using Gemini AI. Tailored to your skills and experience.' },
            { icon: '🐙', title: 'GitHub Integration', desc: 'Auto-import repositories, contribution graphs, languages, and stats. Always in sync.' },
            { icon: '📄', title: 'Resume Management', desc: 'Upload and showcase your resume professionally. Enable one-click downloads for recruiters.' },
            { icon: '🎨', title: 'Portfolio Builder', desc: 'Drag & Drop sections for projects, experience, and achievements. No code needed.' },
            { icon: '📊', title: 'Analytics Dashboard', desc: 'Track profile views, visitor locations, device types, and engagement metrics in real time.' },
            { icon: '📱', title: 'QR Code Sharing', desc: 'Share your profile instantly with a personalized QR code. Perfect for networking events.' },
            { icon: '🔍', title: 'SEO Optimization', desc: 'Built-in meta tags, structured data, and keyword tools to rank higher on Google.' },
            { icon: '💎', title: 'Premium Themes', desc: 'Customize colors, fonts, layouts, and branding to match your personal style perfectly.' },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '2rem 2rem 5rem' }}>
        <div className="centered">
          <div className="section-label">💎 Simple Pricing</div>
        </div>
        <h2 className="section-title">Start Free. Scale When Ready.</h2>
        <p className="section-sub">
          No credit card required for the free plan. Upgrade anytime to unlock AI superpowers.
        </p>
        <div className="pricing-grid" style={{ maxWidth: '750px' }}>
          {/* Free */}
          <div className="price-card">
            <div className="plan-name">Free</div>
            <div className="plan-price">₹0<span>/mo</span></div>
            <div className="plan-desc">Perfect for getting started with your developer identity.</div>
            <ul className="plan-features">
              <li className="active"><span className="check">✓</span> Basic Profile</li>
              <li className="active"><span className="check">✓</span> GitHub Integration</li>
              <li className="active"><span className="check">✓</span> Resume Upload</li>
              <li className="active"><span className="check">✓</span> QR Code Sharing</li>
              <li style={{ opacity: 0.4 }}><span>✗</span> AI Features</li>
              <li style={{ opacity: 0.4 }}><span>✗</span> Analytics</li>
            </ul>
            <button
              className="btn-outline"
              style={{ width: '100%', borderRadius: '.75rem', padding: '.75rem' }}
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </button>
          </div>

          {/* Pro */}
          <div className="price-card popular">
            <div className="popular-badge">⭐ Most Popular</div>
            <div className="plan-name">Pro</div>
            <div className="plan-price">₹499<span>/mo</span></div>
            <div className="plan-desc">For developers serious about their personal brand.</div>
            <ul className="plan-features">
              <li className="active"><span className="check">✓</span> Everything in Free</li>
              <li className="active"><span className="check">✓</span> AI Bio Generator</li>
              <li className="active"><span className="check">✓</span> Premium Themes</li>
              <li className="active"><span className="check">✓</span> Analytics Dashboard</li>
              <li className="active"><span className="check">✓</span> SEO Tools</li>
              <li className="active"><span className="check">✓</span> Lead Downloads</li>
            </ul>
            <button
              className="btn-primary"
              style={{ width: '100%', borderRadius: '.75rem', padding: '.75rem' }}
              onClick={() => navigate('/register')}
            >
              Go Pro 🚀
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">DevCard AI</div>
        <p>Build Your Developer Identity. Powered by AI.</p>
        <p style={{ marginTop: '.5rem', fontSize: '.75rem' }}>
          © {new Date().getFullYear()} DevCard AI · All rights reserved
        </p>
      </footer>
    </div>
  );
}
