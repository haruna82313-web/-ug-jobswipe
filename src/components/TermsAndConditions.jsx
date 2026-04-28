import React from 'react';

const styles = {
  container: { boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', backgroundColor: '#020617', minHeight: '100vh', padding: '0 15px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  termsBox: { background: '#0f172a', padding: '30px', borderRadius: '28px', border: '1px solid #1e293b', textAlign: 'left', maxWidth: '400px', width: '100%' },
  termsText: { fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.7', marginBottom: '25px' },
  submitBtn: { padding: '18px', borderRadius: '14px', background: '#10b981', color: 'white', border: 'none', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', width: '100%' },
};

const TermsAndConditions = ({ onAgree }) => {
  return (
    <div style={styles.container}>
      <div style={styles.termsBox}>
        <h2 style={{ color: '#10b981', marginBottom: '15px' }}>Terms & Usage 🇺🇬</h2>
        <div style={styles.termsText}>
          <p>• <b>Expiry:</b> Posts delete after 10 days.</p>
          <p>• <b>Stay Fresh:</b> Use the 💓 <b>Bump</b> button.</p>
          <p>• <b>Safety:</b> Verify all services in person.</p>
        </div>
        <button onClick={onAgree} style={styles.submitBtn}>I Agree & Continue</button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
