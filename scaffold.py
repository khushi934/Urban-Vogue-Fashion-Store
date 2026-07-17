import os

components = {
    "Navbar.jsx": """import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onOpenAuth, onLogout, cartCount }) => {
  return (
    <nav className="nav-container">
      <div className="nav-left">
        <Link to="/" className="brand-logo">URBAN VOGUE</Link>
      </div>
      <div className="nav-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/store" className="nav-link">Shop</Link>
        <a href="#about" className="nav-link">About</a>
        <a href="#contact" className="nav-link">Contact</a>
      </div>
      <div className="nav-right">
        {user ? (
          <div className="user-menu">
            <span style={{color: 'white', marginRight: '1rem'}}>Hi, {user.name}</span>
            <button onClick={onLogout} className="btn-outline">Logout</button>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="btn-primary" style={{marginRight: '1rem'}}>Login</button>
        )}
        <Link to="/cart" className="cart-icon-wrapper">
          🛒 <span className="cart-count">{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
};
export default Navbar;
""",
    "Footer.jsx": """import React from 'react';

const Footer = () => (
  <footer className="footer-section">
    <div className="footer-content">
      <div className="footer-brand">
        <h2>URBAN VOGUE</h2>
        <p>Premium streetwear blending raw urban aesthetics with high-fashion tailoring.</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2026 Urban Vogue. All rights reserved.</p>
    </div>
  </footer>
);
export default Footer;
""",
    "AuthModal.jsx": """import React, { useState } from 'react';

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [view, setView] = useState('login'); // login, signup, forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = view === 'login' ? '/api/login' : view === 'signup' ? '/api/signup' : '/api/forgot-password';
    const body = view === 'signup' ? { name, email, password } : { email, password };
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        if (view === 'forgot') {
          alert(data.message);
          setView('login');
        } else {
          onLoginSuccess(data.user, data.token);
        }
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-content" style={{padding: '2rem'}}>
          <h2 style={{color: 'white', marginBottom: '1.5rem'}}>
            {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {view === 'signup' && (
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            )}
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
            {view !== 'forgot' && (
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            )}
            <button type="submit" className="btn-primary" style={{width: '100%', padding: '1rem'}}>
              {view === 'login' ? 'Login' : view === 'signup' ? 'Sign Up' : 'Send Reset Link'}
            </button>
          </form>
          
          <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', color: '#888'}}>
            {view === 'login' && (
              <>
                <span style={{cursor: 'pointer'}} onClick={() => setView('signup')}>Need an account?</span>
                <span style={{cursor: 'pointer'}} onClick={() => setView('forgot')}>Forgot password?</span>
              </>
            )}
            {view !== 'login' && (
              <span style={{cursor: 'pointer'}} onClick={() => setView('login')}>Back to Login</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthModal;
"""
}

pages = {
    "Home.jsx": """import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-badge">NEW COLLECTION '26</span>
        <h1 className="hero-title">REDEFINE<br/>YOUR STREET</h1>
        <p className="hero-subtitle">Premium streetwear blending raw urban aesthetics with high-fashion tailoring. Dare to stand out.</p>
        <div className="hero-actions">
          <Link to="/store" className="btn-primary">Shop Collection</Link>
        </div>
      </div>
    </section>
  </div>
);
export default Home;
""",
    "Store.jsx": """import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Store = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products", err));
  }, []);

  return (
    <section className="store-section" style={{padding: '6rem 2rem 2rem'}}>
      <h2 className="section-title">ALL <span>PRODUCTS</span></h2>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            {product.badge && <span className="product-badge">{product.badge}</span>}
            <div className="product-image-container">
              <img src={product.image.replace('./', '/')} alt={product.name} className="product-image" />
              <Link to={`/product/${product.id}`} className="quick-add-btn">VIEW DETAILS</Link>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">
                <span className="current-price">₹{product.price}</span>
                {product.comparePrice && <span className="original-price">₹{product.comparePrice}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Store;
""",
    "ProductDetails.jsx": """import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetails = ({ cart, setCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div style={{padding: '6rem 2rem', color: 'white'}}>Loading...</div>;

  const addToCart = () => {
    const item = { product, size: selectedSize, quantity: 1, cartId: Date.now() };
    setCart([...cart, item]);
    alert("Added to cart!");
  };

  return (
    <section style={{padding: '6rem 2rem 2rem', color: 'white', display: 'flex', gap: '2rem'}}>
      <div style={{flex: 1}}><img src={product.image.replace('./', '/')} style={{width: '100%', borderRadius: '1rem'}} /></div>
      <div style={{flex: 1}}>
        <h1>{product.name}</h1>
        <h2 style={{color: 'var(--primary-color)', margin: '1rem 0'}}>₹{product.price}</h2>
        <p style={{color: '#888', marginBottom: '2rem'}}>{product.description}</p>
        
        <div style={{marginBottom: '2rem'}}>
          <h4>Size</h4>
          <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
            {product.sizes.map(size => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: '0.5rem 1rem', 
                  border: `1px solid ${selectedSize === size ? 'var(--primary-color)' : '#444'}`,
                  background: selectedSize === size ? 'var(--primary-color)' : 'transparent',
                  color: selectedSize === size ? 'black' : 'white',
                  cursor: 'pointer'
                }}
              >{size}</button>
            ))}
          </div>
        </div>
        
        <button onClick={addToCart} className="btn-primary" style={{width: '100%', padding: '1rem', marginBottom: '1rem'}}>ADD TO CART</button>
        <button onClick={() => navigate('/cart')} className="btn-outline" style={{width: '100%', padding: '1rem'}}>VIEW CART</button>
      </div>
    </section>
  );
};
export default ProductDetails;
""",
    "Cart.jsx": """import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const removeItem = (cartId) => setCart(cart.filter(i => i.cartId !== cartId));

  if (cart.length === 0) return (
    <div style={{padding: '8rem 2rem', textAlign: 'center', color: 'white'}}>
      <h2>Your cart is empty</h2>
      <Link to="/store" className="btn-primary" style={{marginTop: '2rem', display: 'inline-block'}}>Go Shopping</Link>
    </div>
  );

  return (
    <section style={{padding: '6rem 2rem 2rem', color: 'white'}}>
      <h2>Your Cart</h2>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem'}}>
        {cart.map(item => (
          <div key={item.cartId} style={{display: 'flex', alignItems: 'center', gap: '1rem', background: '#111', padding: '1rem', borderRadius: '0.5rem'}}>
            <img src={item.product.image.replace('./', '/')} style={{width: '80px'}} />
            <div style={{flex: 1}}>
              <h4>{item.product.name}</h4>
              <p style={{color: '#888'}}>Size: {item.size}</p>
            </div>
            <div>₹{item.product.price}</div>
            <button onClick={() => removeItem(item.cartId)} style={{background: 'transparent', color: 'red', border: 'none', cursor: 'pointer'}}>Remove</button>
          </div>
        ))}
      </div>
      
      <div style={{marginTop: '2rem', textAlign: 'right'}}>
        <h3>Subtotal: ₹{subtotal}</h3>
        <button onClick={() => navigate('/checkout')} className="btn-primary" style={{marginTop: '1rem'}}>PROCEED TO CHECKOUT</button>
      </div>
    </section>
  );
};
export default Cart;
""",
    "Checkout.jsx": """import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cart, setCart, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '', city: '', pincode: '', paymentMethod: 'upi', upiId: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cart,
          subtotal,
          discount: 0,
          total: subtotal
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(`Order placed successfully! Order ID: ${data.id}`);
        setCart([]);
        navigate('/');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Checkout failed");
    }
  };

  if (cart.length === 0) return <div style={{padding: '6rem 2rem', color: 'white'}}>Your cart is empty.</div>;

  return (
    <section style={{padding: '6rem 2rem 2rem', color: 'white', maxWidth: '600px', margin: '0 auto'}}>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem'}}>
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        <div style={{display: 'flex', gap: '1rem'}}>
          <input type="text" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required style={{flex: 1}} />
          <input type="text" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required style={{flex: 1}} />
        </div>
        <input type="text" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
        <div style={{display: 'flex', gap: '1rem'}}>
          <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required style={{flex: 1}} />
          <input type="text" placeholder="PIN Code (6 digits)" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} required style={{flex: 1}} />
        </div>
        
        <h3 style={{marginTop: '1rem'}}>Payment (UPI)</h3>
        <input type="text" placeholder="UPI ID" value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} required />
        
        <div style={{marginTop: '2rem', padding: '1rem', background: '#111', borderRadius: '0.5rem'}}>
          <h3>Total to Pay: ₹{subtotal}</h3>
        </div>
        
        <button type="submit" className="btn-primary" style={{padding: '1rem', marginTop: '1rem'}}>PLACE ORDER</button>
      </form>
    </section>
  );
};
export default Checkout;
"""
}

# Create files
for name, content in components.items():
    with open(f"client/src/components/{name}", "w", encoding="utf-8") as f:
        f.write(content)

for name, content in pages.items():
    with open(f"client/src/pages/{name}", "w", encoding="utf-8") as f:
        f.write(content)

print("Scaffold complete!")
