import React from 'react';
import QuoteDisplay from './QuoteDisplay';

const styles = {
  header: { boxSizing: 'border-box', width: '100%', maxWidth: '400px', padding: '20px 0 25px 0' },
  logo: { color: '#10b981', textAlign: 'center', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.025em', marginBottom: '15px' },
  refreshBtnWrapper: { width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  refreshBtn: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px 20px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  tabContainer: { display: 'flex', gap: '8px', width: '100%' },
};

const Header = ({ view, setView, handleRefresh, isAdmin }) => {
  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>UG JobSwipe 🇺🇬</h1>
      <div style={styles.refreshBtnWrapper}>
        <button onClick={handleRefresh} style={styles.refreshBtn}>🔄 Refresh to view new posts</button>
      </div>
      <QuoteDisplay />
      <div style={styles.tabContainer}>
        <button onClick={() => setView("find-work")} className={`nav-btn ${view === "find-work" ? "active" : ""}`}>Find Work</button>
        <button onClick={() => setView("find-talent")} className={`nav-btn ${view === "find-talent" ? "active" : ""}`}>Find Talent</button>
      </div>
      <div style={{ ...styles.tabContainer, marginTop: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setView("post-job")} className={`nav-btn ${view === "post-job" ? "active" : ""}`}>Post Job</button>
          <button onClick={() => setView("post-skill")} className={`nav-btn ${view === "post-skill" ? "active" : ""}`}>Post My Skill</button>
          <button onClick={() => setView("my-posts")} className={`nav-btn ${view === "my-posts" ? "active" : ""}`}>My Posts</button>
          <button onClick={() => setView("how-it-works")} className={`nav-btn ${view === "how-it-works" ? "active" : ""}`} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>❓ How it Works</button>
          {isAdmin && (
            <button onClick={() => setView("admin-panel")} className={`nav-btn ${view === "admin-panel" ? "active" : ""}`} style={{ background: '#7c3aed', color: 'white' }}>🛡️ ADMIN</button>
          )}
        </div>
    </header>
  );
};

export default Header;
