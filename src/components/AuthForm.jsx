import React from 'react';

const styles = {
  loginWrapper: { boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', maxWidth: '350px', width: '100%' },
  heroLogo: { fontSize: '3rem', marginBottom: '10px' },
  heroTitle: { fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' },
  form: { boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', background: '#0f172a', padding: '24px', borderRadius: '24px', border: '1px solid #1e293b' },
  input: { boxSizing: 'border-box', width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', fontSize: '1rem' },
  passwordContainer: { position: 'relative', width: '100%' },
  eyeIcon: { position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center' },
  submitBtn: { padding: '18px', borderRadius: '14px', background: '#10b981', color: 'white', border: 'none', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer' },
};

const AuthForm = ({ 
  handleAuth, 
  loading, 
  isLoginMode, 
  setIsLoginMode, 
  showPassword, 
  setShowPassword, 
  shake 
}) => {
  return (
    <div style={styles.loginWrapper}>
      <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }`}</style>
      <div style={styles.heroLogo}>🇺🇬</div>
      <h1 style={styles.heroTitle}>UG JobSwipe</h1>
      <form onSubmit={handleAuth} style={styles.form}>
        <input name="email" type="email" placeholder="Email Address" required style={styles.input} />
        <div style={styles.passwordContainer}>
          <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" required style={styles.input} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>{showPassword ? "👁️" : "🙈"}</button>
        </div>
        <button type="submit" disabled={loading} style={{ ...styles.submitBtn, animation: shake ? 'shake 0.4s ease-in-out' : 'none' }}>
          {loading ? "Please wait..." : (isLoginMode ? "Login" : "Join Now")}
        </button>
      </form>
      <button onClick={() => setIsLoginMode(!isLoginMode)} style={{ background: 'none', border: 'none', color: '#94a3b8', marginTop: '15px', cursor: 'pointer' }}>
        {isLoginMode ? "No account? Join here" : "Have account? Login here"}
      </button>
    </div>
  );
};

export default AuthForm;
