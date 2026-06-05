import { useState, useMemo, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { AuthContext } from '../context/AuthContext';

const THEMES = [
  { id: 'light', label: 'Clean Light', gradient: 'linear-gradient(135deg, #f8fafc, #e2e8f0)' },
  { id: 'dark', label: 'Dark Pro', gradient: 'linear-gradient(135deg, #0B0F19, #151A2E)' },
  { id: 'neon', label: 'Neon', gradient: 'linear-gradient(135deg, #0f0c29, #302b63)' },
];

function Toggle({ checked, onChange, label }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.6rem 0',
      fontSize: '0.9rem',
      color: 'var(--text)',
    }}>
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          background: checked ? '#6C63FF' : 'rgba(255,255,255,0.1)',
          borderRadius: '2rem',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          transition: '0.2s',
          minWidth: '42px',
        }}
      >
        {checked ? 'On' : 'Off'}
      </button>
    </div>
  );
}

export default function DevCardPremiumSettingsPage() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    displayName: 'DevCard User',
    email: '',
    theme: 'neon',
    publicProfile: true,
  });

  const [toggles, setToggles] = useState({
    emailNotifications: true,
    productUpdates: false,
    securityAlerts: true,
    twoFactorEnabled: false,
    publicPortfolio: true,
  });

  const [savingTheme, setSavingTheme] = useState(false);

  useEffect(() => {
    api.profile.getMe().then((res) => {
      if (res) {
        setProfile((prev) => ({
          ...prev,
          displayName: res.displayName || res.username || prev.displayName,
          theme: res.theme || 'neon',
          email: res.email || user?.email || prev.email,
        }));
      }
    }).catch(console.error);
  }, [user]);

  const saveTheme = async () => {
    setSavingTheme(true);
    try {
      await api.profile.updateTheme({ theme: profile.theme });
      document.body.dataset.theme = profile.theme;
      toast.success('Appearance saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save appearance');
    } finally {
      setSavingTheme(false);
    }
  };

  const themeMeta = useMemo(() => {
    const t = THEMES.find((x) => x.id === profile.theme);
    return t?.label ?? 'Theme';
  }, [profile.theme]);

  const tabs = [
    { key: 'profile', label: '👤 Profile' },
    { key: 'notifications', label: '🔔 Notifications' },
    { key: 'appearance', label: '🎨 Appearance' },
    { key: 'security', label: '🔒 Security' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <div style={{
            display: 'inline-block',
            background: 'rgba(108,99,255,0.15)',
            color: '#6C63FF',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: '2rem',
            padding: '0.3rem 0.9rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}>
            💎 Premium
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: '0.25rem',
          }}>
            Account Settings
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Manage your profile, notifications, appearance, and security.
          </p>
        </div>

        <span style={{
          background: 'rgba(108,99,255,0.15)',
          color: '#6C63FF',
          border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: '2rem',
          padding: '0.35rem 0.9rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#6C63FF',
          }} />
          Theme: <b>{themeMeta}</b>
        </span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={activeTab === tab.key ? 'step-btn active' : 'step-btn'}
            style={{ whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="panel" style={{ padding: '1.5rem' }}>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              marginBottom: '0.5rem',
              color: 'var(--text)',
            }}>
              Profile Settings
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Upload your avatar, manage what's public, and keep your details up to date.
            </p>

            {/* Avatar */}
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                flexShrink: 0,
              }}>
                👤
              </div>
              <div>
                <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
                  Upload avatar
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
                  Recommended: 512×512 PNG/JPG
                </p>
              </div>
            </div>

            <div className="form-group">
              <label>Display Name</label>
              <input
                value={profile.displayName}
                onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input value={profile.email} readOnly />
            </div>

            <div style={{
              height: '1px',
              background: 'rgba(108,99,255,0.2)',
              margin: '1.25rem 0',
            }} />

            <Toggle
              label="Public profile"
              checked={toggles.publicPortfolio}
              onChange={(v) => setToggles((t) => ({ ...t, publicPortfolio: v }))}
            />

            <Toggle
              label="Show in discovery"
              checked={profile.publicProfile}
              onChange={(v) => setProfile((p) => ({ ...p, publicProfile: v }))}
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn-outline" style={{ fontSize: '0.85rem', padding: '0.65rem 1.5rem' }}>
                Cancel
              </button>
              <button className="btn-primary" disabled style={{
                fontSize: '0.85rem',
                padding: '0.65rem 1.5rem',
                opacity: 0.5,
              }}>
                Save changes
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1rem' }}>
              Avatar upload and save actions are wired as placeholders—connect backend endpoints next.
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text)',
                  marginBottom: '0.25rem',
                }}>
                  Notifications
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                  Choose which updates you want to receive.
                </p>
              </div>
              <span style={{
                background: 'rgba(108,99,255,0.15)',
                color: '#6C63FF',
                borderRadius: '2rem',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                Email
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <Toggle
                label="Email notifications"
                checked={toggles.emailNotifications}
                onChange={(v) => setToggles((t) => ({ ...t, emailNotifications: v }))}
              />
              <Toggle
                label="Product updates"
                checked={toggles.productUpdates}
                onChange={(v) => setToggles((t) => ({ ...t, productUpdates: v }))}
              />
              <Toggle
                label="Security alerts"
                checked={toggles.securityAlerts}
                onChange={(v) => setToggles((t) => ({ ...t, securityAlerts: v }))}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn-outline" style={{ fontSize: '0.85rem', padding: '0.65rem 1.5rem' }}>
                Reset
              </button>
              <button className="btn-primary" disabled style={{
                fontSize: '0.85rem',
                padding: '0.65rem 1.5rem',
                opacity: 0.5,
              }}>
                Save notification settings
              </button>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text)',
                  marginBottom: '0.25rem',
                }}>
                  Appearance
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                  Select a calm, premium look across your DevCard experience.
                </p>
              </div>
              <span style={{
                background: 'rgba(108,99,255,0.15)',
                color: '#6C63FF',
                borderRadius: '2rem',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                Premium themes
              </span>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
                Theme selector
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
              }}>
                {THEMES.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setProfile((p) => ({ ...p, theme: t.id }))}
                    style={{
                      border: profile.theme === t.id
                        ? '2px solid #6C63FF'
                        : '1px solid rgba(108,99,255,0.2)',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: '0.2s',
                    }}
                  >
                    <div style={{ height: '70px', background: t.gradient }} />
                    <div style={{
                      padding: '0.5rem',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      color: profile.theme === t.id ? 'var(--text)' : 'var(--muted)',
                    }}>
                      {t.label} {profile.theme === t.id ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div style={{
              background: 'var(--card2)',
              borderRadius: '1rem',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(108,99,255,0.2)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>Live preview</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Theme will apply after you save.</div>
                </div>
                <span style={{
                  background: 'rgba(108,99,255,0.15)',
                  color: '#6C63FF',
                  borderRadius: '2rem',
                  padding: '0.2rem 0.7rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {themeMeta}
                </span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%', background: '#6C63FF',
                  }} />
                  <span style={{
                    height: '6px', flex: 1, borderRadius: '3px',
                    background: 'rgba(108,99,255,0.2)',
                  }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3].map(i => (
                    <span key={i} style={{
                      height: '20px', flex: 1, borderRadius: '0.5rem',
                      background: 'rgba(108,99,255,0.1)',
                      border: '1px solid rgba(108,99,255,0.15)',
                    }} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-outline" style={{ fontSize: '0.85rem', padding: '0.65rem 1.5rem' }}>
                Revert
              </button>
              <button
                className="btn-primary"
                onClick={saveTheme}
                disabled={savingTheme}
                style={{
                  fontSize: '0.85rem',
                  padding: '0.65rem 1.5rem',
                  opacity: savingTheme ? 0.6 : 1,
                }}
              >
                {savingTheme ? 'Saving...' : 'Save appearance'}
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text)',
                  marginBottom: '0.25rem',
                }}>
                  Security
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                  Keep your account protected with strong security controls.
                </p>
              </div>
              <span style={{
                background: 'rgba(255,107,107,0.15)',
                color: '#FF6B6B',
                borderRadius: '2rem',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                Security
              </span>
            </div>

            <Toggle
              label="Two-factor authentication (2FA)"
              checked={toggles.twoFactorEnabled}
              onChange={(v) => setToggles((t) => ({ ...t, twoFactorEnabled: v }))}
            />

            <div style={{
              fontSize: '0.8rem',
              color: 'var(--muted)',
              padding: '0.75rem',
              background: 'rgba(108,99,255,0.08)',
              border: '1px solid rgba(108,99,255,0.15)',
              borderRadius: '0.75rem',
              margin: '1rem 0',
            }}>
              💡 Tip: enable 2FA to reduce account takeovers.
            </div>

            <div style={{
              height: '1px',
              background: 'rgba(108,99,255,0.2)',
              margin: '1.25rem 0',
            }} />

            {/* Delete Account */}
            <div style={{
              background: 'rgba(255,107,107,0.05)',
              border: '1px solid rgba(255,107,107,0.2)',
              borderRadius: '1rem',
              padding: '1.25rem',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#FF6B6B', marginBottom: '0.25rem' }}>
                    Delete account
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    Permanently remove your DevCard account and associated data.
                  </div>
                </div>
                <span style={{
                  background: 'rgba(255,107,107,0.15)',
                  color: '#FF6B6B',
                  borderRadius: '2rem',
                  padding: '0.2rem 0.7rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  Danger zone
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-outline" style={{ fontSize: '0.85rem', padding: '0.65rem 1.5rem' }}>
                  Cancel
                </button>
                <button
                  disabled
                  style={{
                    background: 'rgba(255,107,107,0.15)',
                    border: '1px solid rgba(255,107,107,0.3)',
                    color: '#FF6B6B',
                    padding: '0.65rem 1.5rem',
                    borderRadius: '2rem',
                    fontSize: '0.85rem',
                    cursor: 'not-allowed',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    opacity: 0.5,
                  }}
                >
                  Delete account
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1rem' }}>
                Delete action is disabled until backend integration is connected.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
