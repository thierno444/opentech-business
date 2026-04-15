import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import ProductForm from './pages/Admin/ProductForm';
import AdminUsers from './pages/Admin/Users';  // Vérifiez le chemin exact

export default function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col tech-gradient text-text-silver">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/product/new" element={<ProductForm />} />
                <Route path="/admin/product/edit/:id" element={<ProductForm />} />
                <Route path="/admin/users" element={<AdminUsers />} />  {/* Ajout de cette ligne */}
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}