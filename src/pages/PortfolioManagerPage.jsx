import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';

function TagEditor({ tags, setTags }) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const normalized = draft.trim();
    if (!normalized) return;
    const parts = normalized
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    setTags((prev) => {
      const merged = [...prev];
      for (const t of parts) {
        if (!merged.some((x) => x.toLowerCase() === t.toLowerCase())) merged.push(t);
      }
      return merged;
    });
    setDraft('');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <input
          className="form-group"
          value={draft}
          placeholder="Enter tags, press Enter"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          style={{
            flex: 1,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '.75rem',
            padding: '.7rem 1rem',
            color: 'var(--text)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '.9rem',
            outline: 'none',
          }}
        />
        <button
          className="btn-outline"
          type="button"
          onClick={addTag}
          style={{ padding: '.5rem 1rem', fontSize: '.85rem' }}
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginTop: '.75rem' }}>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className="project-tag"
              onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
              title="Click to remove"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.3rem' }}
            >
              {t} <span style={{ opacity: .6 }}>×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PortfolioManagerPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.profile.getMe()
      .then(res => {
        if (res?.projects) {
          setProjects(res.projects.map(p => ({ ...p, id: p._id || p.id || String(Date.now() + Math.random()) })));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [draft, setDraft] = useState({
    id: null,
    title: '',
    techStack: [],
    githubLink: '',
    liveLink: '',
    description: '',
  });

  const [showForm, setShowForm] = useState(false);

  const resetDraft = () =>
    setDraft({
      id: null,
      title: '',
      techStack: [],
      githubLink: '',
      liveLink: '',
      description: '',
    });

  const canSave =
    draft.title.trim() &&
    draft.githubLink.trim() &&
    draft.liveLink.trim() &&
    draft.description.trim();

  const save = async () => {
    if (!canSave) return;

    let updatedProjects = [];
    if (draft.id) {
      updatedProjects = projects.map((p) => (p.id === draft.id ? { ...draft, id: draft.id } : p));
    } else {
      const id = String(Date.now());
      updatedProjects = [{ ...draft, id }, ...projects];
    }

    setProjects(updatedProjects);
    resetDraft();
    setShowForm(false);

    try {
      await api.profile.update({ projects: updatedProjects });
    } catch (err) {
      toast.error('Failed to save project: ' + err.message);
    }
  };

  const editProject = (p) => {
    setDraft({
      id: p.id,
      title: p.title || p.name || '',
      techStack: p.techStack || p.tags || [],
      githubLink: p.githubLink || p.githubUrl || '',
      liveLink: p.liveLink || p.liveUrl || '',
      description: p.description || '',
    });
    setShowForm(true);
  };

  const removeProject = async (idToRemove) => {
    const updatedProjects = projects.filter((x) => x.id !== idToRemove);
    setProjects(updatedProjects);
    try {
      await api.profile.update({ projects: updatedProjects });
    } catch (err) {
      toast.error('Failed to remove project: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '.5rem' }}>Portfolio</h2>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Manage your projects. Each entry updates your professional identity.</p>
        </div>
        <button
          className="btn-primary"
          type="button"
          onClick={() => {
            resetDraft();
            setShowForm(true);
          }}
          style={{ fontSize: '.85rem', padding: '.65rem 1.5rem' }}
        >
          + Add Project
        </button>
      </div>

      {/* Form Panel */}
      <div className="panel" style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          🗂️ Project Details
          <span className="project-tag" style={{ marginLeft: 'auto' }}>Premium</span>
        </h4>

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Project Name</label>
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    placeholder="My Awesome Project"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Tech Stack Tags</label>
                  <TagEditor
                    tags={draft.techStack}
                    setTags={(fn) => setDraft((d) => ({ ...d, techStack: typeof fn === 'function' ? fn(d.techStack) : fn }))}
                  />
                </div>

                <div className="form-group">
                  <label>GitHub URL</label>
                  <input
                    value={draft.githubLink}
                    onChange={(e) => setDraft((d) => ({ ...d, githubLink: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="form-group">
                  <label>Live URL</label>
                  <input
                    value={draft.liveLink}
                    onChange={(e) => setDraft((d) => ({ ...d, liveLink: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description</label>
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Describe what this project does..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    resetDraft();
                    setShowForm(false);
                  }}
                  style={{ fontSize: '.85rem', padding: '.6rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={!canSave}
                  onClick={save}
                  style={{ fontSize: '.85rem', padding: '.6rem 1.25rem', opacity: canSave ? 1 : .5 }}
                >
                  Save Project
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '.5rem' }}>Ready to build?</div>
                <div style={{ color: 'var(--muted)', fontSize: '.85rem' }}>
                  Click <b>+ Add Project</b> to create a recruiter-friendly portfolio entry.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="panel" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Loading projects...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>🗂️</div>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>No projects yet. Add your first project above!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.map((p) => (
            <div
              key={p.id}
              className="panel"
              style={{ background: 'var(--card2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.75rem', marginBottom: '.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.35rem' }}>{p.title || p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.8rem' }}>
                    {(p.githubLink || p.githubUrl) && (
                      <a
                        href={p.githubLink || p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--purple)', textDecoration: 'none' }}
                      >
                        🐙 GitHub
                      </a>
                    )}
                    {(p.githubLink || p.githubUrl) && (p.liveLink || p.liveUrl) && (
                      <span style={{ color: 'var(--muted)' }}>•</span>
                    )}
                    {(p.liveLink || p.liveUrl) && (
                      <a
                        href={p.liveLink || p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--blue)', textDecoration: 'none' }}
                      >
                        🔗 Live
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => editProject(p)}
                    style={{ fontSize: '.78rem', padding: '.35rem .75rem' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => removeProject(p.id)}
                    style={{ fontSize: '.78rem', padding: '.35rem .75rem', borderColor: 'rgba(255,107,107,0.3)', color: '#FF6B6B' }}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>

              {(p.techStack || p.tags)?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '.75rem' }}>
                  {(p.techStack || p.tags).map((t) => (
                    <span key={t} className="project-tag">{t}</span>
                  ))}
                </div>
              )}

              {p.description && (
                <div style={{ color: 'var(--muted)', fontSize: '.85rem', lineHeight: 1.6 }}>{p.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
