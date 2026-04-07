import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// --- STYLES ---
const styles = {
  container: { boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', backgroundColor: '#020617', minHeight: '100vh', padding: '0 15px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  loginWrapper: { boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', maxWidth: '350px', width: '100%' },
  heroLogo: { fontSize: '3rem', marginBottom: '10px' },
  heroTitle: { fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' },
  header: { boxSizing: 'border-box', width: '100%', maxWidth: '400px', padding: '20px 0' },
  logo: { color: '#10b981', textAlign: 'center', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.025em', marginBottom: '5px' },
  
  // New Pulsing Tip Style
  refreshTip: { fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginBottom: '15px', fontWeight: '600', width: '100%' },

  tabContainer: { display: 'flex', gap: '8px', width: '100%' },
  mainContent: { boxSizing: 'border-box', width: '100%', maxWidth: '400px' },
  dropdown: { boxSizing: 'border-box', width: '100%', padding: '14px', background: '#0f172a', color: 'white', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '10px', fontSize: '0.9rem' },
  searchBar: { boxSizing: 'border-box', width: '100%', padding: '14px', background: '#0f172a', color: 'white', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '15px', outline: 'none', fontSize: '0.9rem' },
  
  card: { 
    boxSizing: 'border-box', 
    background: 'linear-gradient(145deg, #0f172a, #1e293b)', 
    padding: '24px', 
    borderRadius: '28px', 
    position: 'relative', 
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
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
  
  form: { boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', background: '#0f172a', padding: '24px', borderRadius: '24px', border: '1px solid #1e293b' },
  input: { boxSizing: 'border-box', width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', fontSize: '1rem' },
  
  passwordContainer: { position: 'relative', width: '100%' },
  eyeIcon: { position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center' },
  
  submitBtn: { padding: '18px', borderRadius: '14px', background: '#10b981', color: 'white', border: 'none', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer' },
  toast: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', padding: '16px 32px', borderRadius: '16px', color: 'white', fontWeight: '700', zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', width: 'max-content' },
  termsBox: { background: '#0f172a', padding: '30px', borderRadius: '28px', border: '1px solid #1e293b', textAlign: 'left', maxWidth: '400px', width: '100%' },
  termsText: { fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.7', marginBottom: '25px' }
};

export default function App() {
  const [authStep, setAuthStep] = useState("loading"); 
  const [user, setUser] = useState(null);
  const [hasAgreed, setHasAgreed] = useState(localStorage.getItem('ug_terms_agreed') === 'true');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [view, setView] = useState("find-work");
  const [regionFilter, setRegionFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", color: "" });
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const timeAgo = (date) => {
    if (!date) return 'Recently';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthStep(session ? "app" : "welcome");
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setAuthStep(session ? "app" : "welcome");
      });
      return () => subscription.unsubscribe();
    };
    initAuth();

    const fetchData = async () => {
      const { data: j } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (j) setJobs(j);
      const { data: w } = await supabase.from('workers').select('*').order('created_at', { ascending: false });
      if (w) setWorkers(w);
    };
    fetchData();
  }, []);

  const handleAgree = () => { localStorage.setItem('ug_terms_agreed', 'true'); setHasAgreed(true); };
  const showToast = (message, color) => { setToast({ visible: true, message, color }); setTimeout(() => setToast({ visible: false, message: "", color: "" }), 3000); };

  const updateHeartbeat = async (id, table) => {
    const { error } = await supabase.from(table).update({ created_at: new Date().toISOString(), status: 'active' }).eq('id', id);
    if (!error) showToast("✅ Post Bumped!", "#10b981");
  };

  const toggleStatus = async (id, table, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'taken' : 'active';
    const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
    if (!error) showToast(`✅ Status: ${newStatus.toUpperCase()}`, "#334155");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true); 
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
        if (isLoginMode) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) { setShake(true); setTimeout(() => setShake(false), 500); throw error; }
        } else {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          showToast("Check email to confirm!", "#10b981");
        }
    } catch (err) { showToast(err.message, "#ef4444"); } finally { setLoading(false); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const addJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    const phone = e.target.phone.value;
    if(!/^\d{10}$/.test(phone)) { setLoading(false); return showToast("❌ Phone must be 10 digits", "#ef4444"); }
    const newJob = { title: e.target.title.value, pay: e.target.pay.value, region: e.target.region.value, category: e.target.category.value, phone: phone, description: e.target.description.value, user_id: user?.id, status: 'active' };
    try {
        const { error } = await supabase.from('jobs').insert([newJob]);
        if (error) throw error;
        e.target.reset(); showToast("✅ Job Posted!", "#10b981"); setView("find-work");
    } catch (err) { showToast("⚠️ Error: " + err.message, "#ef4444"); } finally { setLoading(false); }
  };

  const addWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    const phone = e.target.phone.value;
    if(!/^\d{10}$/.test(phone)) { setLoading(false); return showToast("❌ Phone must be 10 digits", "#ef4444"); }
    const newWorker = { name: e.target.name.value, skill: e.target.skill.value, region: e.target.region.value, experience: e.target.exp.value, phone: phone, bio: e.target.bio.value, user_id: user?.id, status: 'active' };
    try {
        const { error } = await supabase.from('workers').insert([newWorker]);
        if (error) throw error;
        e.target.reset(); showToast("✅ Skill Listed!", "#f59e0b"); setView("find-talent");
    } catch (err) { showToast("⚠️ Error: " + err.message, "#ef4444"); } finally { setLoading(false); }
  };

  const deleteItem = async (id, table) => {
    if(!window.confirm("🗑️ Delete this post permanently?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) { showToast("Post Removed", "#ef4444"); }
  };

  const getWaLink = (num) => {
    const cleanNum = num.replace(/^0/, '256').replace(/^\+/, '');
    return `whatsapp://send?phone=${cleanNum}`;
  };

  const filteredJobs = jobs.filter(j => (regionFilter === "All" || j.region === regionFilter) && (j.title?.toLowerCase().includes(searchTerm.toLowerCase())));
  const filteredWorkers = workers.filter(w => (regionFilter === "All" || w.region === regionFilter) && (w.name?.toLowerCase().includes(searchTerm.toLowerCase())));

  if (authStep === "loading") return <div style={styles.container}>Loading...</div>;

  if (!hasAgreed) return (
    <div style={{...styles.container, justifyContent: 'center'}}>
      <div style={styles.termsBox}>
        <h2 style={{color: '#10b981', marginBottom: '15px'}}>Terms & Usage 🇺🇬</h2>
        <div style={styles.termsText}>
          <p>• <b>Expiry:</b> Posts delete after 10 days.</p>
          <p>• <b>Stay Fresh:</b> Use the 💓 <b>Bump</b> button.</p>
          <p>• <b>Safety:</b> Verify all services in person.</p>
        </div>
        <button onClick={handleAgree} style={styles.submitBtn}>I Agree & Continue</button>
      </div>
    </div>
  );

  if (authStep === "welcome") return (
    <div style={styles.container}>
      <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }`}</style>
      <div style={styles.loginWrapper}>
        <div style={styles.heroLogo}>🇺🇬</div>
        <h1 style={styles.heroTitle}>UG JobSwipe</h1>
        <form onSubmit={handleAuth} style={styles.form}>
          <input name="email" type="email" placeholder="Email Address" required style={styles.input} />
          <div style={styles.passwordContainer}>
            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" required style={styles.input} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>{showPassword ? "👁️" : "🙈"}</button>
          </div>
          <button type="submit" disabled={loading} style={{...styles.submitBtn, animation: shake ? 'shake 0.4s ease-in-out' : 'none'}}>
            {loading ? "Please wait..." : (isLoginMode ? "Login" : "Join Now")}
          </button>
        </form>
        <button onClick={() => setIsLoginMode(!isLoginMode)} style={{background: 'none', border: 'none', color: '#94a3b8', marginTop: '15px'}}>
          {isLoginMode ? "No account? Join here" : "Have account? Login here"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; color: #10b981; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .pulse-tip { animation: heartbeat 2s infinite ease-in-out; }
        .nav-btn { box-sizing: border-box; font-size: 0.8rem; padding: 10px; border-radius: 10px; border: 1px solid #1e293b; background: #0f172a; color: #94a3b8; cursor: pointer; flex: 1; } 
        .nav-btn.active { background: #10b981; color: white; border: none; font-weight: bold; }
        .swipe-container { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; gap: 20px; width: 100%; scrollbar-width: none; padding: 10px 0; }
        .swipe-container::-webkit-scrollbar { display: none; }
        .swipe-card { flex: 0 0 100%; scroll-snap-align: center; box-sizing: border-box; }
        .glow-job { border: 1px solid rgba(16, 185, 129, 0.4) !important; box-shadow: 0 0 15px rgba(16, 185, 129, 0.15), 0 20px 40px rgba(0,0,0,0.6) !important; }
        .glow-talent { border: 1px solid rgba(245, 158, 11, 0.4) !important; box-shadow: 0 0 15px rgba(245, 158, 11, 0.15), 0 20px 40px rgba(0,0,0,0.6) !important; }
      `}</style>
      
      {toast.visible && <div style={{...styles.toast, backgroundColor: toast.color}}>{toast.message}</div>}
      
      <header style={styles.header}>
        <h1 style={styles.logo}>UG JobSwipe 🇺🇬</h1>
        <div style={styles.refreshTip} className="pulse-tip">
          TIP: Refresh The Page Per Every Post You Make To See Your Post
        </div>
        <div style={styles.tabContainer}>
          <button onClick={() => setView("find-work")} className={`nav-btn ${view === "find-work" ? "active" : ""}`}>Find Work</button>
          <button onClick={() => setView("find-talent")} className={`nav-btn ${view === "find-talent" ? "active" : ""}`}>Find Talent</button>
        </div>
        <div style={{...styles.tabContainer, marginTop: '10px'}}>
          <button onClick={() => setView("post-job")} className={`nav-btn ${view === "post-job" ? "active" : ""}`}>Post Job</button>
          <button onClick={() => setView("post-skill")} className={`nav-btn ${view === "post-skill" ? "active" : ""}`}>Post My Skill</button>
        </div>
      </header>

      <main style={styles.mainContent}>
        {view === "find-work" && (
          <div>
            <select style={styles.dropdown} value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <option value="All">All Regions</option><option>Central</option><option>Northern</option><option>Western</option><option>Eastern</option>
            </select>
            <input style={styles.searchBar} placeholder="Search jobs..." onChange={(e) => setSearchTerm(e.target.value)} />
            {filteredJobs.length > 0 ? (
              <div className="swipe-container">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="swipe-card glow-job" style={styles.card}>
                    <div style={styles.cardTopRow}>
                        <span style={styles.badge}>{job.category}</span>
                        <span style={{...styles.badge, background: job.status === 'taken' ? '#ef4444' : 'rgba(16,185,129,0.1)', color: job.status === 'taken' ? 'white' : '#10b981'}}>
                          {job.status === 'taken' ? '⛔ TAKEN' : '✅ ACTIVE'}
                        </span>
                    </div>
                    <h2 style={styles.cardTitle}>{job.title}</h2>
                    <p style={{...styles.cardPay, opacity: job.status === 'taken' ? 0.3 : 1}}>{job.pay}</p>
                    <div style={styles.descBox}><p style={styles.descText}>{job.description}</p></div>
                    {job.status === 'active' ? (
                      <div style={styles.buttonRow}>
                        <a href={`tel:${job.phone}`} style={{...styles.actionBtn, background: 'linear-gradient(to right, #10b981, #059669)', color: 'white'}}>📞 Call</a>
                        <a href={getWaLink(job.phone)} style={{...styles.actionBtn, background: 'linear-gradient(to right, #22c55e, #16a34a)', color: 'white'}}>💬 WhatsApp</a>
                      </div>
                    ) : <div style={{padding: '15px', color: '#94a3b8', textAlign: 'center'}}>This job has been filled.</div>}
                    {user?.id === job.user_id && (
                      <div style={styles.buttonRow}>
                        <button onClick={() => updateHeartbeat(job.id, 'jobs')} style={{...styles.actionBtn, background: '#334155', color: 'white'}}>💓 Bump</button>
                        <button onClick={() => toggleStatus(job.id, 'jobs', job.status)} style={{...styles.actionBtn, background: '#1e293b', color: 'white'}}>Status</button>
                      </div>
                    )}
                    <div style={styles.infoText}>Posted: {timeAgo(job.created_at)} • Swipe for more →</div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
                      <button onClick={() => alert("🚩 Report Logged")} style={styles.reportBtn}>🚩 Report Scam</button>
                      {user?.id === job.user_id && <button onClick={() => deleteItem(job.id, 'jobs')} style={{...styles.reportBtn, color: '#94a3b8'}}>🗑️ Delete</button>}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={{textAlign: 'center', color: '#94a3b8'}}>No jobs found.</p>}
          </div>
        )}

        {view === "find-talent" && (
          <div>
            <select style={styles.dropdown} value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <option value="All">All Regions</option><option>Central</option><option>Northern</option><option>Western</option><option>Eastern</option>
            </select>
            <input style={styles.searchBar} placeholder="Search talent..." onChange={(e) => setSearchTerm(e.target.value)} />
            {filteredWorkers.length > 0 ? (
              <div className="swipe-container">
                {filteredWorkers.map((worker) => (
                  <div key={worker.id} className="swipe-card glow-talent" style={styles.card}>
                    <div style={styles.cardTopRow}>
                        <span style={{...styles.badge, color: '#f59e0b'}}>{worker.skill}</span>
                        <span style={{...styles.badge, background: worker.status === 'taken' ? '#475569' : 'rgba(245,158,11,0.1)', color: '#f59e0b'}}>
                          {worker.status === 'taken' ? '⛔ BUSY' : '✅ AVAILABLE'}
                        </span>
                    </div>
                    <h2 style={styles.cardTitle}>{worker.name}</h2>
                    <p style={styles.cardPay}>Exp: {worker.experience}</p>
                    <div style={styles.descBox}><p style={styles.descText}>{worker.bio}</p></div>
                    {worker.status === 'active' ? (
                      <div style={styles.buttonRow}>
                        <a href={`tel:${worker.phone}`} style={{...styles.actionBtn, background: '#f59e0b', color: 'white'}}>📞 Hire</a>
                        <a href={getWaLink(worker.phone)} style={{...styles.actionBtn, background: 'linear-gradient(to right, #22c55e, #16a34a)', color: 'white'}}>💬 WhatsApp</a>
                      </div>
                    ) : <div style={{padding: '15px', color: '#94a3b8', textAlign: 'center'}}>This worker is currently busy.</div>}
                    {user?.id === worker.user_id && (
                      <div style={styles.buttonRow}>
                        <button onClick={() => updateHeartbeat(worker.id, 'workers')} style={{...styles.actionBtn, background: '#334155', color: 'white'}}>💓 Bump</button>
                        <button onClick={() => toggleStatus(worker.id, 'workers', worker.status)} style={{...styles.actionBtn, background: '#1e293b', color: 'white'}}>Status</button>
                      </div>
                    )}
                    <div style={styles.infoText}>Posted: {timeAgo(worker.created_at)} • Swipe for more →</div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
                      <button onClick={() => alert("🚩 Report Logged")} style={styles.reportBtn}>🚩 Report User</button>
                      {user?.id === worker.user_id && <button onClick={() => deleteItem(worker.id, 'workers')} style={{...styles.reportBtn, color: '#94a3b8'}}>🗑️ Delete</button>}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={{textAlign: 'center', color: '#94a3b8'}}>No talent found.</p>}
          </div>
        )}

        {view === "post-job" && (
          <form onSubmit={addJob} style={styles.form}>
            <h3 style={{color: '#10b981', margin: '0 0 10px 0'}}>Hire Someone</h3>
            <input name="title" placeholder="Job Title" required style={styles.input} />
            <input name="pay" placeholder="Pay (e.g. 200,000/=)" required style={styles.input} />
            <select name="category" style={styles.input} required>
              <option value="">Category</option><option>Retail</option><option>Agriculture</option><option>Transport</option><option>Construction</option><option>Repair</option><option>Delivery</option><option>House Keeping</option><option>Food & Beverages</option><option>Health</option><option>Media</option><option>Beauty</option><option>Unique</option><option>Research & Education</option><option>Logistics</option>
            </select>
            <select name="region" style={styles.input} required>
              <option value="">Region</option><option>Central</option><option>Northern</option><option>Western</option><option>Eastern</option>
            </select>
            <textarea name="description" placeholder="Requirements..." required style={{...styles.input, minHeight: '80px'}} />
            <input name="phone" type="tel" placeholder="Phone Number" pattern="\d{10}" required style={styles.input} />
            <button type="submit" disabled={loading} style={{...styles.submitBtn, opacity: loading ? 0.6 : 1}}>{loading ? "Posting..." : "Post Job Now"}</button>
          </form>
        )}

        {view === "post-skill" && (
          <form onSubmit={addWorker} style={styles.form}>
            <h3 style={{color: '#f59e0b', margin: '0 0 10px 0'}}>Market Your Skills</h3>
            <input name="name" placeholder="Full Name" required style={styles.input} />
            <input name="skill" placeholder="Profession" required style={styles.input} />
            <input name="exp" placeholder="Experience" required style={styles.input} />
            <select name="region" style={styles.input} required>
              <option value="">Region</option><option>Central</option><option>Northern</option><option>Western</option><option>Eastern</option>
            </select>
            <textarea name="bio" placeholder="Why hire you?" required style={{...styles.input, minHeight: '80px'}} />
            <input name="phone" type="tel" placeholder="Phone Number" pattern="\d{10}" required style={styles.input} />
            <button type="submit" disabled={loading} style={{...styles.submitBtn, background: '#f59e0b', opacity: loading ? 0.6 : 1}}>{loading ? "Listing..." : "List My Profile"}</button>
          </form>
        )}

        <button onClick={handleLogout} style={{marginTop: '40px', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', width: '100%', marginBottom: '30px'}}>Sign Out Account</button>
      </main>
    </div>
  );
}
