import React, { useState, useEffect } from 'react';
import { quotes } from '../utils/quotes';

const QuoteDisplay = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 13000); // 13 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      padding: '10px 20px',
      margin: '10px 0',
      textAlign: 'center',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(16, 185, 129, 0.05)',
      borderRadius: '12px',
      border: '1px dashed rgba(16, 185, 129, 0.2)',
      transition: 'all 0.5s ease-in-out'
    }}>
      <p style={{
        margin: 0,
        fontSize: '0.9rem',
        color: '#10b981',
        fontWeight: '500',
        fontStyle: 'italic',
        lineHeight: '1.4'
      }}>
        " {quotes[index]} "
      </p>
    </div>
  );
};

export default QuoteDisplay;
