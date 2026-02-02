import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';

const BookModal = ({ isOpen, onClose, onSubmit, book = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: 'Ficción',
    year: new Date().getFullYear(),
    pages: 300,
    rating: 4.5,
    image: ''
  });
  const [errors, setErrors] = useState({});

  const genres = ['Ficción', 'No Ficción', 'Ciencia', 'Historia', 'Biografías', 'Romance', 'Misterio'];

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({
        title: '',
        author: '',
        description: '',
        genre: 'Ficción',
        year: new Date().getFullYear(),
        pages: 300,
        rating: 4.5,
        image: ''
      });
    }
  }, [book, isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Título es requerido';
    if (!formData.author.trim()) newErrors.author = 'Autor es requerido';
    if (formData.pages < 1) newErrors.pages = 'Páginas debe ser mayor a 0';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const bookData = {
      ...formData,
      isAvailable: true,
      id: book?.id || Date.now()
    };

    onSubmit(bookData);
    onClose();
  };

  const styles = {
    bookForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '2rem'
    },
    imageSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    imagePreview: {
      width: '100%',
      height: '400px',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px dashed #dee2e6',
      background: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    detailsSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem'
    },
    formActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid #eee'
    },
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      background: 'white',
      cursor: 'pointer'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      lineHeight: 1.5,
      resize: 'vertical',
      minHeight: '100px'
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book ? 'Editar Libro' : 'Agregar Nuevo Libro'}
      size="large"
    >
      <form onSubmit={handleSubmit} style={styles.bookForm}>
        <div style={styles.formGrid}>
          <div style={styles.imageSection}>
            <div style={styles.imagePreview}>
              <img 
                src={formData.image || 'https://via.placeholder.com/300x400/4a6572/ffffff?text=Portada'} 
                alt="Vista previa"
                style={styles.previewImage}
              />
            </div>
            <InputField
              type="url"
              name="image"
              label="URL de la imagen"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.image}
              onChange={handleChange}
              error={errors.image}
            />
          </div>

          <div style={styles.detailsSection}>
            <InputField
              name="title"
              label="Título del Libro"
              placeholder="Ej: Cien años de soledad"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />

            <InputField
              name="author"
              label="Autor"
              placeholder="Ej: Gabriel García Márquez"
              value={formData.author}
              onChange={handleChange}
              error={errors.author}
              required
            />

            <div style={styles.formRow}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Género
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  style={styles.select}
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <InputField
                type="number"
                name="year"
                label="Año"
                value={formData.year}
                onChange={handleChange}
                error={errors.year}
                required
              />
              <InputField
                type="number"
                name="pages"
                label="Páginas"
                value={formData.pages}
                onChange={handleChange}
                error={errors.pages}
                required
              />
            </div>

            <InputField
              type="number"
              name="rating"
              label="Calificación (1-5)"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              step="0.1"
              error={errors.rating}
            />

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                Descripción
              </label>
              <textarea
                name="description"
                placeholder="Describe el libro..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                style={{
                  ...styles.textarea,
                  borderColor: errors.description ? '#e74c3c' : '#e0e0e0'
                }}
              />
              {errors.description && (
                <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  ⚠️ {errors.description}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={styles.formActions}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button  
            type="submit"
            variant="primary"
          >
            {book ? 'Actualizar Libro' : 'Agregar Libro'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookModal; 