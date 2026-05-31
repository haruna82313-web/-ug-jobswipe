import React, { useState } from 'react';
import { UG_REGIONS } from '../utils/regions';
import NINInput from './NINInput';

const styles = {
  form: { boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', background: '#0f172a', padding: '24px', borderRadius: '24px', border: '1px solid #1e293b' },
  input: { boxSizing: 'border-box', width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', fontSize: '1rem' },
  submitBtn: { padding: '18px', borderRadius: '14px', background: '#10b981', color: 'white', border: 'none', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s ease' },
  label: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' },
  photoBtn: { background: '#1e293b', border: '2px dashed #334155', padding: '20px', borderRadius: '12px', color: '#94a3b8', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }
};

const PostJobForm = ({ addJob, loading }) => {
  const [ninValue, setNinValue] = useState('');
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(file);
  };

  return (
    <form onSubmit={addJob} style={styles.form}>
      <h3 style={{ color: '#10b981', margin: '0 0 5px 0' }}>Hire Someone 🇺🇬</h3>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>Secure posting: NIN and Photo required.</p>
      
      <input name="title" placeholder="Job Title (e.g. Need a Plumber)" required style={styles.input} />
      
      <select name="category" style={styles.input} required>
        <option value="">Select Work Category</option>
        <option>Domestic/Home</option>
        <option>Construction</option>
        <option>Agriculture</option>
        <option>Transport/Boda</option>
        <option>Repair & Maintenance</option>
        <option>Media & Design</option>
        <option>Delivery</option>
        <option>Health & Care</option>
        <option>Research & Education</option>
        <option>Security</option>
        <option>Logistics</option>
      </select>

      <select name="region" style={styles.input} required defaultValue="">
        <option value="" disabled>Select Region</option>
        {UG_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      <input name="landmark" placeholder="Near Landmark (e.g. Shell)" required style={styles.input} />

      <input name="pay" type="number" placeholder="Estimated Pay (UGX)" required style={styles.input} />
      
      <textarea name="description" placeholder="What exactly do you need done? (Requirements...)" required style={{ ...styles.input, minHeight: '150px' }} />
      
      <NINInput onComplete={setNinValue} required={true} />
      
      <div style={styles.container}>
        <label style={styles.label}>📸 Profile Photo <span style={{ color: '#de0707' }}>*</span></label>
        <label style={{ ...styles.photoBtn, borderColor: photo ? '#10b981' : '#334155' }}>
          <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} required />
          <span style={{ fontSize: '1.5rem' }}>{photo ? '✅' : '📷'}</span>
          <span style={{ fontSize: '0.8rem' }}>{photo ? 'Photo selected' : 'Upload your clear photo'}</span>
        </label>
      </div>

      <input name="phone" type="text" maxLength="10" placeholder="WhatsApp/Call Number" pattern="\d{10}" required style={styles.input} />
      
      <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }}>
        {loading ? "Verifying & Posting..." : "Post Verified Job"}
      </button>
    </form>
  );
};

export default PostJobForm;
