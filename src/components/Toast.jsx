import React from 'react';

const toastStyle = {
  position: 'fixed',
  bottom: '30px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '16px 32px',
  borderRadius: '16px',
  color: 'white',
  fontWeight: '700',
  zIndex: 9999,
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  width: 'max-content'
};

const Toast = ({ message, color, visible }) => {
  if (!visible) return null;
  
  return (
    <div style={{ ...toastStyle, backgroundColor: color }}>
      {message}
    </div>
  );
};

export default Toast;
