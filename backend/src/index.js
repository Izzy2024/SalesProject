const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productRoutes = require('./routes/products');
require('dotenv').config();

const app = express();

// Definir la ruta correcta para uploads (un nivel arriba de src)
const uploadsDir = path.join(__dirname, '../uploads');

// Crear directorio uploads si no existe
if (!fs.existsSync(uploadsDir)){
    console.log('Creating uploads directory at:', uploadsDir);
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración mejorada de multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('Upload destination:', uploadsDir); // Debug
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        console.log('Saving file as:', uniqueName); // Debug
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        console.log('Processing file:', file.originalname); // Debug
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports images!'));
    }
});

// Hacer upload disponible globalmente
app.locals.upload = upload;

// Configuración CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Configurar servicio de archivos estáticos (ANTES de las rutas)
app.use('/uploads', express.static(uploadsDir));

// Rutas
app.use('/api/products', productRoutes);

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Puerto del servidor
const PORT = process.env.PORT || 5001;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Uploads directory: ${uploadsDir}`);
});

import whatsappRoutes from './routes/whatsapp.js';
app.use('/api/whatsapp', whatsappRoutes);