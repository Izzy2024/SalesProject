import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductForm from './components/ProductForm';
import ProductContainer from './components/ProductContainer';
import { ToastProvider } from './context/ToastContext';


const Header = () => (
  <header className="bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav className="py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Sistema de Ventas
          </h1>
          <div className="space-x-4">
            <Link 
              to="/products" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Ver Productos
            </Link>
            <Link 
              to="/products/new" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nuevo Producto
            </Link>
          </div>
        </div>
      </nav>
    </div>
  </header>
);

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<ProductContainer />} />
              <Route path="/products" element={<ProductContainer />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm isEditing={true} />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </Router>
  );
};

export default App;