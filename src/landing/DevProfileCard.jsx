export default function DevProfileCard({
  name = 'Tisha Mehta',
  role = 'Full Stack Developer · Ahmedabad',
  bio = 'AI-generated: Passionate developer crafting scalable web experiences with modern technologies. Open to opportunities and collaborations.',
  stats = [
    { value: '48', label: 'Repos', color: undefined },
    { value: '1.2k', label: 'Views', color: 'var(--blue, #00D4FF)' },
    { value: '23', label: 'Leads', color: '#FF6B6B' },
  ],
  skills = ['React', 'Node.js', 'MongoDB', 'AI/ML'],
  avatar = '👩‍💻',
  profileUrl = 'devcard.ai/tisha',
}) {
  return (
    <div className="card-preview">
      {/* Live badge header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '.5rem',
        position: 'relative',
        zIndex: 1,
        marginBottom: '3.5rem',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#4ade80',
          animation: 'blink 2s infinite',
        }}></div>
        <span style={{ fontSize: '.7rem', color: '#4ade80' }}>Live Profile</span>
        <span style={{ marginLeft: 'auto', fontSize: '.7rem', color: 'var(--muted, #8892A4)' }}>{profileUrl}</span>
      </div>

      {/* Avatar */}
      <div className="card-avatar">{avatar}</div>

      {/* Info */}
      <div className="card-name">{name}</div>
      <div className="card-role">{role}</div>
      <div className="card-bio">{bio}</div>

      {/* Stats */}
      <div className="card-stats">
        {stats.map((s, i) => (
          <div className="stat-box" key={i}>
            <div className="stat-num" style={s.color ? { color: s.color } : undefined}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="skills-row">
        {skills.map((skill) => (
          <span className="skill-chip" key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  );
}
