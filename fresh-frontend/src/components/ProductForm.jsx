import React, { useState } from 'react';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '0',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    // Asegúrate de que los campos requeridos estén presentes
    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }

    // Agrega todos los campos al FormData
    Object.keys(formData).forEach(key => {
      if (key === 'image') {
        if (formData.image) {
          form.append('image', formData.image);
        }
      } else {
        form.append(key, formData[key]);
      }
    });

    // Log para debug
    console.log('Enviando datos:');
    for (let [key, value] of form.entries()) {
      console.log(key + ':', value);
    }

    try {
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        body: form
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Error al crear el producto');
      }

      window.location.href = '/products';
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre*</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="Nombre del producto"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría*</label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="Categoría del producto"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Precio*</label>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción*</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
          <div className="mt-2 flex flex-col items-center">
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="mb-4 w-48 h-48 object-cover rounded-lg"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => window.location.href = '/products'}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;