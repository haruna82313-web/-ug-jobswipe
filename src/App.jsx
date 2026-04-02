import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// --- STYLES (Untempered + Shake Animation) ---
const styles = {
  container: { boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', backgroundColor: '#020617', minHeight: '100vh', padding: '0 15px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  loginWrapper: { boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', maxWidth: '350px', width: '100%' },
  heroLogo: { fontSize: '3rem', marginBottom: '10px' },
  heroTitle: { fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' },
  heroSub: { fontSize: '1rem', color: '#94a3b8', marginBottom: '30px', lineHeight: '1.5' },
  header: { boxSizing: 'border-box', width: '100%', maxWidth: '400px', padding: '20px 0' },
  logo: { color: '#10b981', textAlign: 'center', fontSize: '1.6rem', marginBottom: '15px' },
  tabContainer: { display: 'flex', gap: '8px', width: '100%' },
  mainContent: { boxSizing: 'border-box', width: '100%', maxWidth: '400px' },
  dropdown: { boxSizing: 'border-box', width: '100%', padding: '12px', background: '#0f172a', color: 'white', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '10px' },
  searchBar: { boxSizing: 'border-box', width: '100%', padding: '12px', background: '#0f172a', color: 'white', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '15px', outline: 'none' },
  card: { boxSizing: 'border-box', background: '#0f172a', padding: '25px', borderRadius: '24px', border: '1px solid #1e293b', textAlign: 'center', position: 'relative', width: '100%' },
  cardTitle: { fontSize: '1.4rem', margin: '10px 0' },
  cardPay: { fontSize: '1.6rem', color: '#f59e0b', margin: '10px 0' },
  descBox: { background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', textAlign: 'left', marginBottom: '15px' },
  descText: { fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: '1.4' },
  badge: { backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' },
  callBtn: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', background: '#10b981', color: 'white', padding: '15px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box' },
  whatsappBtn: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', background: '#25D366', color: 'white', padding: '15px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box' },
  reportBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.7, padding: '5px' },
  nextBtn: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b', background: 'transparent', color: 'white', marginTop: '10px', cursor: 'pointer' },
  form: { boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', background: '#0f172a', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b' },
  input: { boxSizing: 'border-box', width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white' },
  submitBtn: { padding: '16px', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#64748b', marginTop: '30px' },
  toast: { position: 'fixed', bottom: '20px', right: '20px', padding: '15px 25px', borderRadius: '12px', color: 'white', fontWeight: 'bold', zIndex: 9999 },
  termsBox: { background: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b', textAlign: 'left', maxWidth: '400px', width: '100%' },
  termsText: { fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }
};

export default function App() {
  const [authStep, setAuthStep] = useState("loading"); 
  const [user, setUser] = useState(null);
  const [hasAgreed, setHasAgreed] = useState(localStorage.getItem('ug_terms_agreed') === 'true');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [view, setView] = useState("find-work");
  const [index, setIndex] = useState(0);
  const [regionFilter, setRegionFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", color: "" });
  const [shake, setShake] = useState(false);

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

    const jobChannel = supabase.channel('jobs-realtime').on('postgres_changes', { event: '*', table: 'jobs' }, fetchData).subscribe();
    const workerChannel = supabase.channel('workers-realtime').on('postgres_changes', { event: '*', table: 'workers' }, fetchData).subscribe();
    return () => { supabase.removeChannel(jobChannel); supabase.removeChannel(workerChannel); };
  }, []);

  const handleAgree = () => {
    localStorage.setItem('ug_terms_agreed', 'true');
    setHasAgreed(true);
  };

  const showToast = (message, color) => {
    setToast({ visible: true, message, color });
    setTimeout(() => setToast({ visible: false, message: "", color: "" }), 3000);
  };

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
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { 
        setShake(true); 
        setTimeout(() => setShake(false), 500); 
        return showToast("❌ Login Failed", "#ef4444"); 
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return showToast(error.message, "#ef4444");
      showToast("Check email to confirm!", "#10b981");
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const addJob = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    if(!/^\d{10}$/.test(phone)) return showToast("❌ Phone must be 10 digits", "#ef4444");
    const newJob = { 
      title: e.target.title.value, pay: e.target.pay.value, region: e.target.region.value, 
      category: e.target.category.value, phone: phone, description: e.target.description.value,
      user_id: user?.id, status: 'active'
    };
    const { error } = await supabase.from('jobs').insert([newJob]);
    if (!error) { e.target.reset(); showToast("✅ Job Posted!", "#10b981"); setView("find-work"); }
  };

  const addWorker = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    if(!/^\d{10}$/.test(phone)) return showToast("❌ Phone must be 10 digits", "#ef4444");
    const newWorker = { 
      name: e.target.name.value, skill: e.target.skill.value, region: e.target.region.value, 
      experience: e.target.exp.value, phone: phone, bio: e.target.bio.value,
      user_id: user?.id, status: 'active'
    };
    const { error } = await supabase.from('workers').insert([newWorker]);
    if (!error) { e.target.reset(); showToast("✅ Skill Listed!", "#f59e0b"); setView("find-talent"); }
  };

  const deleteItem = async (id, table) => {
    if(!window.confirm("🗑️ Delete this post permanently?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) { showToast("Post Removed", "#ef4444"); setIndex(0); }
  };

  const filteredJobs = jobs.filter(j => (regionFilter === "All" || j.region === regionFilter) && (j.title?.toLowerCase().includes(searchTerm.toLowerCase())));
  const filteredWorkers = workers.filter(w => (regionFilter === "All" || w.region === regionFilter) && (w.name?.toLowerCase().includes(searchTerm.toLowerCase())));

  const getWaLink = (num) => {
    const cleanNum = num.replace(/^0/, '256').replace(/^\+/, '');
    return `whatsapp://send?phone=${cleanNum}`;
  };

  // --- 1. LOADING SCREEN ---
  if (authStep === "loading") return <div style={styles.container}>Loading...</div>;

  // --- 2. TERMS & POLICY GATE ---
  if (!hasAgreed) return (
    <div style={{...styles.container, justifyContent: 'center'}}>
      <div style={styles.termsBox}>
        <h2 style={{color: '#10b981', marginBottom: '15px'}}>Terms & Usage 🇺🇬</h2>
        <div style={styles.termsText}>
          <p>• <b>Expiry:</b> All posts automatically delete after 10 days to keep the app clean.</p>
          <p>• <b>Stay Fresh:</b> Use the 💓 <b>Bump</b> button to keep your post live for another 10 days.</p>
          <p>• <b>Updates:</b> Always <b>"Refresh the page"</b> to see the latest available jobs or talent.</p>
          <p>• <b>Safe Transactions:</b> Verify all services and goods in person before completing any payments. For support, contact <b>your-email@example.com</b>.</p>
        </div>
        <button onClick={handleAgree} style={styles.submitBtn}>I Agree & Continue</button>
      </div>
    </div>
  );

  // --- 3. LOGIN/WELCOME SCREEN ---
  if (authStep === "welcome") return (
    <div style={styles.container}>
      <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }`}</style>
      <div style={styles.loginWrapper}>
        <div style={styles.heroLogo}>🇺🇬</div>
        <h1 style={styles.heroTitle}>UG JobSwipe</h1>
        <p style={styles.heroSub}>Find work or hire talent instantly in Uganda.</p>
        <form onSubmit={handleAuth} style={styles.form}>
          <h2 style={{fontSize: '1.2rem', margin: 0}}>{isLoginMode ? "Welcome Back" : "Create Account"}</h2>
          <input name="email" type="email" placeholder="Email Address" required style={styles.input} />
          <input name="password" type="password" placeholder="Password (Min 8 chars)" required style={styles.input} />
          {/* LOGIN BUTTON SHAKES ON WRONG PASSWORD (SHAKE STATE) */}
          <button type="submit" style={{...styles.submitBtn, animation: shake ? 'shake 0.4s ease-in-out' : 'none'}}>{isLoginMode ? "Login" : "Join Now"}</button>
        </form>
        <button onClick={() => setIsLoginMode(!isLoginMode)} style={{background: 'none', border: 'none', color: '#94a3b8', marginTop: '15px', cursor: 'pointer'}}>
          {isLoginMode ? "No account? Join here" : "Have account? Login here"}
        </button>
      </div>
    </div>
  );

  // --- 4. MAIN APP CONTENT ---
  return (
    <div style={styles.container}>
      <style>{`.nav-btn { box-sizing: border-box; font-size: 0.8rem; padding: 10px; border-radius: 10px; border: 1px solid #1e293b; background: #0f172a; color: #94a3b8; cursor: pointer; flex: 1; } .nav-btn.active { background: #10b981; color: white; border: none; font-weight: bold; }`}</style>
      {toast.visible && <div style={{...styles.toast, backgroundColor: toast.color}}>{toast.message}</div>}
      <header style={styles.header}>
        <h1 style={styles.logo}>UG JobSwipe 🇺🇬</h1>
        {/* REFRESH INSTRUCTION PHRASE */}
        <p style={{fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '-10px', marginBottom: '15px'}}>Tip: Refresh to update post lists</p>
        
        <div style={styles.tabContainer}>
          <button onClick={() => {setView("find-work"); setIndex(0);}} className={`nav-btn ${view === "find-work" ? "active" : ""}`}>Find Work</button>
          <button onClick={() => {setView("find-talent"); setIndex(0);}} className={`nav-btn ${view === "find-talent" ? "active" : ""}`}>Find Talent</button>
        </div>
        <div style={{...styles.tabContainer, marginTop: '10px'}}>
          <button onClick={() => setView("post-job")} className={`nav-btn ${view === "post-job" ? "active" : ""}`}>Post Job</button>
          <button onClick={() => setView("post-skill")} className={`nav-btn ${view === "post-skill" ? "active" : ""}`}>Post My Skill</button>
        </div>
      </header>

      <main style={styles.mainContent}>
        {view === "find-work" && (
          <div>
            <select style={styles.dropdown} value={regionFilter} onChange={(e) => { setRegionFilter(e.target.value); setIndex(0); }}>
              <option value="All">All Regions</option><option>Central</option><option>Northern</option><option>Western</option><option>Eastern</option>
            </select>
            <input style={styles.searchBar} placeholder="Search jobs..." onChange={(e) => { setSearchTerm(e.target.value); setIndex(0); }} />
            {filteredJobs.length > 0 ? (
              <div style={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                    <span style={styles.badge}>{filteredJobs[index].category}</span>
                    <span style={{...styles.badge, background: filteredJobs[index].status === 'taken' ? '#ef4444' : 'rgba(16,185,129,0.1)', color: filteredJobs[index].status === 'taken' ? 'white' : '#10b981'}}>
                      {filteredJobs[index].status === 'taken' ? '⛔ TAKEN' : '✅ ACTIVE'}
                    </span>
                </div>
                <h2 style={styles.cardTitle}>{filteredJobs[index].title}</h2>
                <p style={{...styles.cardPay, opacity: filteredJobs[index].status === 'taken' ? 0.3 : 1}}>{filteredJobs[index].pay}</p>
                <div style={styles.descBox}><p style={styles.descText}>{filteredJobs[index].description}</p></div>
                
                {filteredJobs[index].status === 'active' ? (
                  <>
                    <a href={`tel:${filteredJobs[index].phone}`} style={styles.callBtn}>📞 Call Employer</a>
                    <a href={getWaLink(filteredJobs[index].phone)} style={styles.whatsappBtn}>💬 WhatsApp</a>
                  </>
                ) : <div style={{padding: '15px', color: '#94a3b8'}}>This job has been filled.</div>}
                
                {user?.id === filteredJobs[index].user_id && (
                  <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <button onClick={() => updateHeartbeat(filteredJobs[index].id, 'jobs')} style={{...styles.callBtn, background: '#334155', fontSize: '0.8rem', flex: 1}}>💓 Bump</button>
                    <button onClick={() => toggleStatus(filteredJobs[index].id, 'jobs', filteredJobs[index].status)} style={{...styles.callBtn, background: '#1e293b', fontSize: '0.8rem', flex: 1}}>
                       {filteredJobs[index].status === 'active' ? 'Mark Taken' : 'Re-open'}
                    </button>
                  </div>
                )}
                <div style={{marginTop: '10px', fontSize: '0.7rem', color: '#475569'}}>Posted: {timeAgo(filteredJobs[index].created_at)}</div>
                <div style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
                  <button onClick={() => alert("🚩 Report Logged")} style={styles.reportBtn}>🚩 Report Scam</button>
                  {user?.id === filteredJobs[index].user_id && (
                    <button onClick={() => deleteItem(filteredJobs[index].id, 'jobs')} style={{...styles.reportBtn, color: '#94a3b8'}}>🗑️ Delete</button>
                  )}
                </div>
                {filteredJobs.length > 1 && <button onClick={() => setIndex((index + 1) % filteredJobs.length)} style={styles.nextBtn}>Next Job →</button>}
              </div>
            ) : <p style={styles.empty}>No jobs found.</p>}
          </div>
        )}

        {view === "find-talent" && (
          <div>
            <select style={styles.dropdown} value={regionFilter} onChange={(e) => { setRegionFilter(e.target.value); setIndex(0); }}>
              <option value="All">All Regions</option><option>Central</option><option>Northern</option><option>Western</option><option>Eastern</option>
            </select>
            <input style={styles.searchBar} placeholder="Search talent..." onChange={(e) => { setSearchTerm(e.target.value); setIndex(0); }} />
            {filteredWorkers.length > 0 ? (
              <div style={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                    <span style={{...styles.badge, color: '#f59e0b'}}>{filteredWorkers[index].skill}</span>
                    <span style={{...styles.badge, background: filteredWorkers[index].status === 'taken' ? '#475569' : 'rgba(245,158,11,0.1)', color: '#f59e0b'}}>
                      {filteredWorkers[index].status === 'taken' ? '⛔ UNAVAILABLE' : '✅ AVAILABLE'}
                    </span>
                </div>
                <h2 style={styles.cardTitle}>{filteredWorkers[index].name}</h2>
                <p style={{fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 10px 0'}}>Exp: {filteredWorkers[index].experience}</p>
                <div style={styles.descBox}><p style={styles.descText}>{filteredWorkers[index].bio}</p></div>
                
                {filteredWorkers[index].status === 'active' ? (
                  <>
                    <a href={`tel:${filteredWorkers[index].phone}`} style={{...styles.callBtn, backgroundColor: '#f59e0b'}}>📞 Hire Worker</a>
                    <a href={getWaLink(filteredWorkers[index].phone)} style={styles.whatsappBtn}>💬 WhatsApp</a>
                  </>
                ) : <div style={{padding: '15px', color: '#94a3b8'}}>This worker is currently busy.</div>}
                
                {user?.id === filteredWorkers[index].user_id && (
                   <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <button onClick={() => updateHeartbeat(filteredWorkers[index].id, 'workers')} style={{...styles.callBtn, background: '#334155', fontSize: '0.8rem', flex: 1, backgroundColor: '#334155'}}>💓 Bump</button>
                    <button onClick={() => toggleStatus(filteredWorkers[index].id, 'workers', filteredWorkers[index].status)} style={{...styles.callBtn, background: '#1e293b', fontSize: '0.8rem', flex: 1, backgroundColor: '#1e293b'}}>
                       {filteredWorkers[index].status === 'active' ? 'Mark Busy' : 'Re-open'}
                    </button>
                  </div>
                )}
                <div style={{marginTop: '10px', fontSize: '0.7rem', color: '#475569'}}>Posted: {timeAgo(filteredWorkers[index].created_at)}</div>
                <div style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
                  <button onClick={() => alert("🚩 Report Logged")} style={styles.reportBtn}>🚩 Report User</button>
                  {user?.id === filteredWorkers[index].user_id && (
                    <button onClick={() => deleteItem(filteredWorkers[index].id, 'workers')} style={{...styles.reportBtn, color: '#94a3b8'}}>🗑️ Delete</button>
                  )}
                </div>
                {filteredWorkers.length > 1 && <button onClick={() => setIndex((index + 1) % filteredWorkers.length)} style={styles.nextBtn}>Next Worker →</button>}
              </div>
            ) : <p style={styles.empty}>No talent found.</p>}
          </div>
        )}

        {view === "post-job" && (
          <form onSubmit={addJob} style={styles.form}>
            <h3 style={{color: '#10b981', margin: '0 0 10px 0'}}>Hire Someone</h3>
            <input name="title" placeholder="Job Title" required style={styles.input} />
            <input name="pay" placeholder="Pay (e.g. 200,000/=)" required style={styles.input} />
            <select name="category" style={styles.input} required>
              <option value="">Category</option>
              <option>Retail</option><option>Agriculture</option><option>Transport</option><option>Construction</option><option>Repair</option><option>Delivery</option><option>House Keeping</option><option>Food & Beverages</option><option>Health</option><option>Media</option><option>Beauty</option><option>Unique</option><option>Research & Education</option><option>Logistics</option>
            </select>
            <select name="region" style={styles.input} required>
              <option value="">Region</option><option>Central</option><option>Northern</option><option>Western</option><option>Eastern</option>
            </select>
            <textarea name="description" placeholder="Requirements..." required style={{...styles.input, minHeight: '80px'}} />
            <input name="phone" type="tel" placeholder="Phone Number (10 digits)" pattern="\d{10}" maxLength="10" required style={styles.input} />
            <button type="submit" style={styles.submitBtn}>Post Job Now</button>
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
            <input name="phone" type="tel" placeholder="Phone Number (10 digits)" pattern="\d{10}" maxLength="10" required style={styles.input} />
            <button type="submit" style={{...styles.submitBtn, background: '#f59e0b'}}>List My Profile</button>
          </form>
        )}

        <button onClick={handleLogout} style={{marginTop: '40px', background: 'none', border: 'none', color: '#475569', fontSize: '0.8rem', cursor: 'pointer', width: '100%'}}>Sign Out Account</button>
      </main>
    </div>
  );
}
