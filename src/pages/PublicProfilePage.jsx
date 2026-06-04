import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api, getImageUrl } from '../lib/api';

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactStatus, setContactStatus] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    api.profile.getPublic(username)
      .then(res => {
        setProfile(res);
        // Track view
        api.analytics.track({ profileId: res._id, eventType: 'view' }).catch(console.error);
      })
      .catch(err => setError(err.message || 'Profile not found'))
      .finally(() => setLoading(false));
  }, [username]);

  const handleContact = async (e) => {
    e.preventDefault();
    setContactStatus('sending');
    try {
      await api.contact.sendMessage({ username, name, email, message });
      setContactStatus('success');
      setName('');
      setEmail('');
      setMessage('');

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setContactStatus(''), 5000);

      // Track contact click
      api.analytics.track({ profileId: profile._id, eventType: 'contact_click' }).catch(console.error);
    } catch (err) {
      setContactStatus('error');
      alert(err.message || 'Failed to send message');
    }
  };

  const handleResumeDownload = () => {
    api.analytics.track({ profileId: profile._id, eventType: 'resume_download' }).catch(console.error);
    window.open(profile.resumeUrl, '_blank');
  };

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>😕</div>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>{error || 'Profile not found'}</div>
        </div>
      </div>
    );
  }

  const profileSkills = profile.skills || profile.techStack || [];
  const profileProjects = profile.projects || [];
  const socialLinks = [];
  if (profile.github || profile.githubUrl) socialLinks.push({ icon: '🐙', label: 'GitHub', url: profile.github || profile.githubUrl });
  if (profile.linkedin || profile.linkedinUrl) socialLinks.push({ icon: '💼', label: 'LinkedIn', url: profile.linkedin || profile.linkedinUrl });
  if (profile.twitter || profile.twitterUrl) socialLinks.push({ icon: '🐦', label: 'Twitter', url: profile.twitter || profile.twitterUrl });
  if (profile.email) socialLinks.push({ icon: '📧', label: 'Email', url: `mailto:${profile.email}` });
  if (profile.portfolioWebsite) socialLinks.push({ icon: '🌐', label: 'Website', url: profile.portfolioWebsite });

  return (
    <div className="public-profile">
      {/* Banner */}
      <div className="profile-banner">
        <div className="profile-img">
          {profile.profilePhoto ? (
            <img
              src={getImageUrl(profile.profilePhoto)}
              alt={profile.displayName}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            profile.displayName?.[0] || '👤'
          )}
        </div>
      </div>

      {/* Profile Info + Hire Button Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="profile-info">
          <div className="profile-name">{profile.displayName}</div>
          <div className="profile-role">{profile.headline || profile.designation || 'Developer'} · Open to Work</div>
          {profile.location && (
            <div className="profile-location">📍 {profile.location}</div>
          )}
          <div className="social-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                className="social-link"
                href={link.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  api.analytics.track({ profileId: profile._id, eventType: 'social_click', meta: link.label }).catch(console.error);
                }}
              >
                {link.icon} {link.label}
              </a>
            ))}
          </div>
        </div>
        {profile.resumeUrl ? (
          <button className="hire-btn" onClick={handleResumeDownload}>Hire Me 🚀</button>
        ) : (
          <button className="hire-btn" onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}>Hire Me 🚀</button>
        )}
      </div>

      {/* Share Row */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <a
          className="social-link"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${profile.displayName}'s professional profile!`)}`}
          target="_blank"
          rel="noreferrer"
        >
          🐦 Share on Twitter
        </a>
        <a
          className="social-link"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noreferrer"
        >
          💼 Share on LinkedIn
        </a>
        <a
          className="social-link"
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${profile.displayName}'s professional profile! ${window.location.href}`)}`}
          target="_blank"
          rel="noreferrer"
        >
          📱 WhatsApp
        </a>
      </div>

      {/* About Me */}
      {profile.bio && (
        <div className="profile-section">
          <h3>About Me</h3>
          <p className="about-text">{profile.bio}</p>
          <p className="about-text" style={{ marginTop: '.75rem' }}>
            🤖 <em>AI-generated with DevCard AI</em>
          </p>
        </div>
      )}

      {/* Skills */}
      {profileSkills.length > 0 && (
        <div className="profile-section">
          <h3>Skills</h3>
          <div className="skills-grid">
            {profileSkills.map((skill) => (
              <span key={skill} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {profileProjects.length > 0 && (
        <div className="profile-section">
          <h3>Projects</h3>
          <div className="project-cards">
            {profileProjects.map((project, i) => (
              <div key={project._id || project.id || i} className="project-card">
                <h4>{project.title || project.name}</h4>
                <p>{project.description}</p>
                {(project.techStack || project.tags)?.length > 0 && (
                  <div className="project-tags">
                    {(project.techStack || project.tags).map((tag) => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>
                )}
                {(project.liveLink || project.liveUrl || project.githubLink || project.githubUrl) && (
                  <div style={{ display: 'flex', gap: '.5rem', marginTop: '.75rem' }}>
                    {(project.liveLink || project.liveUrl) && (
                      <a className="social-link" href={project.liveLink || project.liveUrl} target="_blank" rel="noreferrer" style={{ fontSize: '.75rem' }}>🔗 Live</a>
                    )}
                    {(project.githubLink || project.githubUrl) && (
                      <a className="social-link" href={project.githubLink || project.githubUrl} target="_blank" rel="noreferrer" style={{ fontSize: '.75rem' }}>🐙 GitHub</a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Me */}
      <div className="profile-section" id="contact-section">
        <h3>Contact Me</h3>
        <div className="contact-form">
          <h4>Let's Work Together 🤝</h4>
          {contactStatus === 'success' ? (
            <div style={{ padding: '1rem', background: 'rgba(74,222,128,0.15)', color: '#4ade80', borderRadius: '.75rem', fontWeight: 600, textAlign: 'center' }}>
              ✅ Message sent successfully!
            </div>
          ) : (
            <form onSubmit={handleContact}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  placeholder={`Hi ${profile.displayName?.split(' ')[0] || 'there'}, I'd like to discuss...`}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={contactStatus === 'sending'}
                style={{ width: '100%', padding: '.75rem', borderRadius: '.75rem' }}
              >
                {contactStatus === 'sending' ? 'Sending...' : 'Send Message ✉️'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '.8rem' }}>
        <div style={{ marginBottom: '.5rem' }}>📊 Profile views · Powered by analytics</div>
        <div>Built with <a href="/" style={{ color: 'var(--purple)', textDecoration: 'none' }}>DevCard AI</a> · devcard.ai/{username}</div>
      </div>
    </div>
  );
}
