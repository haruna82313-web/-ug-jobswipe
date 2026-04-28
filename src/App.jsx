import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Toast from './components/Toast';
import Header from './components/Header';
import TermsAndConditions from './components/TermsAndConditions';
import AuthForm from './components/AuthForm';
import JobCard from './components/JobCard';
import WorkerCard from './components/WorkerCard';
import PostJobForm from './components/PostJobForm';
import PostSkillForm from './components/PostSkillForm';
 import Filters from './components/Filters';
 import HowItWorks from './components/HowItWorks';

import { requestNotificationPermission, sendInterestNotification } from './utils/notifications';

// --- STYLES ---
const styles = {
  container: { boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', backgroundColor: '#020617', minHeight: '100vh', padding: '0 15px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  mainContent: { boxSizing: 'border-box', width: '100%', maxWidth: '400px' },
  supportEmail: { color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center', width: '100%', display: 'block', marginTop: '30px' }
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

  const isAdmin = user?.email === 'haruna82313@gmail.com'; // Admin access for Haruna

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthStep(session ? "app" : "welcome");
      if (session?.user) requestNotificationPermission(session.user.id);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthStep(session ? "app" : "welcome");
      if (session?.user) requestNotificationPermission(session.user.id);
    });

    const fetchData = async () => {
      const { data: j } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (j) setJobs(j);
      const { data: w } = await supabase.from('workers').select('*').order('created_at', { ascending: false });
      if (w) setWorkers(w);
    };
    fetchData();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleAgree = () => { localStorage.setItem('ug_terms_agreed', 'true'); setHasAgreed(true); };
  const showToast = (message, color) => { setToast({ visible: true, message, color }); setTimeout(() => setToast({ visible: false, message: "", color: "" }), 3000); };
  const handleRefresh = () => { window.location.reload(); };

  const approvePayment = async (id, table) => {
    const { error } = await supabase.from(table).update({ payment_status: 'paid' }).eq('id', id);
    if (!error) {
      showToast("✅ Payment Approved!", "#10b981");
      if (table === 'jobs') setJobs(prev => prev.map(j => j.id === id ? { ...j, payment_status: 'paid' } : j));
      if (table === 'workers') setWorkers(prev => prev.map(w => w.id === id ? { ...w, payment_status: 'paid' } : w));
    } else {
      showToast("⚠️ Approval failed", "#ef4444");
    }
  };

  const updateHeartbeat = async (id, table) => {
    const now = new Date().toISOString();
    // We update created_at to "bump" the post to the top since we order by created_at
    const { error } = await supabase.from(table).update({ created_at: now }).eq('id', id);
    
    if (error) {
      console.error("Bump error:", error);
      showToast("⚠️ Failed to bump post", "#ef4444");
    } else {
      showToast("✅ Post Bumped!", "#10b981");
      if (table === 'jobs') setJobs(prev => {
        const item = prev.find(i => i.id === id);
        if (!item) return prev;
        return [{ ...item, created_at: now }, ...prev.filter(i => i.id !== id)];
      });
      if (table === 'workers') setWorkers(prev => {
        const item = prev.find(i => i.id === id);
        if (!item) return prev;
        return [{ ...item, created_at: now }, ...prev.filter(i => i.id !== id)];
      });
    }
  };

  const toggleStatus = async (id, table, currentStatus) => {
    // If status is missing/null, we assume it was 'active'
    const statusToCompare = currentStatus || 'active';
    const newStatus = statusToCompare === 'active' ? 'taken' : 'active';
    
    // We use .select() to confirm the database actually updated the row
    const { data, error } = await supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error("Status update error:", error);
      showToast("⚠️ Database Error: " + error.message, "#ef4444");
    } else if (!data || data.length === 0) {
      showToast("⚠️ Could not find post to update", "#ef4444");
    } else {
      const updatedItem = data[0];
      showToast(`✅ Status: ${updatedItem.status.toUpperCase()}`, "#334155");
      
      // Update local state with the actual data returned from the DB
      if (table === 'jobs') {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: updatedItem.status } : j));
      } else {
        setWorkers(prev => prev.map(w => w.id === id ? { ...w, status: updatedItem.status } : w));
      }
    }
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
    if (!/^\d{10}$/.test(phone)) { setLoading(false); return showToast("❌ Phone must be 10 digits", "#ef4444"); }
    const newJob = { 
      title: e.target.title.value, 
      pay: e.target.pay.value, 
      region: e.target.region.value, 
      category: e.target.category.value, 
      phone: phone, 
      description: e.target.description.value, 
      user_id: user?.id, 
      status: 'active',
      payment_status: isAdmin ? 'paid' : 'pending' // Admin posts are auto-paid
    };
    try {
      const { data, error } = await supabase.from('jobs').insert([newJob]).select();
      if (error) throw error;
      if (data) setJobs([data[0], ...jobs]);
      e.target.reset(); 
      showToast("✅ Saved! Please complete payment to go live.", "#10b981"); 
      setView("my-posts"); // Redirect to My Posts to show payment instructions
    } catch (err) { showToast("⚠️ Error: " + err.message, "#ef4444"); } finally { setLoading(false); }
  };

  const addWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    const phone = e.target.phone.value;
    if (!/^\d{10}$/.test(phone)) { setLoading(false); return showToast("❌ Phone must be 10 digits", "#ef4444"); }
    const newWorker = { 
      name: e.target.name.value, 
      skill: e.target.skill.value, 
      region: e.target.region.value, 
      experience: e.target.exp.value, 
      phone: phone, 
      bio: e.target.bio.value, 
      user_id: user?.id, 
      status: 'active',
      payment_status: isAdmin ? 'paid' : 'pending' // Admin posts are auto-paid
    };
    try {
      const { data, error } = await supabase.from('workers').insert([newWorker]).select();
      if (error) throw error;
      if (data) setWorkers([data[0], ...workers]);
      e.target.reset(); 
      showToast("✅ Saved! Please complete payment to go live.", "#f59e0b"); 
      setView("my-posts"); // Redirect to My Posts to show payment instructions
    } catch (err) { showToast("⚠️ Error: " + err.message, "#ef4444"); } finally { setLoading(false); }
  };

  const logInterest = async (item, type) => {
    if (!user) return; // Only logged in users trigger notifications
    if (user.id === item.user_id) return; // Don't notify yourself

    // 1. Send simulated push notification
    sendInterestNotification(item.user_id, type, item.title || item.skill);

    // 2. Log to Supabase 'notifications' table (optional, but good for in-app history)
    await supabase.from('notifications').insert([{
      user_id: item.user_id, // Who gets notified
      from_user: user.id,    // Who clicked
      type: type,            // 'call' or 'whatsapp'
      item_id: item.id,
      item_title: item.title || item.skill,
      read: false
    }]);
  };

  const deleteItem = async (id, table) => {
    if (!window.confirm("🗑️ Delete this post permanently?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) {
      showToast("Post Removed", "#ef4444");
      if (table === 'jobs') setJobs(jobs.filter(j => j.id !== id));
      if (table === 'workers') setWorkers(workers.filter(w => w.id !== id));
    }
  };

  const filteredJobs = jobs.filter(j => {
    // Public views only show PAID posts
    const isPublicView = view === "find-work";
    if (isPublicView && j.payment_status !== 'paid') return false;

    // Admin view only shows PENDING posts
    if (view === "admin-panel" && j.payment_status !== 'pending') return false;

    const matchesRegion = regionFilter === "All" || j.region === regionFilter;
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      j.title?.toLowerCase().includes(searchLower) || 
      j.category?.toLowerCase().includes(searchLower) || 
      j.description?.toLowerCase().includes(searchLower);
    return matchesRegion && matchesSearch;
  });

  const filteredWorkers = workers.filter(w => {
    // Public views only show PAID posts
    const isPublicView = view === "find-talent";
    if (isPublicView && w.payment_status !== 'paid') return false;

    // Admin view only shows PENDING posts
    if (view === "admin-panel" && w.payment_status !== 'pending') return false;

    const matchesRegion = regionFilter === "All" || w.region === regionFilter;
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      w.name?.toLowerCase().includes(searchLower) || 
      w.skill?.toLowerCase().includes(searchLower) || 
      w.bio?.toLowerCase().includes(searchLower);
    return matchesRegion && matchesSearch;
  });

  if (authStep === "loading") return <div style={styles.container}>Loading...</div>;

  if (!hasAgreed) return <TermsAndConditions onAgree={handleAgree} />;

  if (authStep === "welcome") return (
    <div style={styles.container}>
      <AuthForm 
        handleAuth={handleAuth} 
        loading={loading} 
        isLoginMode={isLoginMode} 
        setIsLoginMode={setIsLoginMode} 
        showPassword={showPassword} 
        setShowPassword={setShowPassword} 
        shake={shake} 
      />
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.03); opacity: 1; color: #10b981; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .pulse-support { animation: heartbeat 2s infinite ease-in-out; }
        .nav-btn { box-sizing: border-box; font-size: 0.8rem; padding: 10px; border-radius: 10px; border: 1px solid #1e293b; background: #0f172a; color: #94a3b8; cursor: pointer; flex: 1; } 
        .nav-btn.active { background: #10b981; color: white; border: none; font-weight: bold; }
        .swipe-container { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; gap: 20px; width: 100%; scrollbar-width: none; padding: 10px 0; }
        .swipe-container::-webkit-scrollbar { display: none; }
        .swipe-card { flex: 0 0 100%; scroll-snap-align: center; box-sizing: border-box; }
        .glow-job { border: 1px solid rgba(16, 185, 129, 0.4) !important; box-shadow: 0 0 15px rgba(16, 185, 129, 0.15), 0 20px 40px rgba(0,0,0,0.6) !important; }
        .glow-talent { border: 1px solid rgba(245, 158, 11, 0.4) !important; box-shadow: 0 0 15px rgba(245, 158, 11, 0.15), 0 20px 40px rgba(0,0,0,0.6) !important; }
      `}</style>

      <Toast {...toast} />

      <Header view={view} setView={setView} handleRefresh={handleRefresh} isAdmin={isAdmin} />

      <main style={styles.mainContent}>
        {view === "find-work" && (
          <div>
            <Filters 
              regionFilter={regionFilter} 
              setRegionFilter={setRegionFilter} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              placeholder="Search jobs..." 
            />
            {filteredJobs.length > 0 ? (
              <div className="swipe-container">
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    user={user} 
                    updateHeartbeat={updateHeartbeat} 
                    toggleStatus={toggleStatus} 
                    deleteItem={deleteItem} 
                    logInterest={logInterest}
                  />
                ))}
              </div>
            ) : <p style={{ textAlign: 'center', color: '#94a3b8' }}>No jobs found.</p>}
          </div>
        )}

        {view === "find-talent" && (
          <div>
            <Filters 
              regionFilter={regionFilter} 
              setRegionFilter={setRegionFilter} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              placeholder="Search talent..." 
            />
            {filteredWorkers.length > 0 ? (
              <div className="swipe-container">
                {filteredWorkers.map((worker) => (
                  <WorkerCard 
                    key={worker.id} 
                    worker={worker} 
                    user={user} 
                    updateHeartbeat={updateHeartbeat} 
                    toggleStatus={toggleStatus} 
                    deleteItem={deleteItem} 
                    logInterest={logInterest}
                  />
                ))}
              </div>
            ) : <p style={{ textAlign: 'center', color: '#94a3b8' }}>No talent found.</p>}
          </div>
        )}

        {view === "admin-panel" && isAdmin && (
          <div>
            <h2 style={{ color: 'white', textAlign: 'center', fontSize: '1.2rem', marginBottom: '10px' }}>🛡️ Pending Approvals</h2>
            <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>Verify the transaction on your phone then click Approve.</p>
            {filteredJobs.length === 0 && filteredWorkers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>No pending payments.</p>
            ) : (
              <div className="swipe-container">
                {filteredJobs.map(j => <JobCard key={j.id} job={j} user={user} updateHeartbeat={updateHeartbeat} toggleStatus={toggleStatus} logInterest={logInterest} deleteItem={deleteItem} isAdmin={isAdmin} approvePayment={approvePayment} view={view} />)}
                {filteredWorkers.map(w => <WorkerCard key={w.id} worker={w} user={user} updateHeartbeat={updateHeartbeat} toggleStatus={toggleStatus} logInterest={logInterest} deleteItem={deleteItem} isAdmin={isAdmin} approvePayment={approvePayment} view={view} />)}
              </div>
            )}
          </div>
        )}

        {view === "post-job" && <PostJobForm addJob={addJob} loading={loading} />}

        {view === "post-skill" && <PostSkillForm addWorker={addWorker} loading={loading} />}

        {view === "how-it-works" && <HowItWorks />}

        {view === "my-posts" && (
          <div>
            <h2 style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: '15px' }}>My Job Posts</h2>
            {jobs.filter(j => j.user_id === user?.id).length > 0 ? (
              <div className="swipe-container">
                {jobs.filter(j => j.user_id === user?.id).map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    user={user} 
                    updateHeartbeat={updateHeartbeat} 
                    toggleStatus={toggleStatus} 
                    deleteItem={deleteItem} 
                    logInterest={logInterest}
                    isAdmin={isAdmin}
                    approvePayment={approvePayment}
                    view={view}
                  />
                ))}
              </div>
            ) : <p style={{ color: '#94a3b8', marginBottom: '30px' }}>No jobs posted yet.</p>}

            <h2 style={{ color: '#f59e0b', fontSize: '1.2rem', marginBottom: '15px', marginTop: '30px' }}>My Skill Profiles</h2>
            {workers.filter(w => w.user_id === user?.id).length > 0 ? (
              <div className="swipe-container">
                {workers.filter(w => w.user_id === user?.id).map((worker) => (
                  <WorkerCard 
                    key={worker.id} 
                    worker={worker} 
                    user={user} 
                    updateHeartbeat={updateHeartbeat} 
                    toggleStatus={toggleStatus} 
                    deleteItem={deleteItem} 
                    logInterest={logInterest}
                    isAdmin={isAdmin}
                    approvePayment={approvePayment}
                    view={view}
                  />
                ))}
              </div>
            ) : <p style={{ color: '#94a3b8' }}>No skill profiles listed yet.</p>}
          </div>
        )}

        <a href="mailto:ugjobswipe333@gmail.com" style={styles.supportEmail} className="pulse-support">
          📩 Inquiries: ugjobswipe333@gmail.com
        </a>

        <button onClick={handleLogout} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', width: '100%', marginBottom: '30px' }}>
          Sign Out Account
        </button>
      </main>
    </div>
  );
}
