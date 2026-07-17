import React, { useState } from 'react';
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
  const totalMRP = cart.reduce((sum, item) => sum + ((item.product.comparePrice || item.product.price) * item.quantity), 0);
  const discount = totalMRP - subtotal;

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
          discount,
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

  if (cart.length === 0) return (
    <div style={{ backgroundColor: 'var(--fk-bg)', padding: '32px 0', minHeight: 'calc(100vh - 56px)', textAlign: 'center' }}>
      <h2>Your cart is empty.</h2>
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--fk-bg)', padding: '32px 0', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1248px', margin: '0 auto', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        
        {/* Left Side: Checkout Accordion Steps */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           
           {/* Step 1 */}
           <div style={{ backgroundColor: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 2px 0 rgba(0,0,0,.16)' }}>
              <div style={{ backgroundColor: 'var(--fk-bg)', color: 'var(--fk-blue)', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '2px', fontSize: '12px', fontWeight: '500', marginRight: '16px' }}>1</div>
              <div style={{ flex: 1 }}>
                 <div style={{ color: '#878787', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase' }}>Login <i className="fa-solid fa-check" style={{ color: 'var(--fk-blue)', marginLeft: '8px' }}></i></div>
                 <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '4px' }}>{user ? `${user.name} +91-9876543210` : 'Guest Checkout'}</div>
              </div>
           </div>

           {/* Step 2 */}
           <div style={{ backgroundColor: 'white', padding: '16px 24px', boxShadow: '0 1px 2px 0 rgba(0,0,0,.16)' }}>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--fk-blue)', color: 'white', padding: '12px 16px', margin: '-16px -24px 20px', fontSize: '16px', fontWeight: '500', textTransform: 'uppercase' }}>
                 <div style={{ backgroundColor: 'white', color: 'var(--fk-blue)', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '2px', fontSize: '12px', marginRight: '16px' }}>2</div>
                 Delivery Address
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                 <input type="text" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ flex: 1, padding: '12px', border: '1px solid var(--fk-border)', borderRadius: '2px', outline: 'none' }} />
                 <input type="text" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ flex: 1, padding: '12px', border: '1px solid var(--fk-border)', borderRadius: '2px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                 <input type="text" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ flex: 1, padding: '12px', border: '1px solid var(--fk-border)', borderRadius: '2px', outline: 'none' }} />
                 <input type="text" placeholder="Pincode" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} style={{ flex: 1, padding: '12px', border: '1px solid var(--fk-border)', borderRadius: '2px', outline: 'none' }} />
              </div>
              <textarea placeholder="Address (Area and Street)" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--fk-border)', borderRadius: '2px', outline: 'none', minHeight: '80px', marginBottom: '16px' }} />
              <input type="text" placeholder="City/District/Town" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '50%', padding: '12px', border: '1px solid var(--fk-border)', borderRadius: '2px', outline: 'none', marginBottom: '16px' }} />
           </div>

           {/* Step 3 */}
           <div style={{ backgroundColor: 'white', padding: '16px 24px', boxShadow: '0 1px 2px 0 rgba(0,0,0,.16)' }}>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--fk-blue)', color: 'white', padding: '12px 16px', margin: '-16px -24px 20px', fontSize: '16px', fontWeight: '500', textTransform: 'uppercase' }}>
                 <div style={{ backgroundColor: 'white', color: 'var(--fk-blue)', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '2px', fontSize: '12px', marginRight: '16px' }}>3</div>
                 Payment Options
              </div>
              
              <div style={{ padding: '16px 0', borderBottom: '1px solid var(--fk-border)' }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: '500' }}>
                    <input type="radio" name="payment" value="upi" checked={formData.paymentMethod === 'upi'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} />
                    UPI (Google Pay, PhonePe, Paytm)
                 </label>
                 {formData.paymentMethod === 'upi' && (
                    <div style={{ padding: '20px 0 0 30px' }}>
                       <input type="text" placeholder="Enter UPI ID" value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} style={{ padding: '12px', border: '1px solid var(--fk-border)', width: '300px', outline: 'none' }} />
                       <div style={{ fontSize: '12px', color: '#878787', marginTop: '8px' }}>You will receive a payment request from Urban Vogue.</div>
                    </div>
                 )}
              </div>
              
              <div style={{ padding: '16px 0' }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#878787' }}>
                    <input type="radio" name="payment" value="cod" disabled />
                    Cash on Delivery (Not available for this order)
                 </label>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                 <button onClick={handleSubmit} style={{ backgroundColor: '#fb641b', color: 'white', padding: '16px 40px', border: 'none', borderRadius: '2px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}>
                    PAY ₹{subtotal.toLocaleString('en-IN')}
                 </button>
              </div>

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
                 <span>Amount Payable</span>
                 <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              <div style={{ color: 'var(--fk-green)', fontWeight: '500', marginTop: '20px', fontSize: '16px' }}>
                 Your Total Savings on this order ₹{discount.toLocaleString('en-IN')}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
