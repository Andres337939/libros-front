import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';

const BookCard = ({ book, onEdit, onDelete, onReserve, onReturn }) => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  // Verificar si el usuario actual es quien reservó el libro
  const isBookReservedByCurrentUser = book.id_usuario === user?.id;

  const styles = {
    bookCard: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    bookImageContainer: {
      position: 'relative',
      height: '250px',
      overflow: 'hidden'
    },
    bookImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease'
    },
    bookBadges: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    badge: {
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.7rem',
      fontWeight: 600,
      color: 'white',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    bookContent: {
      padding: '1.5rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    bookTitle: {
      margin: '0 0 0.5rem',
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#2c3e50',
      lineHeight: 1.3
    },
    bookAuthor: {
      margin: '0 0 1rem',
      color: '#7f8c8d',
      fontSize: '0.9rem'
    },
    bookMeta: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.85rem',
      color: '#636e72'
    },
    bookDescription: {
      flex: 1,
      margin: '0 0 1.5rem',
      color: '#2c3e50',
      fontSize: '0.9rem',
      lineHeight: 1.5
    },
    bookActions: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    adminActions: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 600,
      marginBottom: '0.5rem'
    }
  };

  const genreColors = {
    'Ficción': '#ff6b6b',
    'Ciencia': '#4ecdc4',
    'Historia': '#45b7d1',
    'Biografías': '#96ceb4',
    'Romance': '#feca57',
    'Misterio': '#5f27cd',
    'No Ficción': '#ff9ff3',
    'General': '#3498db',
    'Distopía': '#9b59b6',
    'Aventura': '#1abc9c',
    'Terror': '#34495e',
    'Fantasía': '#e74c3c',
    'Ciencia Ficción': '#f39c12'
  };

  // Determinar color del badge de estado
  const getStatusColor = () => {
    if (book.status === 'prestado') return { background: '#ffeaa7', color: '#d35400' };
    if (book.status === 'reservado') return { background: '#a29bfe', color: '#2d3436' };
    if (book.status === 'disponible') return { background: '#55efc4', color: '#00b894' };
    return { background: '#dfe6e9', color: '#636e72' };
  };

  // Texto del estado
  const getStatusText = () => {
    if (book.status === 'prestado') return '📖 Prestado';
    if (book.status === 'reservado') return '⏳ Reservado';
    if (book.status === 'disponible') return '✅ Disponible';
    return '❓ Estado desconocido';
  };

  return (
    <div 
      style={styles.bookCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      <div style={styles.bookImageContainer}>
        <img 
          src={book.image || 'https://via.placeholder.com/200x300/4a6572/ffffff?text=Libro'} 
          alt={book.title}
          style={styles.bookImage}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x300/4a6572/ffffff?text=Libro';
          }}
        />
        <div style={styles.bookBadges}>
          <span style={{
            ...styles.badge,
            backgroundColor: genreColors[book.genre] || '#3498db'
          }}>
            {book.genre}
          </span>
          <span style={{
            ...styles.badge,
            backgroundColor: getStatusColor().background,
            color: getStatusColor().color
          }}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div style={styles.bookContent}>
        <h3 style={styles.bookTitle}>{book.title}</h3>
        <p style={styles.bookAuthor}>✍️ {book.author}</p>
        
        <div style={styles.bookMeta}>
          <span style={styles.metaItem}>📅 {book.year}</span>
          {book.pages > 0 && <span style={styles.metaItem}>📖 {book.pages} págs</span>}
          <span style={styles.metaItem}>⭐ {book.rating || 'N/A'}/5</span>
        </div>

        <p style={styles.bookDescription}>
          {book.description && book.description.length > 120 
            ? `${book.description.substring(0, 120)}...` 
            : book.description || 'Sin descripción disponible'}
        </p>

        <div style={styles.bookActions}>
          {/* Estado: Disponible - Cualquier usuario autenticado puede reservar */}
          {isAuthenticated && book.status === 'disponible' && (
            <Button 
              variant="primary" 
              size="small"
              onClick={() => onReserve(book)}
              fullWidth
            >
              📌 Reservar este libro
            </Button>
          )}

          {/* Estado: Prestado - Solo mostrar si el libro está prestado */}
          {isAuthenticated && book.status === 'prestado' && (
            <Button 
              variant="secondary" 
              size="small"
              disabled
              fullWidth
            >
              📖 Actualmente prestado
            </Button>
          )}

          {/* Estado: Reservado - SOLO el usuario que lo reservó o admin pueden devolver */}
          {isAuthenticated && book.status === 'reservado' && (
            <>
              <Button 
                variant="warning" 
                size="small"
                disabled
                fullWidth
              >
                ⏳ Libro reservado
              </Button>
              
              {/* Botón de devolver: solo visible para el usuario que reservó o admin */}
              {(isBookReservedByCurrentUser || isAdmin) && (
                <Button 
                  variant="success" 
                  size="small"
                  onClick={() => onReturn(book)}
                  fullWidth
                >
                  ↩️ Devolver libro
                </Button>
              )}
            </>
          )}

          {/* Estado: Desconocido */}
          {isAuthenticated && !book.status && (
            <Button 
              variant="outline" 
              size="small"
              disabled
              fullWidth
            >
              ❓ Estado no disponible
            </Button>
          )}

          {/* Usuario no autenticado */}
          {!isAuthenticated && (
            <Button 
              variant="outline" 
              size="small"
              onClick={() => alert('Inicia sesión para interactuar con los libros')}
              fullWidth
            >
              🔒 Inicia sesión para reservar
            </Button>
          )}

          {/* Acciones de administrador */}
          {isAdmin && (
            <div style={styles.adminActions}>
              <Button 
                variant="warning" 
                size="small"
                onClick={() => onEdit(book)}
                fullWidth
              >
                ✏️ Editar libro
              </Button>
              <Button 
                variant="danger" 
                size="small"
                onClick={() => onDelete(book.id)}
                fullWidth
              >
                🗑️ Eliminar libro
              </Button>
            </div>
          )}

          {/* Información adicional del estado */}
          {book.status === 'reservado' && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: '#f8f9fa',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#7f8c8d',
              textAlign: 'center'
            }}>
              {book.reservedByUsername ? 
                `Reservado por: ${book.reservedByUsername}` : 
                book.id_usuario === user?.id ?
                'Reservado por ti' :
                'Reservado por otro usuario'
              }
              {book.reservedAt && (
                <div style={{ marginTop: '0.25rem' }}>
                  Fecha: {new Date(book.reservedAt).toLocaleDateString()}
                </div>
              )}
              
              {/* Mostrar mensaje si no puedes devolverlo */}
              {book.status === 'reservado' && !isBookReservedByCurrentUser && !isAdmin && (
                <div style={{ 
                  marginTop: '0.25rem', 
                  color: '#e74c3c',
                  fontWeight: 'bold'
                }}>
                  ⚠️ Solo puede ser devuelto por quien lo reservó
                </div>
              )}
            </div>
          )}

          {/* Mostrar mensaje si el libro está prestado */}
          {book.status === 'prestado' && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: '#f8f9fa',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#7f8c8d',
              textAlign: 'center'
            }}>
              Este libro está prestado y no está disponible para reserva
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;