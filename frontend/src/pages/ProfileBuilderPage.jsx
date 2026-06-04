import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

const DEFAULT_SKILLS = [
  'React.js', 'Node.js', 'MongoDB', 'TypeScript', 'Express.js', 'Python',
  'TailwindCSS', 'Docker', 'AWS', 'GraphQL', 'Redis', 'PostgreSQL',
  'Next.js', 'Vue.js', 'Flutter', 'Kubernetes',
];

const STEP_LABELS = [
  '1. Personal Info', '2. Skills', '3. Experience', '4. Projects',
  '5. Resume', '6. Social Links', '7. Theme', '8. Publish',
];

function ProfileBuilderPage() {
  const [step, setStep] = useState(0);

  // ── Existing state (preserved from original) ──
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    firstName: '',
    lastName: '',
    headline: '',
    bio: '',
    location: '',
    email: '',
    website: '',
    githubUsername: '',
    profilePhoto: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('');

  // ── New local-only state for steps without backend support ──
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');

  const [experience, setExperience] = useState({
    jobTitle: '', company: '', startDate: '', endDate: '', description: '',
  });

  const [projects, setProjects] = useState([
    { name: '', description: '', liveUrl: '', githubUrl: '', techStack: '' },
  ]);

  const [resumeFile, setResumeFile] = useState(null);
  const resumeInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [socialLinks, setSocialLinks] = useState({
    github: '', linkedin: '', twitter: '', portfolio: '',
  });

  const [selectedTheme, setSelectedTheme] = useState('dark-pro');
  const [copied, setCopied] = useState(false);

  // ── QR Code state ──
  const [qrCodeData, setQrCodeData] = useState(null);
  const [generatingQr, setGeneratingQr] = useState(false);

  // ── Debounced username check (preserved) ──
  useEffect(() => {
    if (!form.username) { setUsernameStatus(''); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await api.profile.checkUsername(form.username);
        setUsernameStatus(res?.available ? 'available' : 'taken');
      } catch { /* ignore */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.username]);

  // ── Fetch existing profile (preserved) ──
  useEffect(() => {
    api.profile.getMe()
      .then(data => {
        if (data) {
          setProfileExists(true);
          setForm(prev => ({
            ...prev,
            username: data.username || '',
            displayName: data.displayName || '',
            firstName: data.displayName ? data.displayName.split(' ')[0] : '',
            lastName: data.displayName ? data.displayName.split(' ').slice(1).join(' ') : '',
            headline: data.headline || '',
            bio: data.bio || '',
            location: data.location || '',
            email: data.email || '',
            website: data.portfolioWebsite || '',
            githubUsername: data.githubData?.username || '',
            profilePhoto: data.profilePhoto || '',
          }));
          if (data.skills && Array.isArray(data.skills)) {
            const parsedSkills = data.skills
              .map(s => typeof s === 'string' ? s : (s && s.name ? s.name : ''))
              .filter(s => typeof s === 'string' && s.trim().length > 0);
            setSelectedSkills(parsedSkills);
          }
          if (data.socialLinks && Array.isArray(data.socialLinks)) {
            const links = {};
            data.socialLinks.forEach(l => { links[l.platform?.toLowerCase()] = l.url; });
            setSocialLinks(prev => ({
              ...prev,
              github: links.github || '',
              linkedin: links.linkedin || '',
              twitter: links.twitter || '',
              portfolio: links.portfolio || data.portfolioWebsite || '',
            }));
          }
          if (data.projects && data.projects.length) {
            setProjects(data.projects);
          }
        }
      })
      .catch(() => setProfileExists(false))
      .finally(() => setLoading(false));
  }, []);

  // ── Save profile (preserved API calls) ──
  const saveProfile = async () => {
    setSaving(true);
    const payload = {
      username: form.username,
      displayName: `${form.firstName} ${form.lastName}`.trim() || form.username || 'User',
      headline: form.headline,
      bio: form.bio,
      location: form.location,
      portfolioWebsite: form.website || socialLinks.portfolio,
      skills: selectedSkills.map(name => ({ name })),
      projects: projects.filter(p => p.name || p.title).map(p => ({ title: p.name || p.title, description: p.description, liveLink: p.liveUrl, githubLink: p.githubUrl, techStack: typeof p.techStack === 'string' ? p.techStack.split(',').map(s => s.trim()) : p.techStack })),
      socialLinks: [
        { platform: 'github', url: socialLinks.github },
        { platform: 'linkedin', url: socialLinks.linkedin },
        { platform: 'twitter', url: socialLinks.twitter }
      ].filter(l => l.url)
    };
    try {
      if (profileExists) {
        await api.profile.update(payload);
      } else {
        await api.profile.create(payload);
        setProfileExists(true);
      }
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to save profile');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: typeof e === 'string' ? e : e.target.value }));

  // ── Skill toggle ──
  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (s && !selectedSkills.includes(s)) {
      setSelectedSkills(prev => [...prev, s]);
      setCustomSkill('');
    }
  };

  // ── Project helpers ──
  const updateProject = (idx, field, value) => {
    setProjects(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };
  const addProject = () => {
    setProjects(prev => [...prev, { name: '', description: '', liveUrl: '', githubUrl: '', techStack: '' }]);
  };

  // ── Resume file ──
  const handleResumeDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (file) setResumeFile(file);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!profileExists) {
      toast.error("Please enter a username and click Next to save your profile first before uploading a photo.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    setUploadingPhoto(true);
    try {
      const res = await api.upload.profilePhoto(formData);
      setForm(prev => ({ ...prev, profilePhoto: res.profilePhoto }));
      toast.success('Photo uploaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ── Copy URL ──
  const profileUrl = `devcard.ai/${form.username || 'username'}`;
  const copyUrl = () => {
    navigator.clipboard.writeText(`https://${profileUrl}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Step navigation ──
  const goNext = async () => {
    // Save to backend on step 0 (personal info)
    if (step === 0) {
      const ok = await saveProfile();
      if (!ok) return;
    }
    if (step < 7) setStep(step + 1);
  };
  const goBack = () => { if (step > 0) setStep(step - 1); };

  // ── Theme data ──
  const themes = [
    { key: 'dark-pro', label: 'Dark Pro', gradient: 'linear-gradient(135deg,#0B0F19,#151A2E)', selected: true },
    { key: 'clean-light', label: 'Clean Light', gradient: 'linear-gradient(135deg,#f8fafc,#e2e8f0)' },
    { key: 'galaxy', label: 'Galaxy', gradient: 'linear-gradient(135deg,#0f0c29,#302b63)', pro: true },
    { key: 'midnight', label: 'Midnight', gradient: 'linear-gradient(135deg,#1a1a2e,#16213e)', pro: true },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', paddingTop: '70px' }}>
        <div style={{ color: 'white', fontWeight: 600, fontSize: '1.2rem' }}>Loading your profile...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '.5rem' }}>Profile Builder</h2>
      <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '1.5rem' }}>
        Complete your developer profile step by step
      </p>

      {/* ── Step Buttons ── */}
      <div className="builder-steps">
        {STEP_LABELS.map((label, idx) => (
          <button
            key={idx}
            className={`step-btn${step === idx ? ' active' : ''}`}
            onClick={() => setStep(idx)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Panel ── */}
      <div className="panel">

        {/* Step 0: Personal Info */}
        <div className={`form-step${step === 0 ? ' active' : ''}`}>
          <h3 style={{ marginBottom: '1.25rem' }}>Personal Information</h3>

          {/* Photo upload area */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--purple),var(--blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', flexShrink: 0,
              overflow: 'hidden',
            }}>
              {form.profilePhoto ? (
                <img src={form.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                '👩‍💻'
              )}
            </div>
            <div>
              <button 
                className="btn-outline" 
                style={{ fontSize: '.8rem', padding: '.4rem .9rem' }}
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
              </button>
              <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.4rem' }}>PNG, JPG up to 5MB</p>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
            </div>
          </div>

          {/* Username */}
          <div className="form-group">
            <label>Username (Profile URL)</label>
            <input
              value={form.username}
              onChange={setField('username')}
              placeholder="e.g. tisha"
            />
            {usernameStatus === 'available' && (
              <div style={{ color: '#4ade80', fontSize: '.8rem', marginTop: '.3rem' }}>✓ Username is available!</div>
            )}
            {usernameStatus === 'taken' && (
              <div style={{ color: '#FF6B6B', fontSize: '.8rem', marginTop: '.3rem' }}>✗ Username is taken.</div>
            )}
          </div>

          {/* First + Last Name */}
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input value={form.firstName} onChange={setField('firstName')} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input value={form.lastName} onChange={setField('lastName')} />
            </div>
          </div>

          {/* Professional Title */}
          <div className="form-group">
            <label>Professional Title</label>
            <input value={form.headline} onChange={setField('headline')} placeholder="e.g. Full Stack Developer" />
          </div>

          {/* Location + Email */}
          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input value={form.location} onChange={setField('location')} placeholder="e.g. Ahmedabad, Gujarat" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={form.email} onChange={setField('email')} placeholder="e.g. you@example.com" />
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label>Professional Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Passionate developer crafting scalable web experiences..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={goNext} disabled={saving}>
              {saving ? 'Saving...' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Step 1: Skills */}
        <div className={`form-step${step === 1 ? ' active' : ''}`}>
          <h3 style={{ marginBottom: '1.25rem' }}>Skills & Technologies</h3>
          <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '1rem' }}>Select your technical skills:</p>

          <div className="skills-select">
            {DEFAULT_SKILLS.map(skill => (
              <button
                key={skill}
                className={`skill-toggle${selectedSkills.includes(skill) ? ' selected' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
            {/* Show any custom skills not in default list */}
            {selectedSkills.filter(s => !DEFAULT_SKILLS.includes(s)).map(skill => (
              <button
                key={skill}
                className="skill-toggle selected"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label>Custom Skill</label>
            <input
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="e.g. GraphQL"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
            />
          </div>

          <div className="step-nav">
            <button className="btn-outline" onClick={goBack}>← Back</button>
            <button className="btn-primary" onClick={goNext}>Next →</button>
          </div>
        </div>

        {/* Step 2: Experience */}
        <div className={`form-step${step === 2 ? ' active' : ''}`}>
          <h3 style={{ marginBottom: '1.25rem' }}>Experience</h3>

          <div className="form-group">
            <label>Job Title</label>
            <input value={experience.jobTitle} onChange={(e) => setExperience(prev => ({ ...prev, jobTitle: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input value={experience.company} onChange={(e) => setExperience(prev => ({ ...prev, company: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="month" value={experience.startDate} onChange={(e) => setExperience(prev => ({ ...prev, startDate: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="month" value={experience.endDate} onChange={(e) => setExperience(prev => ({ ...prev, endDate: e.target.value }))} placeholder="Present" />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={experience.description}
              onChange={(e) => setExperience(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your role and achievements..."
            />
          </div>

          <div className="step-nav">
            <button className="btn-outline" onClick={goBack}>← Back</button>
            <button className="btn-primary" onClick={goNext}>Next →</button>
          </div>
        </div>

        {/* Step 3: Projects */}
        <div className={`form-step${step === 3 ? ' active' : ''}`}>
          <h3 style={{ marginBottom: '1.25rem' }}>Projects</h3>

          {projects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: idx < projects.length - 1 ? '1.5rem' : '0', paddingBottom: idx < projects.length - 1 ? '1.5rem' : '0', borderBottom: idx < projects.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div className="form-group">
                <label>Project Name</label>
                <input value={proj.name} onChange={(e) => updateProject(idx, 'name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Live URL</label>
                  <input value={proj.liveUrl} onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input value={proj.githubUrl} onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)} placeholder="https://github.com/..." />
                </div>
              </div>
              <div className="form-group">
                <label>Tech Stack</label>
                <input value={proj.techStack} onChange={(e) => updateProject(idx, 'techStack', e.target.value)} placeholder="React, Node.js, MongoDB" />
              </div>
            </div>
          ))}

          <button className="btn-outline" style={{ fontSize: '.85rem', padding: '.5rem 1rem', marginBottom: '1rem' }} onClick={addProject}>
            + Add Another Project
          </button>

          <div className="step-nav">
            <button className="btn-outline" onClick={goBack}>← Back</button>
            <button className="btn-primary" onClick={goNext}>Next →</button>
          </div>
        </div>

        {/* Step 4: Resume Upload */}
        <div className={`form-step${step === 4 ? ' active' : ''}`}>
          <h3 style={{ marginBottom: '1.25rem' }}>Resume Upload</h3>

          <div
            style={{
              border: '2px dashed var(--border)', borderRadius: '1rem',
              padding: '3rem', textAlign: 'center', marginBottom: '1.25rem',
              cursor: 'pointer',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleResumeDrop}
            onClick={() => resumeInputRef.current?.click()}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>📤</div>
            <p style={{ fontWeight: 600, marginBottom: '.5rem' }}>Drop your resume here</p>
            <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '1rem' }}>PDF or DOC format, up to 5MB</p>
            <button className="btn-outline" style={{ fontSize: '.85rem', padding: '.5rem 1rem' }} onClick={(e) => { e.stopPropagation(); resumeInputRef.current?.click(); }}>Browse Files</button>
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleResumeDrop}
            />
          </div>

          {resumeFile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem',
              background: 'var(--card2)', borderRadius: '.75rem',
            }}>
              <span>📄</span>
              <span style={{ fontSize: '.85rem' }}>{resumeFile.name}</span>
              <span style={{ color: '#4ade80', fontSize: '.75rem', marginLeft: 'auto' }}>✓ Uploaded</span>
            </div>
          )}

          <div className="step-nav">
            <button className="btn-outline" onClick={goBack}>← Back</button>
            <button className="btn-primary" onClick={goNext}>Next →</button>
          </div>
        </div>

        {/* Step 5: Social Links */}
        <div className={`form-step${step === 5 ? ' active' : ''}`}>
          <h3 style={{ marginBottom: '1.25rem' }}>Social Links</h3>

          <div className="form-group">
            <label>🐙 GitHub</label>
            <input value={socialLinks.github} onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))} placeholder="https://github.com/..." />
          </div>
          <div className="form-group">
            <label>💼 LinkedIn</label>
            <input value={socialLinks.linkedin} onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="form-group">
            <label>🐦 Twitter / X</label>
            <input value={socialLinks.twitter} onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))} placeholder="https://twitter.com/..." />
          </div>
          <div className="form-group">
            <label>🌐 Portfolio Website</label>
            <input value={socialLinks.portfolio} onChange={(e) => setSocialLinks(prev => ({ ...prev, portfolio: e.target.value }))} placeholder="https://..." />
          </div>

          <div className="step-nav">
            <button className="btn-outline" onClick={goBack}>← Back</button>
            <button className="btn-primary" onClick={goNext}>Next →</button>
          </div>
        </div>

        {/* Step 6: Theme Selection */}
        <div className={`form-step${step === 6 ? ' active' : ''}`}>
          <h3 style={{ marginBottom: '1.25rem' }}>Theme Selection</h3>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
            gap: '.75rem', marginBottom: '1.5rem',
          }}>
            {themes.map(t => (
              <div
                key={t.key}
                style={{
                  border: selectedTheme === t.key ? '2px solid var(--purple)' : '1px solid var(--border)',
                  borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer', position: 'relative',
                }}
                onClick={() => setSelectedTheme(t.key)}
              >
                <div style={{ height: '70px', background: t.gradient }} />
                <div style={{
                  padding: '.5rem', fontSize: '.8rem', textAlign: 'center',
                  color: selectedTheme === t.key ? 'var(--text)' : 'var(--muted)',
                }}>
                  {t.label}{selectedTheme === t.key ? ' ✓' : ''}
                </div>
                {t.pro && (
                  <div style={{
                    position: 'absolute', top: '.3rem', right: '.3rem',
                    background: 'var(--purple)', color: '#fff', fontSize: '.6rem',
                    padding: '.1rem .3rem', borderRadius: '.25rem',
                  }}>PRO</div>
                )}
              </div>
            ))}
          </div>

          <div className="step-nav">
            <button className="btn-outline" onClick={goBack}>← Back</button>
            <button className="btn-primary" onClick={goNext}>Next →</button>
          </div>
        </div>

        {/* Step 7: Publish */}
        <div className={`form-step${step === 7 ? ' active' : ''}`}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '.75rem' }}>Ready to Publish!</h3>
            <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '1.5rem' }}>
              Your DevCard profile is complete. Share your unique URL with the world!
            </p>

            <div style={{
              background: 'var(--card2)', borderRadius: '.75rem', padding: '.75rem 1.25rem',
              fontSize: '.9rem', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '.75rem', justifyContent: 'center',
            }}>
              <span style={{ color: 'var(--purple)' }}>🔗</span>
              <span>{profileUrl}</span>
              <button
                style={{
                  background: 'rgba(108,99,255,0.2)', border: 'none', color: 'var(--purple)',
                  borderRadius: '.5rem', padding: '.25rem .6rem', fontSize: '.75rem', cursor: 'pointer',
                }}
                onClick={copyUrl}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => {
                if (!form.username) {
                  toast.error("Please go to Step 1, enter a username, and click Next to save your profile first!");
                  setStep(0);
                } else {
                  window.open(`/${form.username}`, '_blank');
                }
              }}>
                🚀 View My Profile
              </button>
              <button className="btn-outline" disabled={generatingQr} onClick={async () => {
                if (!form.username) {
                  toast.error("Please go to Step 1, enter a username, and click Next to save your profile first!");
                  setStep(0);
                  return;
                }
                try {
                  setGeneratingQr(true);
                  const res = await api.qr.get(form.username);
                  setQrCodeData(res.qrCode);
                  toast.success('QR Code generated!');
                } catch (e) {
                  toast.error(e.message || "Failed to generate QR code");
                } finally {
                  setGeneratingQr(false);
                }
              }}>
                {generatingQr ? 'Generating...' : '📱 Get QR Code'}
              </button>
            </div>

            {qrCodeData && (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{ marginBottom: '.5rem', fontWeight: 600 }}>Your QR Code</p>
                <img src={qrCodeData} alt="Profile QR Code" style={{ borderRadius: '.5rem', border: '2px solid var(--border)', maxWidth: '200px', display: 'block', margin: '0 auto' }} />
                <div style={{ marginTop: '.75rem' }}>
                  <a href={qrCodeData} download={`${form.username}-qr.png`} style={{ color: 'var(--purple)', fontSize: '.85rem', textDecoration: 'none', fontWeight: 600 }}>↓ Download Image</a>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null, info: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { this.setState({ info }); console.error(error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', background: '#220000', minHeight: '100vh' }}>
          <h2>Profile Builder Crashed!</h2>
          <pre>{this.state.error?.toString()}</pre>
          <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ProfileBuilderPageWrapper() {
  return <ErrorBoundary><ProfileBuilderPage /></ErrorBoundary>;
}
