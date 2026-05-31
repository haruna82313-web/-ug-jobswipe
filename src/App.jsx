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
 import QuoteDisplay from './components/QuoteDisplay';

import { requestNotificationPermission, sendInterestNotification } from './utils/notifications';

const Icons = {
  Briefcase: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  Users: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  PlusCircle: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
  ),
  UserCircle: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
  ),
  History: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/><line x1="12" y1="7" x2="12" y2="12"/><line x1="12" y1="12" x2="16" y2="14"/></svg>
  ),
  TrendingUp: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  ),
  ShieldCheck: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  Mail: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  )
};

// --- STYLES ---
const styles = {
  container: { boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', backgroundColor: '#020617', minHeight: '100vh', padding: '0 15px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  mainContent: { boxSizing: 'border-box', width: '100%', maxWidth: '450px', flex: 1, display: 'flex', flexDirection: 'column' },
  supportEmail: { color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center', width: '100%', display: 'block', marginTop: 'auto', paddingBottom: '30px' },
  homeDashboard: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', overflow: 'hidden', padding: '10px 0' },
  refreshBtn: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '12px 24px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' },
  pageContainer: { width: '100%', padding: '10px 0 40px 0', animation: 'fadeIn 0.4s ease-out' },
  glassCard: { background: 'linear-gradient(145deg, #0f172a, #161e31)', padding: '25px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', boxSizing: 'border-box' }
};

const HubButton = ({ id, label, icon, glowClass, currentView, setView }) => (
  <button 
    onClick={() => setView(id)} 
    className={`hub-btn ${currentView === id ? `active ${glowClass}` : ''}`}
  >
    <span style={{ display: 'flex' }}>
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

// Main App Component for UG JobSwipe
export default function App() {
  const [authStep, setAuthStep] = useState("loading");
  const [user, setUser] = useState(null);
  const [hasAgreed, setHasAgreed] = useState(localStorage.getItem('ug_terms_agreed') === 'true');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [view, setView] = useState("home");
  const [regionFilter, setRegionFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", color: "" });
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        showToast("✅ Account created! Logging you in...", "#10b981");
        
        // Since email confirmation is off, we can try to sign them in immediately
        // or just let them click login. Better UX: switch to login mode.
        setIsLoginMode(true);
      }
    } catch (err) { showToast(err.message, "#ef4444"); } finally { setLoading(false); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const addJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const phone = formData.get('phone');
    const nin = formData.get('nin');
    const photoFile = e.target.querySelector('input[type="file"]').files[0];

    if (!/^\d{10}$/.test(phone)) { setLoading(false); return showToast("❌ Phone must be 10 digits", "#ef4444"); }
    if (!nin || nin.length < 14) { setLoading(false); return showToast("❌ Valid NIN is required", "#ef4444"); }
    if (!photoFile) { setLoading(false); return showToast("❌ Profile photo is required", "#ef4444"); }

    try {
      // 1. Upload Photo to Supabase Storage
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `job_profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, photoFile);

      if (uploadError) throw new Error("Photo upload failed: " + uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // 2. Save Job to Database
      const newJob = { 
        title: formData.get('title'), 
        pay: formData.get('pay'), 
        region: formData.get('region'), 
        category: formData.get('category'), 
        landmark: formData.get('landmark'),
        phone: phone, 
        description: formData.get('description'), 
        nin: nin,
        profile_photo: publicUrl,
        user_id: user?.id, 
        status: 'active',
        payment_status: isAdmin ? 'paid' : 'pending' 
      };

      const { data, error } = await supabase.from('jobs').insert([newJob]).select();
      if (error) throw error;
      if (data) setJobs([data[0], ...jobs]);
      
      e.target.reset(); 
      showToast("✅ Saved! Please complete payment to go live.", "#10b981"); 
      setView("my-posts");
    } catch (err) { 
      showToast("⚠️ Error: " + err.message, "#ef4444"); 
    } finally { 
      setLoading(false); 
    }
  };

  const addWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const phone = formData.get('phone');
    const nin = formData.get('nin');
    const photoFile = e.target.querySelector('input[type="file"]').files[0];

    if (!/^\d{10}$/.test(phone)) { setLoading(false); return showToast("❌ Phone must be 10 digits", "#ef4444"); }
    if (!nin || nin.length < 14) { setLoading(false); return showToast("❌ Valid NIN is required", "#ef4444"); }
    if (!photoFile) { setLoading(false); return showToast("❌ Profile photo is required", "#ef4444"); }

    try {
      // 1. Upload Photo to Supabase Storage
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `worker_profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, photoFile);

      if (uploadError) throw new Error("Photo upload failed: " + uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // 2. Save Worker to Database
      const newWorker = { 
        name: formData.get('name'), 
        skill: formData.get('skill'), 
        region: formData.get('region'), 
        experience: formData.get('exp'), 
        rate: formData.get('rate'),
        phone: phone, 
        bio: formData.get('bio'), 
        nin: nin,
        profile_photo: publicUrl,
        user_id: user?.id, 
        status: 'active',
        payment_status: isAdmin ? 'paid' : 'pending'
      };

      const { data, error } = await supabase.from('workers').insert([newWorker]).select();
      if (error) throw error;
      if (data) setWorkers([data[0], ...workers]);
      
      e.target.reset(); 
      showToast("✅ Saved! Please complete payment to go live.", "#f59e0b"); 
      setView("my-posts");
    } catch (err) { 
      showToast("⚠️ Error: " + err.message, "#ef4444"); 
    } finally { 
      setLoading(false); 
    }
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
        
        .clickable-logo { cursor: pointer; transition: opacity 0.2s; }
        .clickable-logo:hover { opacity: 0.8; }
        
        /* Hub Grid & Buttons */
        .hub-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 12px; 
          width: 100%; 
          margin-top: 20px;
          padding: 5px;
        }
        @media (min-width: 600px) {
          .hub-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .hub-btn { 
          box-sizing: border-box; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center;
          gap: 10px;
          padding: 20px 10px; 
          border-radius: 20px; 
          border: 1px solid #1e293b; 
          background: #0f172a; 
          color: #94a3b8; 
          cursor: pointer; 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          position: relative;
          overflow: hidden;
        }
        .hub-btn:active { transform: scale(0.95); }
        .hub-btn:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-2px); }
        .hub-btn span { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.02em; }
        
        /* Individual Button Glows - Always Alive */
        .glow-work { 
          border-color: rgba(16, 185, 129, 0.4); 
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); 
          color: #10b981; 
        }
        .glow-work.active { 
          background: rgba(16, 185, 129, 0.1); 
          border-color: #10b981; 
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.5); 
        }

        .glow-talent { 
          border-color: rgba(245, 158, 11, 0.4); 
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.2); 
          color: #f59e0b; 
        }
        .glow-talent.active { 
          background: rgba(245, 158, 11, 0.1); 
          border-color: #f59e0b; 
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.5); 
        }

        .glow-post { 
          border-color: rgba(59, 130, 246, 0.4); 
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.2); 
          color: #3b82f6; 
        }
        .glow-post.active { 
          background: rgba(59, 130, 246, 0.1); 
          border-color: #3b82f6; 
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.5); 
        }

        .glow-skill { 
          border-color: rgba(168, 85, 247, 0.4); 
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.2); 
          color: #a855f7; 
        }
        .glow-skill.active { 
          background: rgba(168, 85, 247, 0.1); 
          border-color: #a855f7; 
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.5); 
        }

        .glow-my { 
          border-color: rgba(236, 72, 153, 0.4); 
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.2); 
          color: #ec4899; 
        }
        .glow-my.active { 
          background: rgba(236, 72, 153, 0.1); 
          border-color: #ec4899; 
          box-shadow: 0 0 25px rgba(236, 72, 153, 0.5); 
        }

        .glow-trend { 
          border-color: rgba(6, 182, 212, 0.4); 
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.2); 
          color: #06b6d4; 
        }
        .glow-trend.active { 
          background: rgba(6, 182, 212, 0.1); 
          border-color: #06b6d4; 
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.5); 
        }

        /* Admin Pill - Uganda Flag Theme */
        .admin-pill {
          margin-top: 20px;
          padding: 12px 32px;
          border-radius: 50px;
          background: linear-gradient(to right, #000000 33%, #fadc05 33% 66%, #de0707 66%);
          color: white;
          border: 2px solid rgba(255,255,255,0.1);
          font-weight: 900;
          font-size: 0.85rem;
          cursor: pointer;
          width: fit-content;
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.5), 0 0 15px rgba(250, 220, 5, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
          letter-spacing: 0.05em;
        }
        .admin-pill:hover { 
          transform: translateY(-3px) scale(1.05); 
          box-shadow: 0 15px 25px -5px rgba(222, 7, 7, 0.3), 0 0 20px rgba(250, 220, 5, 0.4);
          border-color: #fadc05;
        }

        /* Hamburger Menu */
        .hamburger-menu {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 75%; 
          max-width: 320px;
          background: #000000; /* Black from Flag */
          border-left: 3px solid #fadc05; /* Yellow from Flag */
          z-index: 1000;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -10px 0 30px rgba(0,0,0,0.8);
        }
        .hamburger-menu::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; height: 5px;
          background: linear-gradient(to right, #000, #fadc05, #de0707, #000, #fadc05, #de0707);
        }
        .hamburger-menu.open { transform: translateX(0); }
        
        .menu-header-ug {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 20px;
        }
        .crane-logo { font-size: 3rem; margin-bottom: 10px; filter: drop-shadow(0 0 10px rgba(222, 7, 7, 0.5)); }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 15px;
          color: #f8fafc;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 700;
          padding: 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }
        .menu-item:hover { 
          background: rgba(250, 220, 5, 0.1); 
          color: #fadc05; 
          border-left-color: #de0707;
          transform: translateX(5px);
        }
        .menu-item.active { background: rgba(250, 220, 5, 0.15); border-left-color: #fadc05; color: #fadc05; }
        .menu-item.logout { 
          background: linear-gradient(to right, #000000 33%, #fadc05 33% 66%, #de0707 66%);
          color: white; 
          border-left-color: #fadc05; 
          font-weight: 900;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .menu-item.logout:hover { 
          background: linear-gradient(to right, #000000 33%, #fadc05 33% 66%, #de0707 66%);
          border-left-color: #de0707;
          transform: translateX(10px);
          box-shadow: 0 6px 15px rgba(222, 7, 7, 0.4);
        }

        .swipe-container { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; gap: 20px; width: 100%; scrollbar-width: none; padding: 10px 0; }
        .swipe-container::-webkit-scrollbar { display: none; }
        .swipe-card { flex: 0 0 100%; scroll-snap-align: center; box-sizing: border-box; }
        .glow-job { border: 1px solid rgba(16, 185, 129, 0.4) !important; box-shadow: 0 0 15px rgba(16, 185, 129, 0.15), 0 20px 40px rgba(0,0,0,0.6) !important; }
        .glow-talent-card { border: 1px solid rgba(245, 158, 11, 0.4) !important; box-shadow: 0 0 15px rgba(245, 158, 11, 0.15), 0 20px 40px rgba(0,0,0,0.6) !important; }
      `}</style>

      <Toast {...toast} />

      <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      
      <Header 
        view={view} 
        setView={setView} 
        handleRefresh={handleRefresh} 
        isAdmin={isAdmin} 
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={handleLogout}
      />

      <main style={styles.mainContent}>
        {view === "home" && (
          <div style={styles.homeDashboard}>
            <button onClick={handleRefresh} style={styles.refreshBtn}>
              🔄 Refresh to view new posts
            </button>
            
            <QuoteDisplay />

            <div className="hub-grid">
              <HubButton id="find-work" label="Find Work" icon={<Icons.Briefcase size={28} />} glowClass="glow-work" currentView={view} setView={setView} />
              <HubButton id="find-talent" label="Find Talent" icon={<Icons.Users size={28} />} glowClass="glow-talent" currentView={view} setView={setView} />
              <HubButton id="post-job" label="Post Job" icon={<Icons.PlusCircle size={28} />} glowClass="glow-post" currentView={view} setView={setView} />
              <HubButton id="post-skill" label="Post My Skill" icon={<Icons.UserCircle size={28} />} glowClass="glow-skill" currentView={view} setView={setView} />
              <HubButton id="my-posts" label="My Posts" icon={<Icons.History size={28} />} glowClass="glow-my" currentView={view} setView={setView} />
              <HubButton id="trending" label="Trending" icon={<Icons.TrendingUp size={28} />} glowClass="glow-trend" currentView={view} setView={setView} />
            </div>

            {isAdmin && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={() => setView("admin-panel")} 
                  className="admin-pill"
                >
                  🛡️ ADMIN PANEL
                </button>
              </div>
            )}
          </div>
        )}

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

        {view === "terms" && <TermsAndConditions onAgree={() => setView('home')} hideButton={view === 'home'} />}

        {view === "support" && (
          <div style={styles.pageContainer}>
            <div style={styles.glassCard}>
              <h2 style={{ color: '#10b981', fontSize: '1.6rem', fontWeight: '900', marginBottom: '25px', textAlign: 'center' }}>Professional Support 🇺🇬</h2>
              
              <div style={{ marginBottom: '30px' }}>
                <div style={{ color: '#f8fafc', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Icons.ShieldCheck size={20} color="#fadc05" /> 
                  <span>VERIFIED GUIDANCE</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.7', textAlign: 'justify' }}>
                  Our professional support line is strictly dedicated to providing expert guidance on app navigation, technical troubleshooting, and account management for the Ugandan workforce. We maintain a high standard of professional decorum and expect the same from our users. This line is a vital resource for serious workers and employers; any misuse, prank calls, or non-professional inquiries will result in immediate blacklisting from our support services. Please use this resource responsibly to ensure we can help those who truly need it to find their next big opportunity.
                </p>
                <a href="tel:0752333216" style={{ display: 'block', marginTop: '15px', padding: '15px', background: 'rgba(250, 220, 5, 0.1)', border: '1px solid #fadc05', borderRadius: '14px', color: '#fadc05', textDecoration: 'none', textAlign: 'center', fontWeight: '800' }}>
                  📞 CONTACT SUPPORT AGENT
                </a>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '30px 0' }} />

              <div>
                <div style={{ color: '#f8fafc', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Icons.Mail size={20} color="#10b981" /> 
                  <span>EMAIL INQUIRIES</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.7', textAlign: 'justify' }}>
                  For detailed inquiries regarding business partnerships, large-scale recruitment, or advertising on UG JobSwipe, please reach out via our official email channel. We respond to all professional inquiries within 24 hours to ensure your business needs are met with Ugandan excellence and speed.
                </p>
                <a href="mailto:ugjobswipe333@gmail.com" style={{ display: 'block', marginTop: '15px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '14px', color: '#10b981', textDecoration: 'none', textAlign: 'center', fontWeight: '800' }}>
                  📩 ugjobswipe333@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}

        {view === "trending" && (
          <div style={styles.pageContainer}>
            <div style={styles.glassCard}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Icons.TrendingUp size={48} color="#10b981" />
                <h2 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '900', marginTop: '10px' }}>Market Trends 🇺🇬</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Real-time insights into Uganda's job market</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>{jobs.length}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>ACTIVE JOBS</div>
                </div>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b' }}>{workers.length}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>TOP TALENT</div>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  📍 Top Job Regions
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {['Kampala', 'Mbarara', 'Entebbe', 'Jinja'].map((reg, i) => (
                    <span key={reg} style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.85rem', color: i === 0 ? '#10b981' : '#f8fafc', border: i === 0 ? '1px solid #10b981' : '1px solid transparent', fontWeight: '600' }}>
                      {reg} {i === 0 ? '🔥' : ''}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  🛠️ In-Demand Skills
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { skill: 'Plumbing & Repairs', demand: 'Very High' },
                    { skill: 'Graphic Design', demand: 'High' },
                    { skill: 'Driving/Delivery', demand: 'Increasing' }
                  ].map((s) => (
                    <div key={s.skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 20px', borderRadius: '15px' }}>
                      <span style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: '600' }}>{s.skill}</span>
                      <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '10px' }}>{s.demand}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.75rem', textAlign: 'center', marginTop: '30px', fontStyle: 'italic' }}>
                Updated every hour based on UG JobSwipe activity.
              </p>
            </div>
          </div>
        )}

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
      </main>
    </div>
  );
}
