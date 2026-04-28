import React from 'react';
import { UG_REGIONS } from '../utils/regions';

const styles = {
  form: { boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', background: '#0f172a', padding: '24px', borderRadius: '24px', border: '1px solid #1e293b' },
  input: { boxSizing: 'border-box', width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', fontSize: '1rem' },
  submitBtn: { padding: '18px', borderRadius: '14px', background: '#10b981', color: 'white', border: 'none', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer' },
};

const PostSkillForm = ({ addWorker, loading }) => {
  return (
    <form onSubmit={addWorker} style={styles.form}>
      <h3 style={{ color: '#f59e0b', margin: '0 0 10px 0' }}>Market Your Skills</h3>
      <input name="name" placeholder="Full Name" required style={styles.input} />
      <input name="skill" placeholder="Profession" required style={styles.input} />
      <input name="exp" placeholder="Experience" required style={styles.input} />
      <select name="region" style={styles.input} required defaultValue="">
        <option value="" disabled>Select Region</option>
        {UG_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <textarea name="bio" placeholder="Why hire you?" required style={{ ...styles.input, minHeight: '80px' }} />
      <input name="phone" type="text" maxLength="10" placeholder="Phone Number (10 digits)" pattern="\d{10}" required style={styles.input} title="Phone must be exactly 10 digits" />
      <button type="submit" disabled={loading} style={{ ...styles.submitBtn, background: '#f59e0b', opacity: loading ? 0.6 : 1 }}>
        {loading ? "Listing..." : "List My Profile"}
      </button>
    </form>
  );
};

export default PostSkillForm;
