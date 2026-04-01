import React, { useState, useEffect } from 'react';

// --- DUMMY DATA ---
const DUMMY_JOBS = [
  { id: 1, title: "Farm Manager", pay: "500,000/=", region: "Central", category: "Agriculture", phone: "0700123456", description: "Looking for 3 years experience in poultry. Must stay on-site." },
  { id: 2, title: "Teacher", pay: "300,000/=", region: "Western", category: "Education", phone: "0711998877", description: "Primary teacher for P.1 to P.3. Must be registered." },
];

const DUMMY_WORKERS = [
  { id: 101, name: "John S.", skill: "Plumber", region: "Central", experience: "5 Years", phone: "0755112233", bio: "Expert in fixing leaking pipes and solar heaters. Available weekends.", photo: "https://unsplash.com" },
  { id: 102, name: "Sarah K.", skill: "Chef", region: "Northern", experience: "2 Years", phone: "0777445566", bio: "Specialized in local Ugandan dishes and catering for small parties.", photo: "https://unsplash.com" },
];

// --- STYLES ---
const styles = {
  container: { fontFamily: 'Inter, sans-serif', backgroundColor: '#020617', minHeight: '100vh', padding: '0 15px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  loginWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', maxWidth: '350px', width: '100%' },
  heroLogo: { fontSize: '3rem', marginBottom: '10px' },
  heroTitle: { fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' },
  heroSub: { fontSize: '1rem', color: '#94a3b8', marginBottom: '30px', lineHeight: '1.5' },
  header: { width: '100%', maxWidth: '400px', padding: '20px 0' },
  logo: { color: '#10b981', textAlign: 'center', fontSize: '1.6rem', marginBottom: '15px' },
  tabContainer: { display: 'flex', gap: '8px', width: '100%' },
  mainContent: { width: '100%', maxWidth: '400px' },
  dropdown: { width: '100%', padding: '12px', background: '#0f172a', color: 'white', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '10px' },
  searchBar: { width: '100%', padding: '12px', background: '#0f172a', color: 'white', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '15px', outline: 'none' },
  card: { background: '#0f172a', padding: '25px', borderRadius: '24px', border: '1px solid #1e293b', textAlign: 'center', position: 'relative' },
  cardTitle: { fontSize: '1.4rem', margin: '10px 0' },
  cardPay: { fontSize: '1.6rem', color: '#f59e0b', margin: '10px 0' },
  descBox: { background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', textAlign: 'left', marginBottom: '15px' },
  descText: { fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: '1.4' },
  badge: { backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' },
  callBtn: { display: 'block', width: '100%', background: '#10b981', color: 'white', padding: '15px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' },
  reportBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', marginTop: '15px', cursor: 'pointer', opacity: 0.7, width: '100%' },
  nextBtn: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b', background: 'transparent', color: 'white', marginTop: '10px', cursor: 'pointer' },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', background: '#0f172a', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b' },
  input: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white' },
  submitBtn: { padding: '16px', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#64748b', marginTop: '30px' },
  sectionTitle: { textAlign: 'center', fontSize: '1.1rem', color: '#94a3b8', marginBottom: '15px' },
  profileImg: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f59e0b', margin: '0 auto 15px', display: 'block' },
  previewImg: { width: '80px', height: '80px', borderRadius: '15px', objectFit: 'cover', alignSelf: 'center', marginBottom: '10px', border: '2px solid #f59e0b' },
  toast: { position: 'fixed', bottom: '20px', right: '20px', padding: '15px 25px', borderRadius: '12px', color: 'white', fontWeight: 'bold', zIndex: 9999, animation: 'slideIn 0.3s ease-out' }
};

export default function App() {
  // authStep: "welcome", "login", or "app"
  const [authStep, setAuthStep] = useState("welcome"); 
  const [jobs, setJobs] = useState(DUMMY_JOBS);
  const [workers, setWorkers] = useState(DUMMY_WORKERS);
  const [view, setView] = useState("find-work"); 
  const [index, setIndex] = useState(0);
  const [regionFilter, setRegionFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [tempPhoto, setTempPhoto] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", color: "" });

  const filteredJobs = jobs.filter(j => 
    (regionFilter === "All" || j.region === regionFilter) &&
    (j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     j.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     j.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredWorkers = workers.filter(w => 
    (regionFilter === "All" || w.region === regionFilter) &&
    (w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     w.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
     w.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => { setIndex(0); }, [view, regionFilter, searchTerm]);

  const showToast = (message, color) => {
    setToast({ visible: true, message, color });
    setTimeout(() => setToast({ visible: false, message: "", color: "" }), 3000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) { setTempPhoto(URL.createObjectURL(file)); }
  };

  const handleReport = (item) => {
    alert(`📢 Report Received: Thank you for keeping UG JobSwipe safe. Our team will investigate "${item.title || item.skill}" immediately.`);
  };

  const handleRealLogin = (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    const password = e.target.password.value;

    if (!/^\d{10}$/.test(phone)) {
      alert("❌ Phone number must be exactly 10 digits.");
      return;
    }
    if (password.length < 6) {
      alert("❌ Password must be at least 6 characters.");
      return;
    }
    setAuthStep("app");
  };

  const addJob = (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    if (!/^\d{10}$/.test(phone)) {
      alert("❌ Invalid Phone: Please enter exactly 10 digits.");
      return;
    }
    const newJob = { id: Date.now(), title: e.target.title.value, pay: e.target.pay.value, region: e.target.region.value, category: e.target.category.value, phone: phone, description: e.target.description.value };
    setJobs([newJob, ...jobs]);
    e.target.reset();
    showToast("✅ Job Posted Successfully!", "#10b981");
    setView("find-work");
  };

  const addWorker = (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    if (!/^\d{10}$/.test(phone)) {
      alert("❌ Invalid Phone: Please enter exactly 10 digits.");
      return;
    }
    const newWorker = { id: Date.now(), name: e.target.name.value, skill: e.target.skill.value, region: e.target.region.value, experience: e.target.exp.value, phone: phone, bio: e.target.bio.value, photo: tempPhoto || "https://placeholder.com" };
    setWorkers([newWorker, ...workers]);
    e.target.reset();
    setTempPhoto(null);
    showToast("✅ Skill Listed Successfully!", "#f59e0b");
    setView("find-talent");
  };

  // --- WELCOME VIEW ---
  if (authStep === "welcome") {
    return (
      <div style={styles.container}>
        <div style={styles.loginWrapper}>
          <div style={styles.heroLogo}>🇺🇬</div>
          <h1 style={styles.heroTitle}>UG JobSwipe</h1>
          <p style={styles.heroSub}>The fastest way to find work or hire talent in Uganda. Swipe. Call. Get the job done.</p>
          <button onClick={() => setAuthStep("login")} style={{...styles.submitBtn, width: '100%', fontSize: '1.1rem'}}>
            Enter App
          </button>
          <p style={{marginTop: '20px', fontSize: '0.8rem', color: '#475569'}}>By entering, you agree to our community safety guidelines.</p>
        </div>
      </div>
    );
  }

  // --- REAL LOGIN VIEW ---
  if (authStep === "login") {
    return (
      <div style={styles.container}>
        <div style={styles.loginWrapper}>
          <div style={styles.heroLogo}>🔑</div>
          <h1 style={styles.heroTitle}>Member Login</h1>
          <p style={{color: '#94a3b8', marginBottom: '20px'}}>Access the UG JobSwipe Marketplace</p>
          <form onSubmit={handleRealLogin} style={{...styles.form, width: '100%'}}>
            <input type="email" placeholder="Email Address" required style={styles.input} />
            <input name="phone" type="tel" placeholder="Phone Number (10 digits)" required style={styles.input} />
            <input name="password" type="password" placeholder="Password" required style={styles.input} />
            <button type="submit" style={{...styles.submitBtn, marginTop: '10px'}}>Login Now</button>
          </form>
          <button onClick={() => setAuthStep("welcome")} style={{background: 'none', border: 'none', color: '#64748b', marginTop: '15px', cursor: 'pointer'}}>← Back</button>
        </div>
      </div>
    );
  }

  // --- MAIN APP VIEW ---
  return (
    <div style={styles.container}>
      <style>{`
        * { box-sizing: border-box !important; transition: all 0.2s ease; }
        button:active { transform: scale(0.98); }
        .nav-btn { font-size: 0.8rem; padding: 10px; border-radius: 10px; border: 1px solid #1e293b; background: #0f172a; color: #94a3b8; cursor: pointer; flex: 1; }
        .nav-btn.active { background: #10b981; color: white; border: none; font-weight: bold; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); }
        @keyframes slideIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {toast.visible && (
        <div style={{...styles.toast, backgroundColor: toast.color}}>
          {toast.message}
        </div>
      )}

      <header style={styles.header}>
        <h1 style={styles.logo}>UG JobSwipe 🇺🇬</h1>
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
            <select style={styles.dropdown} onChange={(e) => setRegionFilter(e.target.value)} value={regionFilter}>
              <option value="All">All Regions</option>
              <option>Central</option><option>Northern</option><option>Western</option><option>Eastern</option>
            </select>
            <input style={styles.searchBar} placeholder="Search jobs (e.g. Teacher, Farm)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            {filteredJobs.length > 0 ? (
              <>
                <div style={styles.card}>
                  <span style={styles.badge}>{filteredJobs[index].category}</span>
                  <h2 style={styles.cardTitle}>{filteredJobs[index].title}</h2>
                  <p style={styles.cardPay}>{filteredJobs[index].pay}</p>
                  <div style={styles.descBox}><p style={styles.descText}>{filteredJobs[index].description}</p></div>
                  <a href={`tel:${filteredJobs[index].phone}`} style={styles.callBtn}>📞 Call Employer</a>
                  <button onClick={() => handleReport(filteredJobs[index])} style={styles.reportBtn}>🚩 Report Scam</button>
                </div>
                {filteredJobs.length > 1 && <button onClick={() => setIndex((index + 1) % filteredJobs.length)} style={styles.nextBtn}>Next Job →</button>}
              </>
            ) : <p style={styles.empty}>No matching jobs found.</p>}
          </div>
        )}

        {view === "find-talent" && (
          <div>
            <select style={styles.dropdown} onChange={(e) => setRegionFilter(e.target.value)} value={regionFilter}>
              <option value="All">All Regions</option>
              <option>Central</option><option>Northern</option><option>Western</option><option>Eastern</option>
            </select>
            <input style={styles.searchBar} placeholder="Search skills (e.g. Plumber, Sarah)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <h3 style={styles.sectionTitle}>Available Workers</h3>
            {filteredWorkers.length > 0 ? (
              <>
                <div style={styles.card}>
                  <img src={filteredWorkers[index].photo} style={styles.profileImg} alt="Worker" />
                  <span style={{...styles.badge, color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)'}}>{filteredWorkers[index].skill}</span>
                  <h2 style={styles.cardTitle}>{filteredWorkers[index].name}</h2>
                  <p style={{textAlign: 'center', color: '#94a3b8'}}>{filteredWorkers[index].region} • {filteredWorkers[index].experience} Exp</p>
                  <div style={styles.descBox}><p style={styles.descText}>{filteredWorkers[index].bio}</p></div>
                  <a href={`tel:${filteredWorkers[index].phone}`} style={{...styles.callBtn, backgroundColor: '#f59e0b'}}>📞 Hire Worker</a>
                  <button onClick={() => handleReport(filteredWorkers[index])} style={styles.reportBtn}>🚩 Report User</button>
                </div>
                {filteredWorkers.length > 1 && <button onClick={() => setIndex((index + 1) % filteredWorkers.length)} style={styles.nextBtn}>Next Worker →</button>}
              </>
            ) : <p style={styles.empty}>No matching workers found.</p>}
          </div>
        )}

        {view === "post-job" && (
          <form onSubmit={addJob} style={styles.form}>
            <h3 style={{color: '#10b981'}}>Hire Someone Today</h3>
            <input name="title" placeholder="Job Title" required style={styles.input} />
            <input name="pay" placeholder="Pay (e.g. 200,000/=)" required style={styles.input} />
            <select name="category" style={styles.input} required>
                <option value="">Category</option><option>Retail</option><option>Agriculture</option><option>Transport</option><option>Construction</option><option>Repair</option><option>Delivery</option><option>House Keeping</option><option>Food & Beverages</option><option>Health</option><option>Media & Communication</option><option>Beauty & Cosmetics</option><option>Unique</option>
            </select>
            <select name="region" style={styles.input} required>
                <option value="">Region</option><option>Central</option><option>Northern</option><option>Western</option><option>Eastern</option>
            </select>
            <textarea name="description" placeholder="Who do you need?" required style={{...styles.input, minHeight: '80px'}} />
            <input name="phone" placeholder="Phone Number (10 digits)" required style={styles.input} />
            <button type="submit" style={styles.submitBtn}>Post Job Now</button>
          </form>
        )}

        {view === "post-skill" && (
          <form onSubmit={addWorker} style={styles.form}>
            <h3 style={{color: '#f59e0b'}}>Market Your Skills</h3>
            {tempPhoto && <img src={tempPhoto} style={styles.previewImg} alt="Preview" />}
            <label style={{fontSize: '0.8rem', color: '#94a3b8'}}>Upload Profile Photo:</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{...styles.input, padding: '8px'}} />
            <input name="name" placeholder="Your Full Name" required style={styles.input} />
            <input name="skill" placeholder="Your Profession (e.g. Carpenter)" required style={styles.input} />
            <input name="exp" placeholder="Years of Experience" required style={styles.input} />
            <select name="region" style={styles.input} required>
                <option value="">Your Region</option><option>Central</option><option>Western</option><option>Northern</option><option>Eastern</option>
            </select>
            <textarea name="bio" placeholder="Tell employers why they should hire you..." required style={{...styles.input, minHeight: '80px'}} />
            <input name="phone" placeholder="Phone Number (10 digits)" required style={styles.input} />
            <button type="submit" style={{...styles.submitBtn, background: '#f59e0b'}}>List My Profile</button>
          </form>
        )}
      </main>
    </div>
  );
}
