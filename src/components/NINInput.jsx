import React, { useRef, useState } from 'react';

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' },
  boxContainer: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '6px', 
    justifyContent: 'center', 
    width: '100%',
    padding: '5px 0'
  },
  box: {
    width: '20px',
    height: '32px',
    textAlign: 'center',
    backgroundColor: '#020617',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#1e293b',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: '700',
    outline: 'none',
    textTransform: 'uppercase',
  },
  boxActive: { borderColor: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.3)' },
  boxError: { borderColor: '#de0707', boxShadow: '0 0 8px rgba(222, 7, 7, 0.3)' },
  label: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' },
  errorMsg: { fontSize: '0.7rem', color: '#de0707', fontWeight: '700', marginTop: '2px' }
};

const NINInput = ({ onComplete, required }) => {
  const [nin, setNin] = useState(new Array(14).fill(''));
  const [error, setError] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputsRef = useRef([]);

  const validateNIN = (value) => {
    const fullNIN = value.join('').toUpperCase();
    if (fullNIN.length < 14) return false;

    // Ugandan NIN Smart Validation Logic
    // 1. Must start with C
    if (fullNIN[0] !== 'C') return 'NIN must start with "C" (Citizen)';
    
    // 2. Second char must be M or F
    if (fullNIN[1] !== 'M' && fullNIN[1] !== 'F') return 'Second character must be M or F';
    
    // 3. Check for obvious fakes (repetitive chars)
    const uniqueChars = new Set(fullNIN).size;
    if (uniqueChars < 4) return 'NIN looks suspicious/fake';

    // 4. Basic pattern check
    const pattern = /^[CF][MF][0-9A-Z]{12}$/;
    if (!pattern.test(fullNIN)) return 'Invalid NIN format';

    return '';
  };

  const handleChange = (e, index) => {
    const val = e.target.value.toUpperCase();
    if (val.length > 1) return;

    const newNin = [...nin];
    newNin[index] = val;
    setNin(newNin);

    // Auto-focus next
    if (val && index < 13) {
      inputsRef.current[index + 1].focus();
    }

    // Check completion and validation
    if (newNin.every(char => char !== '')) {
      const validationError = validateNIN(newNin);
      setError(validationError);
      if (!validationError) {
        onComplete(newNin.join('').toUpperCase());
      }
    } else {
      setError('');
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !nin[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').toUpperCase().slice(0, 14).split('');
    const newNin = [...nin];
    pasteData.forEach((char, i) => {
      if (i < 14) newNin[i] = char;
    });
    setNin(newNin);
    
    const nextIndex = Math.min(pasteData.length, 13);
    inputsRef.current[nextIndex].focus();

    if (newNin.every(char => char !== '')) {
      const validationError = validateNIN(newNin);
      setError(validationError);
      if (!validationError) {
        onComplete(newNin.join('').toUpperCase());
      }
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        🛡️ National ID (NIN) <span style={{ color: '#de0707' }}>*</span>
      </label>
      <div style={styles.boxContainer} onPaste={handlePaste}>
        {nin.map((char, index) => (
          <input
            key={index}
            ref={el => inputsRef.current[index] = el}
            type="text"
            maxLength="1"
            value={char}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            style={{
              ...styles.box,
              ...(focusedIndex === index ? styles.boxActive : {}),
              ...(error ? styles.boxError : {})
            }}
            required={required}
          />
        ))}
      </div>
      {error && <div style={styles.errorMsg}>{error}</div>}
      <input type="hidden" name="nin" value={nin.join('')} />
    </div>
  );
};

export default NINInput;
