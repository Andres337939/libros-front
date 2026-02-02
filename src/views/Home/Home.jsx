import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { booksAPI } from '../../services/api';
import Header from '../../components/Header/Header';
import BookCard from '../../components/BookCard/BookCard';
import BookModal from '../../components/Modal/BookModal';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';

// Imágenes por defecto para cada género
const DEFAULT_IMAGES = {
  'Ficción': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Ciencia': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Historia': 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Biografías': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Romance': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Misterio': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Distopía': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'General': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Aventura': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Terror': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Fantasía': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Ciencia Ficción': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
};

// Función para obtener imagen por defecto
const getBookImage = (book) => {
  if (book.image) return book.image;
  
  const genre = book.genre || 'General';
  return DEFAULT_IMAGES[genre] || 
    `https://via.placeholder.com/300x400/4a6572/ffffff?text=${encodeURIComponent(book.title.substring(0, 20))}`;
};

// Función para mapear datos de la API
const mapApiBookToApp = (apiBook) => ({
  id: apiBook._id,
  title: apiBook.title || 'Sin título',
  author: apiBook.author || 'Autor desconocido',
  description: apiBook.description || 
    `Libro "${apiBook.title}" escrito por ${apiBook.author} en el año ${apiBook.year || 'desconocido'}.`,
  genre: apiBook.genre || 'General',
  year: apiBook.year || new Date().getFullYear(),
  pages: apiBook.pages || 0,
  rating: 4.0,
  image: getBookImage(apiBook),
  isAvailable: apiBook.status === 'disponible',
  status: apiBook.status || 'desconocido',
  createdAt: apiBook.createdAt,
  updatedAt: apiBook.updatedAt,
  id_usuario: apiBook.id_usuario || null,
});

const Home = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [allBooks, setAllBooks] = useState([]); // Todos los libros
  const [displayedBooks, setDisplayedBooks] = useState([]); // Libros a mostrar en la página actual
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 10 // Limitar a 10 libros por página
  });

  // Cargar libros desde la API
  const fetchBooks = async (page = 1, searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: 10, // Cambiado a 10
        ...(searchQuery && { author: searchQuery })
      };

      const response = await booksAPI.getBooks(params);
      
      console.log('Datos crudos de la API:', response.data[0]);
      // Mapear datos de la API
      const mappedBooks = response.data.map(mapApiBookToApp);
      
      setAllBooks(mappedBooks);
      setDisplayedBooks(mappedBooks);
      setPagination({
        page: response.page,
        total: response.total,
        pages: response.pages,
        limit: 10
      });
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message || 'Error al cargar los libros. Intenta nuevamente.');
      
      // Datos de respaldo
      const fallbackBooks = [
        {
          id: '1',
          title: 'Cien años de soledad',
          author: 'Gabriel García Márquez',
          description: 'Novela que narra la historia de la familia Buendía en el pueblo ficticio de Macondo.',
          genre: 'Ficción',
          year: 1967,
          pages: 417,
          rating: 4.8,
          image: getBookImage({ genre: 'Ficción', title: 'Cien años de soledad' }),
          isAvailable: true,
          status: 'disponible'
        }
      ];
      
      setAllBooks(fallbackBooks);
      setDisplayedBooks(fallbackBooks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setDisplayedBooks(allBooks);
      return;
    }
    
    const filtered = allBooks.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.genre.toLowerCase().includes(query.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    setDisplayedBooks(filtered);
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsBookModalOpen(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('¿Estás seguro de eliminar este libro?')) return;

    try {
      if (token) {
        await booksAPI.deleteBook(bookId, token);
        alert('✅ Libro eliminado correctamente');
      } else {
        alert('⚠️ Necesitas iniciar sesión para eliminar libros');
      }
      
      // Actualizar estado local
      setAllBooks(prev => prev.filter(book => book.id !== bookId));
      setDisplayedBooks(prev => prev.filter(book => book.id !== bookId));
      
    } catch (error) {
      console.error('Error deleting book:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleReserveBook = async (book) => {
    if (!isAuthenticated) {
      alert('🔒 Por favor, inicia sesión para reservar libros');
      return;
    }

    if (!book.isAvailable) {
      alert('❌ Este libro no está disponible para reserva');
      return;
    }

    if (!window.confirm(`¿Estás seguro de reservar el libro "${book.title}"?`)) {
      return;
    }

    try {
      const updatedBook = { 
        ...book, 
        isAvailable: false, 
        status: 'reservado',
        reservedBy: user.id
      };
      
      setAllBooks(prev => prev.map(b => 
        b.id === book.id ? updatedBook : b
      ));
      setDisplayedBooks(prev => prev.map(b => 
        b.id === book.id ? updatedBook : b
      ));

      if (token) {
              await booksAPI.reserveBook(book.id, token, user.id);
      }

      alert(`✅ Libro "${book.title}" reservado con éxito!`);
      
      // Recargar página actual después de la reserva
      setTimeout(() => {
        fetchBooks(pagination.page);
      }, 1000);
      
    } catch (error) {
      console.error('Error reserving book:', error);
      
      setAllBooks(prev => prev.map(b => 
        b.id === book.id ? book : b
      ));
      setDisplayedBooks(prev => prev.map(b => 
        b.id === book.id ? book : b
      ));
      
      alert(`❌ Error: ${error.message || 'No se pudo reservar el libro'}`);
    }
  };

  const handleReturnBook = async (book) => {
    if (!isAuthenticated) {
      alert('🔒 Por favor, inicia sesión para devolver libros');
      return;
    }

    if (book.isAvailable) {
      alert('ℹ️ Este libro ya está disponible');
      return;
    }

    if (!window.confirm(`¿Estás seguro de devolver el libro "${book.title}"?`)) {
      return;
    }

    try {
      // Actualizar estado local
      const returnedBook = { 
        ...book, 
        isAvailable: true, 
        status: 'disponible' 
      };
      
      setAllBooks(prev => prev.map(b => 
        b.id === book.id ? returnedBook : b
      ));
      setDisplayedBooks(prev => prev.map(b => 
        b.id === book.id ? returnedBook : b
      ));

      // Llamar a la API
      if (token) {
        await booksAPI.returnBook(book.id, token);
      }

      alert(`✅ Libro "${book.title}" devuelto con éxito!`);
      
    } catch (error) {
      console.error('Error returning book:', error);

      setAllBooks(prev => prev.map(b => 
        b.id === book.id ? book : b
      ));
      setDisplayedBooks(prev => prev.map(b => 
        b.id === book.id ? book : b
      ));
      
      alert(`❌ Error: ${error.message || 'No se pudo devolver el libro'}`);
    }
  };

  const handleBookSubmit = async (bookData) => {
    try {
      if (selectedBook) {
        // Editar libro existente
        if (token) {
          const apiBookData = {
            title: bookData.title,
            author: bookData.author,
            year: bookData.year,
            pages: bookData.pages,
            genre: bookData.genre,
            image: bookData.image || null,
            description: bookData.description || '',
            status: bookData.isAvailable ? 'disponible' : 'prestado'
          };

          const updatedBook = await booksAPI.updateBook(selectedBook.id, apiBookData, token);
          const mappedBook = mapApiBookToApp(updatedBook);
          
          setAllBooks(prev => prev.map(book => 
            book.id === selectedBook.id ? mappedBook : book
          ));
          setDisplayedBooks(prev => prev.map(book => 
            book.id === selectedBook.id ? mappedBook : book
          ));
        } else {
          // Modo local sin API
          const updatedBook = { ...bookData, id: selectedBook.id };
          setAllBooks(prev => prev.map(book => 
            book.id === selectedBook.id ? updatedBook : book
          ));
          setDisplayedBooks(prev => prev.map(book => 
            book.id === selectedBook.id ? updatedBook : book
          ));
        }
        
        alert('✅ Libro actualizado correctamente');
      } else {
        // Agregar nuevo libro
        if (token) {
          const apiBookData = {
            title: bookData.title,
            author: bookData.author,
            year: bookData.year,
            pages: bookData.pages,
            genre: bookData.genre,
            image: bookData.image || null,
            description: bookData.description || '',
            status: 'disponible'
          };

          const newBook = await booksAPI.createBook(apiBookData, token);
          const mappedBook = mapApiBookToApp(newBook);
          
          setAllBooks(prev => [...prev, mappedBook]);
          setDisplayedBooks(prev => [...prev, mappedBook]);
        } else {
          // Modo local sin API
          const newBook = { 
            ...bookData, 
            id: Date.now().toString(),
            status: 'disponible'
          };
          
          setAllBooks(prev => [...prev, newBook]);
          setDisplayedBooks(prev => [...prev, newBook]);
        }
        
        alert('✅ Libro agregado correctamente');
      }
      
      setIsBookModalOpen(false);
    } catch (error) {
      console.error('Error saving book:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'Todos') {
      setDisplayedBooks(allBooks);
    } else {
      const filtered = allBooks.filter(book => 
        book.genre.toLowerCase() === category.toLowerCase()
      );
      setDisplayedBooks(filtered);
    }
  };

  const handleRetry = () => {
    fetchBooks();
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchBooks(pagination.page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      fetchBooks(pagination.page - 1);
    }
  };

  const styles = {
    home: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    mainContent: { flex: 1, padding: '2rem 0', background: '#f8f9fa' },
    container: { maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' },
    booksHeader: {
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '1rem',
      padding: '1.5rem',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    categoryInfo: {
      margin: '0.5rem 0 0',
      color: '#7f8c8d',
      fontSize: '0.95rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    categoryBadge: {
      background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontWeight: 600,
      fontSize: '0.85rem'
    },
    booksCount: {
      margin: 0,
      color: '#7f8c8d',
      fontSize: '0.95rem',
      background: '#f8f9fa',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      margin: '2rem 0'
    },
    emptyIcon: { fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.7 },
    errorState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      margin: '2rem 0',
      border: '2px solid #ff6b6b'
    },
    errorIcon: { fontSize: '4rem', marginBottom: '1.5rem', color: '#ff6b6b' },
    booksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
      margin: '2rem 0 3rem'
    },
    statsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.5rem',
      marginTop: '3rem'
    },
    statCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      transition: 'all 0.3s ease',
      borderTop: '4px solid #3498db'
    },
    statIcon: {
      fontSize: '2.5rem',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      color: 'white'
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '2rem',
      padding: '1rem',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    paginationInfo: {
      fontSize: '0.95rem',
      color: '#7f8c8d',
      fontWeight: 500
    },
    paginationButtons: {
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center'
    },
    footer: {
      background: '#2c3e50',
      color: 'white',
      padding: '2rem 0',
      textAlign: 'center',
      marginTop: '3rem'
    }
  };

  if (loading && allBooks.length === 0) {
    return <Loader message="Cargando biblioteca desde la API..." />;
  }

  return (
    <div style={styles.home}>
      <Header 
        onAddBook={handleAddBook}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />

      <main style={styles.mainContent}>
        <div style={styles.container}>
          <div style={styles.booksHeader}>
            <div>
              <h2>📚 Biblioteca Digital</h2>
              <p style={styles.categoryInfo}>
                Categoría: <span style={styles.categoryBadge}>{activeCategory}</span>
                {pagination.total > 0 && (
                  <span style={{ marginLeft: '1rem', fontSize: '0.85rem' }}>
                    Página {pagination.page} de {pagination.pages}
                  </span>
                )}
              </p>
            </div>
            <p style={styles.booksCount}>
              Mostrando {displayedBooks.length} libros (Total: {pagination.total})
            </p>
          </div>

          {error ? (
            <div style={styles.errorState}>
              <div style={styles.errorIcon}>⚠️</div>
              <h3>Error al cargar los libros</h3>
              <p>{error}</p>
              <Button 
                variant="primary" 
                onClick={handleRetry}
                style={{ marginTop: '1rem' }}
              >
                🔄 Reintentar
              </Button>
            </div>
          ) : displayedBooks.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <h3>No se encontraron libros</h3>
              <p>Intenta con otra categoría o agrega un nuevo libro.</p>
              {isAuthenticated && (
                <Button 
                  variant="primary" 
                  onClick={handleAddBook}
                  style={{ marginTop: '1rem' }}
                >
                  📖 Agregar Primer Libro
                </Button>
              )}
            </div>
          ) : (
            <>
              <div style={styles.booksGrid}>
                {displayedBooks.map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onEdit={handleEditBook}
                    onDelete={handleDeleteBook}
                    onReserve={handleReserveBook}
                    onReturn={handleReturnBook}
                  />
                ))}
              </div>

              {/* Paginación mejorada */}
              {pagination.pages > 1 && (
                <div style={styles.paginationContainer}>
                  <div style={styles.paginationInfo}>
                    Página {pagination.page} de {pagination.pages} • 
                    Mostrando {displayedBooks.length} de {pagination.total} libros
                  </div>
                  <div style={styles.paginationButtons}>
                    <Button 
                      variant="outline" 
                      onClick={handlePreviousPage}
                      disabled={pagination.page === 1 || loading}
                      icon="⬅️"
                    >
                      Anterior
                    </Button>
                    <span style={{ 
                      padding: '0.5rem 1rem', 
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      color: '#3498db'
                    }}>
                      {pagination.page}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={handleLoadMore}
                      disabled={pagination.page >= pagination.pages || loading}
                      icon="➡️"
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          <div style={styles.statsSection}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📖</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#2c3e50' }}>
                  {pagination.total}
                </h3>
                <p style={{ margin: '0.25rem 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                  Libros Totales
                </p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>✅</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#2c3e50' }}>
                  {allBooks.filter(b => b.isAvailable).length}
                </h3>
                <p style={{ margin: '0.25rem 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                  Disponibles
                </p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>⭐</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#2c3e50' }}>
                  {(allBooks.reduce((acc, book) => acc + book.rating, 0) / allBooks.length || 0).toFixed(1)}
                </h3>
                <p style={{ margin: '0.25rem 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                  Rating Promedio
                </p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>👤</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#2c3e50' }}>
                  {isAuthenticated ? user?.username : 'Invitado'}
                </h3>
                <p style={{ margin: '0.25rem 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                  {isAuthenticated ? 'Conectado' : 'No autenticado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSubmit={handleBookSubmit}
        book={selectedBook}
      />

      <footer style={styles.footer}>
        <div style={styles.container}>
          <p>© 2024 Biblioteca Digital. Conectado a API real</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
            Endpoints: GET/POST/PUT/DELETE /api/books • 10 libros por página
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;