const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ active: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    console.log('Archivo recibido:', req.file);
    
    const productData = {
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description,
      category: req.body.category,
      stock: Number(req.body.stock) || 0,
    };

    // Si hay un archivo subido, agregamos la URL de la imagen
    if (req.file) {
      // La URL será relativa al servidor
      productData.image = `/uploads/${req.file.filename}`;
      console.log('URL de imagen guardada:', productData.image);
    }

    console.log('ProductData antes de guardar:', productData);

    const product = new Product(productData);
    const savedProduct = await product.save();

    console.log('Producto guardado:', savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ 
      message: 'Error al crear producto', 
      error: error.message
    });
  }
};

// Obtener un producto específico
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};