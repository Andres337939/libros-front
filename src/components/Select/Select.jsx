import React from 'react';
import './Select.css';

const Select = ({ label, value, onChange, options, error, name, required }) => {
  return (
    <div className="select-field">
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        className={`select ${error ? 'select-error' : ''}`}
        value={value}
        onChange={onChange}
        name={name}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Select;