import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from '../Button/Button';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

    // Agregar estilos de animación
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  if (!isOpen) return null;

  const sizeStyles = {
    small: { width: '400px', maxWidth: '95vw' },
    medium: { width: '600px', maxWidth: '95vw' },
    large: { width: '800px', maxWidth: '95vw' }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)',
      animation: 'fadeIn 0.3s ease'
    },
    container: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      animation: 'slideUp 0.4s ease',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      ...sizeStyles[size]
    },
    header: {
      padding: '1.5rem 1.5rem 1rem',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      margin: 0,
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#2c3e50'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      color: '#95a5a6',
      cursor: 'pointer',
      padding: '0.25rem',
      transition: 'color 0.3s ease'
    },
    content: {
      padding: '1.5rem',
      overflowY: 'auto',
      flex: 1
    }
  };

  return ReactDOM.createPortal(
    <div style={styles.overlay} onClick={onClose}>
      <div 
        style={styles.container} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <Button 
            variant="text" 
            onClick={onClose}
            style={styles.closeBtn}
          >
            ✕
          </Button>
        </div>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;