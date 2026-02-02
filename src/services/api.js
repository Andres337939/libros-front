const API_URL = 'http://200.7.102.135:3000/api';

// Helper para manejar errores de fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};

export const booksAPI = {
  // Obtener todos los libros con paginación y filtros
  getBooks: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 20,
        author,
        status,
        sort = 'createdAt'
      } = params;

      // Construir query string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort
      });

      if (author) queryParams.append('author', author);
      if (status) queryParams.append('status', status);

      const response = await fetch(`${API_URL}/books?${queryParams}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get books error:', error);
      throw error;
    }
  },

  // Obtener un libro por ID
  getBookById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get book by id error:', error);
      throw error;
    }
  },

  // Crear un nuevo libro (requiere autenticación)
  createBook: async (bookData, token) => {
    try {
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Create book error:', error);
      throw error;
    }
  },

  // Actualizar un libro existente (requiere autenticación)
  updateBook: async (id, bookData, token) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Update book error:', error);
      throw error;
    }
  },

  // Eliminar un libro (requiere autenticación)
  deleteBook: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Delete book error:', error);
      throw error;
    }
  },

    reserveBook: async (id, token, userId) => {
        try {
            const response = await fetch(`${API_URL}/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    status: 'reservado',
                    id_usuario: userId  // Cambiado de reservedBy a id_usuario
                })
            });
            
            return await handleResponse(response);
        } catch (error) {
            console.error('Reserve book error:', error);
            throw error;
        }
    },
    returnBook: async (id, token) => {
        try {
            const response = await fetch(`${API_URL}/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'disponible', id_usuario: null })
            });
            
            return await handleResponse(response);
        } catch (error) {
            console.error('Return book error:', error);
            throw error;
        }
    }
};