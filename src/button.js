import React from 'react';

function Button({ label, onClick, className }) {
  return (
    <button onClick={onClick} className={`py-2 px-4 rounded-lg ${className}`}>
      {label}
    </button>
  );
}

export default Button;
