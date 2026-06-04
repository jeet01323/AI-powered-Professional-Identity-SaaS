import { useEffect } from 'react';

export default function PlaceholderPage({ title, subtitle }) {
  useEffect(() => {
    document.title = title ? `${title} - DevCard` : 'DevCard';
  }, [title]);

  return (
    <div className="placeholder-page">
      <div className="settings-header">
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>

      <section className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-title">
            <span className="settings-card-icon">✨</span>
            <div>
              <h2>Placeholder</h2>
              <p>This page is wired to the sidebar and renders correctly. Connect real UI + backend endpoints next.</p>
            </div>
          </div>

          <div className="settings-list">
            <div className="settings-list-item">
              <div>
                <strong>Next step</strong>
                <small>Replace this placeholder with actual page components and backend API calls.</small>
              </div>
              <span className="panel-badge">In progress</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

