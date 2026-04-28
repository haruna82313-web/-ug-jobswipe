import React from 'react';
import { UG_REGIONS } from '../utils/regions';

const styles = {
  form: { boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', background: '#0f172a', padding: '24px', borderRadius: '24px', border: '1px solid #1e293b' },
  input: { boxSizing: 'border-box', width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', fontSize: '1rem' },
  submitBtn: { padding: '18px', borderRadius: '14px', background: '#10b981', color: 'white', border: 'none', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer' },
};

const PostJobForm = ({ addJob, loading }) => {
  return (
    <form onSubmit={addJob} style={styles.form}>
      <h3 style={{ color: '#10b981', margin: '0 0 10px 0' }}>Hire Someone</h3>
      <input name="title" placeholder="Job Title" required style={styles.input} />
      <input name="pay" placeholder="Pay (e.g. 200,000/=)" required style={styles.input} />
      <select name="category" style={styles.input} required>
        <option value="">Category</option>
        <option>Retail</option>
        <option>Agriculture</option>
        <option>Transport</option>
        <option>Construction</option>
        <option>Repair</option>
        <option>Delivery</option>
        <option>House Keeping</option>
        <option>Food & Beverages</option>
        <option>Health</option>
        <option>Media</option>
        <option>Beauty</option>
        <option>Unique</option>
        <option>Research & Education</option>
        <option>Logistics</option>
      </select>
      <select name="region" style={styles.input} required defaultValue="">
        <option value="" disabled>Select Region</option>
        {UG_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <textarea name="description" placeholder="Requirements..." required style={{ ...styles.input, minHeight: '80px' }} />
      <input name="phone" type="text" maxLength="10" placeholder="Phone Number (10 digits)" pattern="\d{10}" required style={styles.input} title="Phone must be exactly 10 digits" />
      <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }}>
        {loading ? "Posting..." : "Post Job Now"}
      </button>
    </form>
  );
};

export default PostJobForm;
