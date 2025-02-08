const API_URL = 'http://localhost:5001/api';

export const productService = {
  async getProducts() {
    console.log('Iniciando getProducts');
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit' // Añadido para evitar problemas de CORS
      });
      
      console.log('Respuesta recibida:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Datos parseados:', data);
      return data;
    } catch (error) {
      console.error('Error en getProducts:', error);
      throw new Error('Error al cargar los productos');
    }
  },

  async getProductById(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getProductById:', error);
      throw new Error('Error al cargar el producto');
    }
  },

  async createProduct(productData) {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en createProduct:', error);
      throw new Error('Error al crear el producto');
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateProduct:', error);
      throw new Error('Error al actualizar el producto');
    }
  },

  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en deleteProduct:', error);
      throw new Error('Error al eliminar el producto');
    }
  }
};