import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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

  if (!product) return <div style={{padding: '40px', textAlign: 'center', minHeight: '60vh'}}>Loading...</div>;

  const addToCart = () => {
    // Basic validation
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
       alert("Please select a size");
       return;
    }
    const item = { product, size: selectedSize || 'One Size', quantity: 1, cartId: Date.now() };
    setCart([...cart, item]);
    navigate('/cart');
  };

  const buyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
       alert("Please select a size");
       return;
    }
    const item = { product, size: selectedSize || 'One Size', quantity: 1, cartId: Date.now() };
    setCart([...cart, item]);
    navigate('/checkout');
  };

  return (
    <div style={{ backgroundColor: 'var(--fk-bg)', padding: '16px 0', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1248px', margin: '0 auto', display: 'flex', gap: '16px', backgroundColor: 'var(--fk-white)', padding: '24px', boxShadow: '0 1px 2px 0 rgba(0,0,0,.16)' }}>
        
        {/* Left Side: Images & Actions */}
        <div style={{ width: '40%', alignSelf: 'flex-start' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', marginBottom: '16px', position: 'relative', backgroundColor: 'var(--surface-color)' }}>
             <i className="fa-regular fa-heart fk-wishlist-icon" style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '20px', color: '#c2c2c2', cursor: 'pointer' }}></i>
             <img src={product.image.replace('./', '/')} alt={product.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button onClick={addToCart} style={{ flex: 1, padding: '16px 8px', fontSize: '16px', fontFamily: 'Outfit, sans-serif', fontWeight: '600', color: 'var(--text-main)', backgroundColor: 'transparent', border: '2px solid var(--border-color)', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <i className="fa-solid fa-cart-shopping" style={{ marginRight: '8px' }}></i> ADD TO CART
             </button>
             <button onClick={buyNow} style={{ flex: 1, padding: '16px 8px', fontSize: '16px', fontFamily: 'Outfit, sans-serif', fontWeight: '600', color: 'white', backgroundColor: 'var(--primary-color)', border: 'none', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <i className="fa-solid fa-bolt" style={{ marginRight: '8px' }}></i> BUY NOW
             </button>
          </div>
        </div>
        
        {/* Right Side: Details */}
        <div style={{ width: '60%', paddingLeft: '20px' }}>
          <div className="fk-breadcrumb" style={{ marginBottom: '12px' }}>
             Home {'>'} Clothing and Accessories {'>'} {product.category}
          </div>
          
          <h1 style={{ fontSize: '18px', fontWeight: '400', color: '#212121', marginBottom: '8px' }}>
            {product.name}
          </h1>
          
          <div className="fk-product-rating" style={{ marginBottom: '16px' }}>
            4.2 <i className="fa-solid fa-star" style={{ fontSize: '10px' }}></i>
          </div>
          <span style={{ color: '#878787', fontSize: '14px', marginLeft: '8px', fontWeight: '500' }}>
            1,432 Ratings & 204 Reviews
          </span>
          
          <div style={{ color: 'var(--fk-green)', fontSize: '14px', fontWeight: '500', marginTop: '8px' }}>Special price</div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '4px', marginBottom: '24px' }}>
             <span style={{ fontSize: '28px', fontWeight: '500' }}>₹{product.price.toLocaleString('en-IN')}</span>
             {product.comparePrice && <span style={{ fontSize: '16px', color: '#878787', textDecoration: 'line-through', paddingBottom: '4px' }}>₹{product.comparePrice.toLocaleString('en-IN')}</span>}
             {product.comparePrice && <span style={{ fontSize: '16px', color: 'var(--fk-green)', fontWeight: '500', paddingBottom: '4px' }}>{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% off</span>}
          </div>
          
          <div style={{ fontSize: '14px', marginBottom: '24px' }}>
             <div style={{ fontWeight: '500', marginBottom: '8px' }}>Available offers</div>
             <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
               <img src="https://rukminim1.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" width="18" height="18" />
               <span><strong>Bank Offer</strong> 5% Cashback on Flipkart Axis Bank Card</span>
             </div>
             <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
               <img src="https://rukminim1.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" width="18" height="18" />
               <span><strong>Special Price</strong> Get extra 10% off (price inclusive of cashback/coupon)</span>
             </div>
          </div>
          
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: '#878787', fontWeight: '500', marginBottom: '8px' }}>Size</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '8px 16px', 
                      minWidth: '40px',
                      borderRadius: '100px',
                      border: `1px solid ${selectedSize === size ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      background: selectedSize === size ? 'var(--primary-color)' : 'transparent',
                      color: selectedSize === size ? 'white' : 'var(--text-main)',
                      fontWeight: selectedSize === size ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >{size}</button>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ border: '1px solid #e0e0e0', padding: '16px', borderRadius: '2px', display: 'flex', gap: '16px', fontSize: '14px' }}>
             <div style={{ color: '#878787', width: '80px' }}>Description</div>
             <div style={{ flex: 1, lineHeight: '1.6' }}>{product.description}</div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
