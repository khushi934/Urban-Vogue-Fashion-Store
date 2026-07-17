import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setBestsellers(data.filter(p => p.isBestSeller).slice(0, 8));
        setNewArrivals(data.filter(p => p.isNew).slice(0, 8));
      })
      .catch(err => console.error("Error fetching products", err));
  }, []);

  return (
    <div>
      {/* Categories Bar */}
      <div className="fk-categories-bar">
        <div className="fk-categories-container" style={{ padding: '10px 20px', gap: '20px', overflowX: 'auto' }}>
          <Link to="/store?collection=Men" className="fk-cat-item">
            <i className="fa-solid fa-shirt" style={{ fontSize: '32px', marginBottom: '12px', color: '#2874f0' }}></i>
            <span>Men</span>
          </Link>
          <Link to="/store?collection=Women" className="fk-cat-item">
            <i className="fa-solid fa-person-dress" style={{ fontSize: '32px', marginBottom: '12px', color: '#e91e63' }}></i>
            <span>Women</span>
          </Link>
          <Link to="/store?collection=Kids" className="fk-cat-item">
            <i className="fa-solid fa-child" style={{ fontSize: '32px', marginBottom: '12px', color: '#4caf50' }}></i>
            <span>Kids</span>
          </Link>
          <Link to="/store" className="fk-cat-item">
            <i className="fa-solid fa-shoe-prints" style={{ fontSize: '32px', marginBottom: '12px', color: '#ff9800' }}></i>
            <span>Footwear</span>
          </Link>
          <Link to="/store" className="fk-cat-item">
            <i className="fa-solid fa-glasses" style={{ fontSize: '32px', marginBottom: '12px', color: '#9c27b0' }}></i>
            <span>Accessories</span>
          </Link>
          <Link to="/store" className="fk-cat-item">
            <i className="fa-solid fa-person-running" style={{ fontSize: '32px', marginBottom: '12px', color: '#00bcd4' }}></i>
            <span>Activewear</span>
          </Link>
          <Link to="/store" className="fk-cat-item">
            <i className="fa-solid fa-clock" style={{ fontSize: '32px', marginBottom: '12px', color: '#795548' }}></i>
            <span>Watches</span>
          </Link>
          <Link to="/store?collection=Winterwear" className="fk-cat-item">
            <i className="fa-solid fa-mitten" style={{ fontSize: '32px', marginBottom: '12px', color: '#607d8b' }}></i>
            <span>Winterwear</span>
          </Link>
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="fk-banner">
        <img src="/assets/hero_banner.png" alt="Big Fashion Festival" />
      </div>

      {/* Deals of the Day (Best Sellers) */}
      <section className="fk-section">
        <div className="fk-section-header">
          <h2 className="fk-section-title">Best of Fashion</h2>
          <Link to="/store?collection=Best+Sellers" className="fk-view-all">VIEW ALL</Link>
        </div>
        <div className="fk-row">
          {bestsellers.map(product => (
            <Link to={`/product/${product.id}`} className="fk-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div className="fk-card-title">{product.name}</div>
              <div className="fk-card-offer">From ₹{product.price}</div>
              <div className="fk-card-desc">{product.category} Collection</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Deals (New Arrivals) */}
      <section className="fk-section">
        <div className="fk-section-header">
          <h2 className="fk-section-title">Trending Offers</h2>
          <Link to="/store?collection=New+Arrivals" className="fk-view-all">VIEW ALL</Link>
        </div>
        <div className="fk-row">
          {newArrivals.map(product => (
            <Link to={`/product/${product.id}`} className="fk-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div className="fk-card-title">{product.name}</div>
              <div className="fk-card-offer">
                {product.comparePrice ? `Up to ${Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% Off` : 'Special Offer'}
              </div>
              <div className="fk-card-desc">{product.badge || 'New Arrival'}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banner 2 */}
      <div className="fk-banner" style={{ marginTop: '40px' }}>
        <img src="/assets/hero_banner.png" alt="Premium Collection" />
      </div>

    </div>
  );
};

export default Home;
