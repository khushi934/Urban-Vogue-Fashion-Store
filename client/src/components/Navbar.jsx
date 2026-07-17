import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onOpenAuth, onLogout, cartCount }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if(search) {
      navigate(`/store?collection=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="fk-header">
      <div className="fk-header-container">
        {/* Logo */}
        <Link to="/" className="fk-logo">
          URBAN VOGUE
          <span>Explore <i>Plus</i> <i className="fa-solid fa-plus"></i></span>
        </Link>
        
        {/* Search */}
        <form className="fk-search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            className="fk-search-input" 
            placeholder="Search for products, brands and more" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="fk-search-btn">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>

        {/* Links / Login */}
        <div className="fk-nav-links">
          {user ? (
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Hi, {user.name.split(' ')[0]}</span>
          ) : (
            <button className="fk-login-btn" onClick={onOpenAuth}>Login</button>
          )}

          <Link to="/store" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>More</span>
            <i className="fa-solid fa-chevron-down" style={{fontSize: '10px'}}></i>
          </Link>
          
          <Link to="/track-order" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-truck-fast"></i>
            <span>Track Order</span>
          </Link>
          
          <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            <i className="fa-solid fa-cart-shopping"></i>
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>

          {user && (
            <>
              <Link to="/my-orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                <i className="fa-solid fa-bag-shopping"></i> My Orders
              </Link>
              <div onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, cursor: 'pointer' }}>
                <i className="fa-solid fa-power-off"></i> Logout
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
