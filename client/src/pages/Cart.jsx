import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalMRP = cart.reduce((sum, item) => sum + ((item.product.comparePrice || item.product.price) * item.quantity), 0);
  const discount = totalMRP - subtotal;
  
  const removeItem = (cartId) => setCart(cart.filter(i => i.cartId !== cartId));

  if (cart.length === 0) return (
    <div style={{ backgroundColor: 'var(--fk-bg)', padding: '32px 0', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1248px', margin: '0 auto', backgroundColor: 'white', padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 2px 0 rgba(0,0,0,.16)' }}>
        <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" style={{ width: '250px', marginBottom: '24px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: '400', marginBottom: '12px' }}>Your cart is empty!</h2>
        <p style={{ fontSize: '14px', marginBottom: '24px' }}>Add items to it now.</p>
        <Link to="/store" style={{ display: 'inline-block', backgroundColor: 'var(--fk-blue)', color: 'white', padding: '12px 72px', borderRadius: '2px', fontSize: '14px', fontWeight: '500', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}>Shop now</Link>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--fk-bg)', padding: '32px 0', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1248px', margin: '0 auto', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        
        {/* Left Side: Cart Items */}
        <div style={{ flex: '1', backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0,0,0,.16)' }}>
           <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--fk-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '500' }}>My Cart ({cart.length})</div>
              <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <i className="fa-solid fa-location-dot" style={{ color: 'var(--fk-blue)' }}></i> Deliver to
                 <span style={{ fontWeight: '500' }}>Bengaluru - 560103</span>
              </div>
           </div>
           
           <div>
             {cart.map(item => (
               <div key={item.cartId} style={{ display: 'flex', padding: '24px', borderBottom: '1px solid var(--fk-border)' }}>
                 <div style={{ width: '120px', marginRight: '24px' }}>
                    <img src={item.product.image.replace('./', '/')} style={{ width: '100%', objectFit: 'contain' }} alt={item.product.name} />
                 </div>
                 <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '400', marginBottom: '8px' }}>{item.product.name}</h4>
                    <p style={{ color: '#878787', fontSize: '14px', marginBottom: '16px' }}>Size: {item.size}, Seller: Urban Vogue</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '24px' }}>
                       {item.product.comparePrice && <span style={{ fontSize: '14px', color: '#878787', textDecoration: 'line-through' }}>₹{item.product.comparePrice.toLocaleString('en-IN')}</span>}
                       <span style={{ fontSize: '18px', fontWeight: '500' }}>₹{item.product.price.toLocaleString('en-IN')}</span>
                       {item.product.comparePrice && <span style={{ fontSize: '14px', color: 'var(--fk-green)', fontWeight: '500' }}>{Math.round(((item.product.comparePrice - item.product.price) / item.product.comparePrice) * 100)}% off</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '16px', fontWeight: '500' }}>
                       <span style={{ cursor: 'pointer' }}>SAVE FOR LATER</span>
                       <span onClick={() => removeItem(item.cartId)} style={{ cursor: 'pointer', color: '#212121' }}>REMOVE</span>
                    </div>
                 </div>
               </div>
             ))}
           </div>
           
           <div style={{ padding: '16px 24px', borderTop: '1px solid var(--fk-border)', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'white', position: 'sticky', bottom: 0, boxShadow: '0 -2px 10px 0 rgba(0,0,0,.1)' }}>
              <button onClick={() => navigate('/checkout')} style={{ backgroundColor: '#fb641b', color: 'white', padding: '16px 48px', border: 'none', borderRadius: '2px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}>
                 PLACE ORDER
              </button>
           </div>
        </div>
        
        {/* Right Side: Price Details */}
        <div style={{ width: '30%', backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0,0,0,.16)', position: 'sticky', top: '70px' }}>
           <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--fk-border)', fontSize: '16px', fontWeight: '500', color: '#878787' }}>
              PRICE DETAILS
           </div>
           <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '16px' }}>
                 <span>Price ({cart.length} items)</span>
                 <span>₹{totalMRP.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '16px' }}>
                 <span>Discount</span>
                 <span style={{ color: 'var(--fk-green)' }}>- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '16px' }}>
                 <span>Delivery Charges</span>
                 <span style={{ color: 'var(--fk-green)' }}>Free</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: '1px dashed var(--fk-border)', borderBottom: '1px dashed var(--fk-border)', fontSize: '18px', fontWeight: '500' }}>
                 <span>Total Amount</span>
                 <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              <div style={{ color: 'var(--fk-green)', fontWeight: '500', marginTop: '20px', fontSize: '16px' }}>
                 You will save ₹{discount.toLocaleString('en-IN')} on this order
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
