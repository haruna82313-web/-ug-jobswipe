import React from 'react';

const Icons = {
  HelpCircle: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ),
  FileText: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  ),
  Mail: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
  LogOut: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  ChevronLeft: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  Menu: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  X: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  )
};

const styles = {
  header: { boxSizing: 'border-box', width: '100%', maxWidth: '400px', padding: '20px 0 10px 0', position: 'relative' },
  topRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '25px', position: 'relative', width: '100%' },
  logo: { color: '#10b981', fontSize: '1.7rem', fontWeight: '900', letterSpacing: '-0.04em', margin: 0, textShadow: '0 0 20px rgba(16, 185, 129, 0.2)' },
  menuBtn: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8', cursor: 'pointer', padding: '10px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' },
  backBtn: { position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' },
  hamburgerBtn: { position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' },
};

const Header = ({ view, setView, handleRefresh, isAdmin, menuOpen, setMenuOpen, handleLogout }) => {
  return (
    <header style={styles.header}>
      <div style={styles.topRow}>
        {view !== 'home' && (
          <button 
            onClick={() => setView('home')} 
            style={{ ...styles.menuBtn, ...styles.backBtn }}
          >
            <Icons.ChevronLeft size={24} />
          </button>
        )}
        
        <h1 style={styles.logo} onClick={() => setView('home')} className="clickable-logo">UG JobSwipe 🇺🇬</h1>
        
        <button 
          style={{ ...styles.menuBtn, ...styles.hamburgerBtn }} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
        </button>
      </div>

      <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-header-ug">
          <span className="crane-logo">🦅</span>
          <span style={{ fontWeight: '900', color: '#fadc05', letterSpacing: '0.1em', fontSize: '1.2rem' }}>UGANDA PRIDE</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontWeight: '700', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>QUICK NAV</span>
          <button style={styles.menuBtn} onClick={() => setMenuOpen(false)}><Icons.X size={20} /></button>
        </div>
        
        <button className="menu-item" onClick={() => { setView('how-it-works'); setMenuOpen(false); }}>
          <span style={{ display: 'flex' }}><Icons.HelpCircle size={20} /></span>
          <span style={{ marginLeft: '12px' }}>How it Works</span>
        </button>
        
        <button className="menu-item" onClick={() => { setView('terms'); setMenuOpen(false); }}>
          <span style={{ display: 'flex' }}><Icons.FileText size={20} /></span>
          <span style={{ marginLeft: '12px' }}>Terms & Conditions</span>
        </button>
        
        <button className="menu-item" onClick={() => { setView('support'); setMenuOpen(false); }}>
          <span style={{ display: 'flex' }}><Icons.Mail size={20} /></span>
          <span style={{ marginLeft: '12px' }}>Support Help</span>
        </button>
        
        <button className="menu-item logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>
          <span style={{ display: 'flex' }}><Icons.LogOut size={20} /></span>
          <span style={{ marginLeft: '12px' }}>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
