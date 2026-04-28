import React from 'react';
import { UG_REGIONS } from '../utils/regions';

const styles = {
  container: { width: '100%', marginBottom: '15px' },
  dropdown: { boxSizing: 'border-box', width: '100%', padding: '14px', background: '#0f172a', color: 'white', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '10px', fontSize: '0.9rem' },
  searchBar: { boxSizing: 'border-box', width: '100%', padding: '14px', background: '#0f172a', color: 'white', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '10px', outline: 'none', fontSize: '0.9rem' },
  detectBtn: { background: '#1e293b', color: '#10b981', border: '1px solid #334155', padding: '8px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', width: 'fit-content' },
};

const Filters = ({ regionFilter, setRegionFilter, searchTerm, setSearchTerm, placeholder }) => {
  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      // For a real app, you'd use a reverse geocoding API here
      // For now, we'll just show we're detecting
      alert("Location detected! (In a real app, we'd set your region here)");
    });
  };

  return (
    <div style={styles.container}>
      <select 
        style={styles.dropdown} 
        value={regionFilter} 
        onChange={(e) => setRegionFilter(e.target.value)}
      >
        <option value="All">All Regions</option>
        {UG_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button onClick={detectLocation} style={styles.detectBtn}>📍 Detect My Location</button>
      </div>
      <input 
        style={styles.searchBar} 
        placeholder={placeholder} 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
    </div>
  );
};

export default Filters;
