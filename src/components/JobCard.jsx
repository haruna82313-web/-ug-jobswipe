import React from 'react';
import { timeAgo, getWaLink } from '../utils/helpers';

const styles = {
  card: { boxSizing: 'border-box', background: 'linear-gradient(145deg, #0f172a, #1e293b)', padding: '24px', borderRadius: '28px', position: 'relative', width: '100%', display: 'flex', flexDirection: 'column' },
  cardTopRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', width: '100%' },
  cardTitle: { fontSize: '1.6rem', fontWeight: '700', margin: '0', textAlign: 'center', color: '#f8fafc', width: '100%' },
  cardPay: { fontSize: '1.2rem', fontWeight: '700', color: '#fbbf24', margin: '5px 0 15px 0', textAlign: 'center', width: '100%' },
  descBox: { background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.03)' },
  descText: { fontSize: '0.95rem', color: '#94a3b8', margin: 0, lineHeight: '1.5' },
  badge: { backgroundColor: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '6px 12px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' },
  buttonRow: { display: 'flex', gap: '10px', width: '100%', marginBottom: '10px' },
  actionBtn: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem', textAlign: 'center' },
  infoText: { marginTop: '10px', fontSize: '0.7rem', color: '#475569', textAlign: 'center', width: '100%' },
  reportBtn: { background: 'none', border: 'none', color: '#f87171', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', opacity: 0.8, padding: '8px' },
};

const JobCard = ({ job, user, updateHeartbeat, toggleStatus, deleteItem, logInterest, isAdmin, approvePayment, view }) => {
  const isPending = job.payment_status === 'pending';

  return (
    <div className="swipe-card glow-job" style={styles.card}>
      {isPending && (
        <div style={{ background: '#f59e0b', color: 'black', padding: '12px', borderRadius: '16px', marginBottom: '15px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '800' }}>
          ⚠️ PENDING PAYMENT (5,000 UGX)
          <p style={{ margin: '5px 0 0 0', fontWeight: '500', fontSize: '0.75rem' }}>Send to 0752333216 then wait for approval.</p>
        </div>
      )}
      <div style={styles.cardTopRow}>
        <span style={styles.badge}>{job.category}</span>
        {!isPending && (
          <span style={{ ...styles.badge, background: job.status === 'taken' ? '#ef4444' : 'rgba(16,185,129,0.1)', color: job.status === 'taken' ? 'white' : '#10b981' }}>
            {job.status === 'taken' ? '⛔ TAKEN' : '✅ ACTIVE'}
          </span>
        )}
      </div>
      <h2 style={styles.cardTitle}>{job.title}</h2>
      <p style={{ ...styles.cardPay, opacity: job.status === 'taken' || isPending ? 0.3 : 1 }}>{job.pay}</p>
      <div style={styles.descBox}><p style={styles.descText}>{job.description}</p></div>
      
      {!isPending && job.status === 'active' && (
        <div style={styles.buttonRow}>
          <a 
            href={`tel:${job.phone}`} 
            onClick={() => logInterest(job, 'call')}
            style={{ ...styles.actionBtn, background: 'linear-gradient(to right, #10b981, #059669)', color: 'white' }}
          >📞 Call</a>
          <a 
            href={getWaLink(job.phone)} 
            onClick={() => logInterest(job, 'whatsapp')}
            style={{ ...styles.actionBtn, background: 'linear-gradient(to right, #22c55e, #16a34a)', color: 'white' }}
          >💬 WhatsApp</a>
        </div>
      )}

      {isAdmin && view === 'admin-panel' && isPending && (
        <button 
          onClick={() => approvePayment(job.id, 'jobs')} 
          style={{ ...styles.actionBtn, background: '#10b981', color: 'white', marginBottom: '10px' }}
        >✅ APPROVE PAYMENT</button>
      )}

      {user?.id === job.user_id && !isPending && (
        <div style={styles.buttonRow}>
          <button onClick={() => updateHeartbeat(job.id, 'jobs')} style={{ ...styles.actionBtn, background: '#334155', color: 'white' }}>💓 Bump</button>
          <button onClick={() => toggleStatus(job.id, 'jobs', job.status)} style={{ ...styles.actionBtn, background: '#1e293b', color: 'white' }}>Status</button>
        </div>
      )}

      <div style={styles.infoText}>Posted: {timeAgo(job.created_at)} • Swipe for more →</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button onClick={() => alert("🚩 Report Logged")} style={styles.reportBtn}>🚩 Report Scam</button>
        {user?.id === job.user_id && <button onClick={() => deleteItem(job.id, 'jobs')} style={{ ...styles.reportBtn, color: '#94a3b8' }}>🗑️ Delete</button>}
      </div>
    </div>
  );
};

export default JobCard;
