import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import LoginModal from '../Modal/LoginModal';
import RegisterModal from '../Modal/RegisterModal'; // Importamos RegisterModal

const Header = ({ onAddBook, onSearch, onCategoryChange }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // Estado para el modal de registro
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (onCategoryChange) onCategoryChange(category);
  };

  const categories = ['Todos', 'Ficción', 'No Ficción', 'Ciencia', 'Historia', 'Biografías', 'Romance', 'Misterio'];

  const styles = {
    header: {
      background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
      color: 'white',
      padding: '1rem 0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    headerContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1.5rem'
    },
    logoSection: { flex: 1 },
    logo: { fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'white' },
    tagline: { fontSize: '0.9rem', opacity: 0.9, margin: '0.25rem 0 0' },
    searchSection: { flex: 2, minWidth: '300px' },
    searchForm: { display: 'flex', gap: '0.5rem' },
    searchInput: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.95rem',
      background: 'rgba(255, 255, 255, 0.9)',
      transition: 'all 0.3s ease'
    },
    authSection: { flex: 1, display: 'flex', justifyContent: 'flex-end' },
    userMenu: { display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' },
    welcome: { fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' },
    userActions: { display: 'flex', gap: '0.5rem' },
    categoriesNav: {
      maxWidth: '1400px',
      margin: '1rem auto 0',
      padding: '0 2rem',
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem'
    },
    categoryBtn: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
      minWidth: '80px',
      textAlign: 'center'
    },
    activeCategory: {
      background: '#ff9800',
      fontWeight: 600,
      boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
    }
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.logoSection}>
            <h1 style={styles.logo}>📚 Biblioteca Digital</h1>
            <p style={styles.tagline}>Tu portal a miles de libros</p>
          </div>

          <div style={styles.searchSection}>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Buscar libros por título, autor o género..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <Button type="submit" variant="secondary" size="small" icon="🔍">
                Buscar
              </Button>
            </form>
          </div>

          <div style={styles.authSection}>
            {isAuthenticated ? (
              <div style={styles.userMenu}>
                <span style={styles.welcome}>👋 Hola, {user?.username || 'Usuario'}</span>
                <div style={styles.userActions}>
                  <Button variant="outline" onClick={onAddBook} size="small" icon="📖">
                    Agregar Libro
                  </Button>
                  <Button variant="outline" onClick={logout} size="small" icon="🚪">
                    Salir
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="primary" onClick={() => setIsLoginModalOpen(true)} icon="🔑">
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>

        <nav style={styles.categoriesNav}>
          {categories.map((category) => (
            <button
              key={category}
              style={{
                ...styles.categoryBtn,
                ...(activeCategory === category ? styles.activeCategory : {})
              }}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </nav>
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          // Agregamos un pequeño delay para mejor experiencia de usuario
          setTimeout(() => setIsRegisterModalOpen(true), 150);
        }}
      />

      <RegisterModal 
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          // Agregamos un pequeño delay para mejor experiencia de usuario
          setTimeout(() => setIsLoginModalOpen(true), 150);
        }}
      />
    </>
  );
};

export default Header;