import React, { useState, useEffect } from 'react';

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Productos recibidos:', data); // Debug
      setProducts(data);
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderImage = (imageUrl) => {
    if (imageUrl) {
      return (
        <div className="w-full h-48">
          <img
            src={`http://localhost:5001${imageUrl}`}
            alt="Producto"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Error loading image:', e); // Debug
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        </div>
      );
    }
    return (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Sin imagen</span>
      </div>
    );
  };

  if (isLoading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
          {renderImage(product.image)}
          <div className="p-4">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-gray-600">Categoría: {product.category}</p>
            <p className="text-lg font-semibold mt-2">Precio: ${product.price}</p>
            <p className="text-gray-700 mt-2">{product.description}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => window.location.href = `/products/edit/${product._id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductContainer;