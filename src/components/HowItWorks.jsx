import React from 'react';

const styles = {
  container: {
    background: '#0f172a',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid #1e293b',
    color: 'white',
    lineHeight: '1.6',
  },
  title: {
    color: '#10b981',
    fontSize: '1.5rem',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '800'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    color: '#f59e0b',
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  text: {
    color: '#94a3b8',
    fontSize: '0.95rem'
  },
  list: {
    paddingLeft: '20px',
    marginTop: '10px'
  },
  listItem: {
    marginBottom: '8px',
    color: '#cbd5e1'
  },
  ugButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '900',
    fontSize: '1.1rem',
    color: 'white',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
    marginTop: '15px',
    border: 'none',
    background: 'linear-gradient(to right, #000000 33%, #FCDC00 33%, #FCDC00 66%, #D90000 66%)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    letterSpacing: '1px'
  }
};

const HowItWorks = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome to UG JobSwipe! 🚀</h2>
      
      <div style={styles.section}>
        <div style={styles.sectionTitle}>🎯 What is this App?</div>
        <p style={styles.text}>
          UG JobSwipe is a simple platform designed to connect workers and employers in Uganda instantly. 
          Whether you need a plumber in Kampala or you're a web developer looking for work in Mbarara, 
          we make it as easy as a swipe.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>🛠️ How to use it?</div>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <strong>Find Work/Talent:</strong> Browse through open job posts or worker profiles. Filter by your region and use the search bar to find specific roles or skills.
          </li>
          <li style={styles.listItem}>
            <strong>Post your Job/Skill:</strong> Fill out the form in "Post Job" or "Post My Skill". Your post will be saved immediately but will stay <strong>Pending</strong> until payment is confirmed.
          </li>
          <li style={styles.listItem}>
            <strong>Connect Directly:</strong> No middleman! Use the 📞 Call or 💬 WhatsApp buttons to talk directly to the person on the other side.
          </li>
        </ul>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>💰 Payment & Verification</div>
        <p style={styles.text}>
          To maintain a high-quality platform and prevent spam, we charge a small fee of <strong>5,000 UGX per post</strong>.
          <br/><br/>
          <strong>The Process:</strong>
          <br/>1. Create your post.
          <br/>2. Go to <strong>"My Posts"</strong> to see your pending post.
          <br/>3. Send 5,000 UGX to <strong>0752333216 (Airtel Money - Luzira Hellen)</strong>.
          <br/>4. Once the payment is received, your post will be <strong>Approved</strong> and go live for everyone to see!
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>📂 Managing your Posts</div>
        <p style={styles.text}>
          In the <strong>"My Posts"</strong> tab, you have full control:
          <br/>• <strong>Status:</strong> Mark your post as <strong>"Taken"</strong> or <strong>"Busy"</strong> once you've found what you need. This stops people from calling you while keeping your profile visible.
          <br/>• <strong>Bump:</strong> Posts automatically expire after 10 days. Click <strong>"Bump"</strong> to reset the timer for another 10 days and move your post back to the top of the list!
          <br/>• <strong>Delete:</strong> Remove your post permanently if you no longer need it.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>📱 Smart Features</div>
        <p style={styles.text}>
          • <strong>Real-time Search:</strong> Find exactly what you need as you type.<br/>
          • <strong>Location Detection:</strong> Use the "Detect My Location" button in filters to find opportunities near you.<br/>
          • <strong>Interest Alerts:</strong> Get notified when someone clicks your Call or WhatsApp buttons!
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>📞 Help & Inquiries</div>
        <p style={styles.text}>
          Need assistance or have a question? Contact the app owner directly:
        </p>
        <a href="tel:0752333216" style={styles.ugButton}>
          📞 CONTACT APP OWNER
        </a>
      </div>

      <p style={{ ...styles.text, textAlign: 'center', marginTop: '30px', fontStyle: 'italic' }}>
        Start swiping and find your next opportunity today! 🇺🇬
      </p>
    </div>
  );
};

export default HowItWorks;
