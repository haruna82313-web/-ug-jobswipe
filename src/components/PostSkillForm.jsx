import React, { useState } from 'react';
import { UG_REGIONS } from '../utils/regions';
import NINInput from './NINInput';

const styles = {
  form: { boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', background: '#0f172a', padding: '24px', borderRadius: '24px', border: '1px solid #1e293b' },
  input: { boxSizing: 'border-box', width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', fontSize: '1rem' },
  submitBtn: { padding: '18px', borderRadius: '14px', background: '#f59e0b', color: 'white', border: 'none', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s ease' },
  label: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' },
  photoBtn: { background: '#1e293b', border: '2px dashed #334155', padding: '20px', borderRadius: '12px', color: '#94a3b8', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }
};

const PostSkillForm = ({ addWorker, loading }) => {
  const [ninValue, setNinValue] = useState('');
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(file);
  };

  return (
    <form onSubmit={addWorker} style={styles.form}>
      <h3 style={{ color: '#f59e0b', margin: '0 0 5px 0' }}>Market Your Skills 🇺🇬</h3>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>Verified profiles get hired 5x faster.</p>

      <input name="name" placeholder="Full Name" required style={styles.input} />
      
      <input name="skill" placeholder="Profession (e.g. Mason)" required style={styles.input} />
      
      <input name="exp" type="number" placeholder="Years of Experience" required style={styles.input} />

      <select name="region" style={styles.input} required defaultValue="">
        <option value="" disabled>My Region</option>
        {UG_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      <input name="rate" type="number" placeholder="Starting Rate (UGX)" required style={styles.input} />

      <textarea name="bio" placeholder="Describe your experience and previous projects..." required style={{ ...styles.input, minHeight: '150px' }} />

      <NINInput onComplete={setNinValue} required={true} />

      <div style={styles.container}>
        <label style={styles.label}>📸 Profile Photo <span style={{ color: '#de0707' }}>*</span></label>
        <label style={{ ...styles.photoBtn, borderColor: photo ? '#f59e0b' : '#334155' }}>
          <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} required />
          <span style={{ fontSize: '1.5rem' }}>{photo ? '✅' : '📷'}</span>
          <span style={{ fontSize: '0.8rem' }}>{photo ? 'Photo selected' : 'Upload your clear face photo'}</span>
        </label>
      </div>

      <input name="phone" type="text" maxLength="10" placeholder="WhatsApp/Call Number" pattern="\d{10}" required style={styles.input} />

      <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }}>
        {loading ? "Verifying..." : "List My Verified Profile"}
      </button>
    </form>
  );
};

export default PostSkillForm;
