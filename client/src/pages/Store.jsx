import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const collection = searchParams.get('collection');

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products", err));
  }, []);

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Base filtering by URL parameter
  let filteredProducts = products;
  let catalogTitle = 'All Products';

  if (collection) {
      if (collection === 'Men') {
          filteredProducts = products.filter(p => p.category === 'Men');
          catalogTitle = "Men's Clothing";
      } else if (collection === 'Women') {
          filteredProducts = products.filter(p => p.category === 'Women');
          catalogTitle = "Women's Clothing";
      } else if (collection === 'Kids') {
          filteredProducts = products.filter(p => p.category === 'Kids');
          catalogTitle = "Kids' Clothing";
      } else if (collection === 'New Arrivals') {
          filteredProducts = products.filter(p => p.isNew);
          catalogTitle = "New Arrivals";
      } else if (collection === 'Best Sellers') {
          filteredProducts = products.filter(p => p.isBestSeller);
          catalogTitle = "Best Sellers";
      } else if (collection === 'Sale') {
          filteredProducts = products.filter(p => p.comparePrice > p.price);
          catalogTitle = "Sale Items";
      } else {
          // generic search (dumb search)
          const query = collection.toLowerCase();
          filteredProducts = products.filter(p => 
              p.name.toLowerCase().includes(query) || 
              p.category.toLowerCase().includes(query)
          );
          catalogTitle = `Showing results for "${collection}"`;
      }
  }

  // Apply Sidebar Filters
  if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(p => selectedCategories.includes(p.category));
  }
  if (minPrice && !isNaN(minPrice)) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice && !isNaN(maxPrice)) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
  }
  if (minRating > 0) {
      filteredProducts = filteredProducts.filter(p => p.rating >= minRating);
  }

  return (
    <div className="fk-store-container">
      {/* Left Sidebar Filter */}
      <aside className="fk-sidebar">
        <div className="fk-filter-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Filters</span>
          {(selectedCategories.length > 0 || minPrice || maxPrice || minRating > 0) && (
            <span 
              style={{ fontSize: '12px', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => { setSelectedCategories([]); setMinPrice(''); setMaxPrice(''); setMinRating(0); }}
            >
              CLEAR ALL
            </span>
          )}
        </div>
        
        <div className="fk-filter-section">
          <div className="fk-filter-title">Categories</div>
          <div className="fk-filter-list">
             <label><input type="checkbox" checked={selectedCategories.includes('Men')} onChange={() => handleCategoryChange('Men')} /> Men</label>
             <label><input type="checkbox" checked={selectedCategories.includes('Women')} onChange={() => handleCategoryChange('Women')} /> Women</label>
             <label><input type="checkbox" checked={selectedCategories.includes('Kids')} onChange={() => handleCategoryChange('Kids')} /> Kids</label>
          </div>
        </div>

        <div className="fk-filter-section">
          <div className="fk-filter-title">Price</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <select value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ padding: '4px', flex: 1, border: '1px solid #e0e0e0' }}>
               <option value="">Min</option>
               <option value="500">₹500</option>
               <option value="1000">₹1000</option>
               <option value="2000">₹2000</option>
             </select>
             <span style={{ color: '#878787' }}>to</span>
             <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ padding: '4px', flex: 1, border: '1px solid #e0e0e0' }}>
               <option value="">Max</option>
               <option value="1000">₹1000</option>
               <option value="2000">₹2000</option>
               <option value="3000">₹3000</option>
               <option value="5000">₹5000</option>
             </select>
          </div>
        </div>

        <div className="fk-filter-section">
          <div className="fk-filter-title">Customer Ratings</div>
          <div className="fk-filter-list">
             <label><input type="checkbox" checked={minRating === 4} onChange={() => setMinRating(minRating === 4 ? 0 : 4)} /> 4★ & above</label>
             <label><input type="checkbox" checked={minRating === 3} onChange={() => setMinRating(minRating === 3 ? 0 : 3)} /> 3★ & above</label>
          </div>
        </div>
      </aside>

      {/* Right Product Grid */}
      <div className="fk-products-area">
        <div className="fk-products-header">
           <div className="fk-breadcrumb">Home {'>'} Clothing and Accessories</div>
           <h1 className="fk-products-title">
             {catalogTitle} <span style={{ color: '#878787', fontSize: '12px', fontWeight: 'normal' }}>(Showing 1 – {filteredProducts.length} products)</span>
           </h1>
           <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '14px' }}>
              <span style={{ fontWeight: 500 }}>Sort By</span>
              <span style={{ color: '#2874f0', cursor: 'pointer', borderBottom: '2px solid #2874f0', paddingBottom: '4px' }}>Popularity</span>
              <span style={{ cursor: 'pointer' }}>Price -- Low to High</span>
              <span style={{ cursor: 'pointer' }}>Price -- High to Low</span>
              <span style={{ cursor: 'pointer' }}>Newest First</span>
           </div>
        </div>

        {filteredProducts.length === 0 ? (
           <div style={{ padding: '40px', textAlign: 'center', color: '#878787' }}>
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png" alt="No results" style={{ width: '250px', marginBottom: '20px' }} />
              <h2>Sorry, no results found!</h2>
              <p>Please check the spelling or try searching for something else</p>
           </div>
        ) : (
           <div className="fk-products-grid">
              {filteredProducts.map(product => (
                 <Link to={`/product/${product.id}`} className="fk-card" key={product.id}>
                    <i className="fa-regular fa-heart fk-wishlist-icon" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '18px', color: '#c2c2c2', zIndex: '2' }}></i>
                    {product.comparePrice && (
                       <span className="fk-badge-discount">{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% off</span>
                    )}
                    <div className="fk-card-image-wrapper">
                       <img src={product.image} alt={product.name} />
                    </div>
                    <div className="fk-card-title">{product.name}</div>
                    <div className="fk-card-desc">URBAN VOGUE • {product.category}</div>
                    <div className="fk-card-price-row">
                       <span className="fk-card-price">₹{product.price.toLocaleString('en-IN')}</span>
                       {product.comparePrice && <span className="fk-card-mrp">₹{product.comparePrice.toLocaleString('en-IN')}</span>}
                    </div>
                    {product.badge && <div style={{ fontSize: '12px', marginTop: '10px', color: 'var(--text-muted)', fontWeight: '500' }}>{product.badge}</div>}
                 </Link>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default Store;
