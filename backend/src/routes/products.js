const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rutas del producto
router.get('/', productController.getProducts); // Obtener todos los productos

// Para la ruta POST, usamos el upload configurado globalmente
router.post('/', (req, res, next) => {
    const upload = req.app.locals.upload;
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Error en la subida de archivo:', err);
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, productController.createProduct);

router.get('/:id', productController.getProduct); // Obtener un producto por ID
router.put('/:id', productController.updateProduct); // Actualizar un producto por ID
router.delete('/:id', productController.deleteProduct); // Eliminar un producto por ID

module.exports = router;