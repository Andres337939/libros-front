import React from 'react';

const InputField = ({ 
  type = 'text', 
  label, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required = false,
  disabled = false,
  name
}) => {
  const styles = {
    inputField: {
      marginBottom: '1.5rem',
      width: '100%'
    },
    inputLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 600,
      color: '#2c3e50',
      fontSize: '0.9rem'
    },
    required: {
      color: '#e74c3c',
      marginLeft: '0.25rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: `2px solid ${error ? '#e74c3c' : '#e0e0e0'}`,
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: 'white',
      color: '#2c3e50'
    },
    errorMessage: {
      color: '#e74c3c',
      fontSize: '0.8rem',
      marginTop: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    }
  };

  return (
    <div style={styles.inputField}>
      {label && (
        <label style={styles.inputLabel}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          ...styles.input,
          ...(error && { borderColor: '#e74c3c' }),
          ...(!error && value && { borderColor: '#2ecc71' }),
          ':focus': {
            outline: 'none',
            borderColor: error ? '#e74c3c' : '#3498db',
            boxShadow: `0 0 0 3px ${error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'}`
          }
        }}
        name={name}
      />
      {error && (
        <span style={styles.errorMessage}>
          ⚠️ {error}
        </span>
      )}
    </div>
  );
};

export default InputField;