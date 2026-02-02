import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  isLoading = false,
  className = '',
  icon = null,
  ...props
}) => {
  const styles = {
    btn: {
      padding: size === 'small' ? '0.5rem 1rem' : size === 'large' ? '1rem 2rem' : '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      position: 'relative',
      overflow: 'hidden',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.6 : 1
    },
    primary: {
      background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)'
    },
    secondary: {
      background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
      color: 'white'
    },
    outline: {
      background: 'transparent',
      border: '2px solid #3498db',
      color: '#3498db'
    },
    warning: {
      background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
      color: 'white'
    },
    danger: {
      background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
      color: 'white'
    }
  };

  const getVariantStyle = () => {
    switch(variant) {
      case 'primary': return styles.primary;
      case 'secondary': return styles.secondary;
      case 'outline': return styles.outline;
      case 'warning': return styles.warning;
      case 'danger': return styles.danger;
      default: return styles.primary;
    }
  };

  const buttonStyle = {
    ...styles.btn,
    ...getVariantStyle(),
    ...(!disabled && {
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: variant === 'primary' ? '0 6px 16px rgba(52, 152, 219, 0.4)' : '0 6px 16px rgba(0, 0, 0, 0.1)'
      }
    })
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={buttonStyle}
      {...props}
    >
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Cargando...
        </div>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

// Agrega este estilo al index.css
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);