import React from 'react';
import './TextArea.css';

const TextArea = ({ label, value, onChange, placeholder, error, rows = 3, name }) => {
  return (
    <div className="textarea-field">
      {label && (
        <label className="textarea-label">
          {label}
        </label>
      )}
      <textarea
        className={`textarea ${error ? 'textarea-error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        name={name}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default TextArea;