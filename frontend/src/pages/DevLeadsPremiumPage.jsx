import { useMemo, useState, useEffect } from 'react';
import { api } from '../lib/api';

function getInitials(name) {
  if (!name) return 'D';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function LeadRow({ lead, onMarkRead, onDelete }) {
  const dateStr = new Date(lead.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '0.65rem 0.5rem',
        fontSize: '0.85rem',
        borderBottom: '1px solid rgba(108,99,255,0.2)',
        opacity: lead.read ? 0.6 : 1,
        transition: '0.2s',
      }}
    >
      {/* Name with avatar */}
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
        }}>
          {getInitials(lead.name)}
        </div>
        <div>
          <div style={{ fontWeight: 500, color: '#F8FAFC' }}>{lead.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#8892A4' }}>{lead.email}</div>
        </div>
      </span>

      {/* Company / Title */}
      <span style={{ color: '#8892A4' }}>{lead.title}</span>

      {/* Message preview as location placeholder */}
      <span style={{ color: '#8892A4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {lead.messagePreview?.slice(0, 30) || '—'}
      </span>

      {/* Date */}
      <span style={{ color: '#8892A4' }}>{dateStr}</span>

      {/* Actions */}
      <span style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className="btn-outline"
          onClick={() => onMarkRead(lead.id)}
          disabled={lead.read}
          style={{
            padding: '0.3rem 0.7rem',
            fontSize: '0.75rem',
            opacity: lead.read ? 0.4 : 1,
          }}
        >
          {lead.read ? 'Read' : 'Mark Read'}
        </button>
        <button
          onClick={() => onDelete(lead.id)}
          style={{
            padding: '0.3rem 0.7rem',
            fontSize: '0.75rem',
            background: 'rgba(255,107,107,0.1)',
            border: '1px solid rgba(255,107,107,0.3)',
            color: '#FF6B6B',
            borderRadius: '2rem',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Delete
        </button>
      </span>
    </div>
  );
}

export default function DevLeadsPremiumPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.contact.getMessages()
      .then(res => {
        setLeads(res.map(c => ({
          id: c._id,
          name: c.name,
          email: c.email,
          date: c.createdAt,
          title: 'New Message',
          messagePreview: c.message,
          read: false,
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = useMemo(
    () => leads.filter((l) => !l.read).length,
    [leads]
  );

  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Name', 'Email', 'Date', 'Message'];
    const rows = leads.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${new Date(l.date).toISOString()}"`,
      `"${l.messagePreview.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n' 
      + rows.map(e => e.join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'leads_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
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
            🎯 Premium CRM
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#F8FAFC',
            marginBottom: '0.25rem',
          }}>
            Leads Management
          </h1>
          <p style={{ color: '#8892A4', fontSize: '0.9rem' }}>
            View, manage, and export incoming leads.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(108,99,255,0.15)',
            border: '1px solid rgba(108,99,255,0.3)',
            color: '#6C63FF',
            borderRadius: '2rem',
            padding: '0.35rem 0.9rem',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}>
            Unread: <b>{unreadCount}</b>
          </span>
          <button
            className="btn-primary"
            onClick={exportToCSV}
            disabled={leads.length === 0}
            style={{
              fontSize: '0.85rem',
              padding: '0.6rem 1.25rem',
              opacity: leads.length === 0 ? 0.5 : 1,
            }}
          >
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="panel">
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
          gap: '1rem',
          padding: '0.5rem',
          fontSize: '0.78rem',
          color: '#8892A4',
          borderBottom: '1px solid rgba(108,99,255,0.2)',
          fontWeight: 600,
        }}>
          <span>Name</span>
          <span>Subject</span>
          <span>Preview</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {/* Table Body */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#8892A4',
            fontSize: '0.9rem',
          }}>
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
            <div style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: '0.25rem' }}>No leads yet</div>
            <div style={{ color: '#8892A4', fontSize: '0.85rem' }}>Incoming inquiries will appear here.</div>
          </div>
        ) : (
          leads.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              onMarkRead={(id) =>
                setLeads((prev) =>
                  prev.map((l) => (l.id === id ? { ...l, read: true } : l))
                )
              }
              onDelete={(id) => setLeads((prev) => prev.filter((l) => l.id !== id))}
            />
          ))
        )}
      </div>
    </div>
  );
}
