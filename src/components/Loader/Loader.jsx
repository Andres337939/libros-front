import React from 'react';

const Loader = ({ message = 'Cargando...' }) => {
  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(5px)'
    },
    loader: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: '400px',
      padding: '3rem',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
    },
    spinner: {
      width: '60px',
      height: '60px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1.5rem'
    },
    message: {
      margin: 0,
      color: '#2c3e50',
      fontSize: '1.1rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    dots: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    dot: {
      width: '8px',
      height: '8px',
      background: '#3498db',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out both'
    }
  };

  // Agregar estilos de animación
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.loader}>
        <div style={styles.spinner}></div>
        <p style={styles.message}>{message}</p>
        <div style={styles.dots}>
          <div style={{ ...styles.dot, animationDelay: '-0.32s' }}></div>
          <div style={{ ...styles.dot, animationDelay: '-0.16s' }}></div>
          <div style={styles.dot}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;  