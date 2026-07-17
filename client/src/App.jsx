import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// Pages
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ResetPassword from './pages/ResetPassword';
import TrackOrder from './pages/TrackOrder';
import MyOrders from './pages/MyOrders';
import ContactUs from './pages/ContactUs';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Check for existing token on load
    const token = localStorage.getItem('uv_token');
    if (token) {
      fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(err => console.error("Error verifying token:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('uv_token');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          user={user} 
          onOpenAuth={() => setIsAuthOpen(true)} 
          onLogout={handleLogout} 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetails cart={cart} setCart={setCart} />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} user={user} />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </main>

        <Footer />

        {isAuthOpen && (
          <AuthModal 
            onClose={() => setIsAuthOpen(false)} 
            onLoginSuccess={(userData, token) => {
              setUser(userData);
              localStorage.setItem('uv_token', token);
              setIsAuthOpen(false);
            }} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;
