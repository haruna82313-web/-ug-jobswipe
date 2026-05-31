import React from 'react';

const styles = {
  container: { boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', backgroundColor: '#020617', minHeight: '100vh', padding: '10px 15px 40px 15px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  termsBox: { background: 'linear-gradient(145deg, #0f172a, #161e31)', padding: '25px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', maxWidth: '500px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', boxSizing: 'border-box' },
  termsHeader: { color: '#10b981', fontSize: '1.6rem', fontWeight: '900', marginBottom: '20px', letterSpacing: '-0.02em', textAlign: 'center' },
  sectionTitle: { color: '#f8fafc', fontSize: '1.05rem', fontWeight: '700', marginTop: '15px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' },
  termsText: { fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.7', marginBottom: '25px' },
  submitBtn: { padding: '18px', borderRadius: '18px', background: 'linear-gradient(to right, #10b981, #059669)', color: 'white', border: 'none', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', width: '100%', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' },
};

const TermsAndConditions = ({ onAgree, hideButton }) => {
  return (
    <div style={styles.container}>
      <div style={styles.termsBox}>
        <h2 style={styles.termsHeader}>Terms & Conditions 🇺🇬</h2>
        
        <div style={styles.termsText}>
          <div style={styles.sectionTitle}>🤝 1. Acceptance of Terms</div>
          Welcome to UG JobSwipe. By using our platform, you agree to follow these professional guidelines. Our mission is to connect Ugandan talent with opportunities instantly and safely. If you do not agree to these terms, please do not use the service.

          <div style={styles.sectionTitle}>🕒 2. Post Expiry & Maintenance</div>
          To keep the market fresh for everyone, all job posts and skill profiles are valid for <b>10 days</b>. After this period, posts are automatically archived to ensure that employers only see active talent. You can use the 💓 <b>Bump</b> button once every 24 hours to move your post back to the top of the "Find" feed.

          <div style={styles.sectionTitle}>🛡️ 3. Safety & Verification</div>
          UG JobSwipe is a connection platform. While we provide "Report Scam" tools, we do not perform background checks on users. <b>Always verify identities</b> and credentials in person before starting work or making payments. Never send money for "registration fees" or "interviews" to someone you met online.

          <div style={styles.sectionTitle}>💎 4. Payments & Refunds</div>
          The standard listing fee is <b>5,000 UGX</b> per post. This fee is for the visibility service provided and is non-refundable once a post is approved by the admin. Please ensure your post details are correct before submitting. Admin approval usually happens within 1-2 hours of payment confirmation.

          <div style={styles.sectionTitle}>🚫 5. Prohibited Content</div>
          Users are strictly prohibited from posting illegal services, fraudulent schemes, or offensive content. Accounts found violating these rules will be <b>permanently banned</b> without a refund. We maintain a professional environment for all Ugandans to thrive.
        </div>

        {!hideButton && (
          <button 
            onClick={onAgree} 
            style={styles.submitBtn}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            I AGREE & CONTINUE
          </button>
        )}
      </div>
    </div>
  );
};

export default TermsAndConditions;
