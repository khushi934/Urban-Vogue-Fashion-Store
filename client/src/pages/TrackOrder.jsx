import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId || !email) {
      setError('Please enter both Order ID and Email.');
      return;
    }
    
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const response = await fetch(`/api/orders/${orderId}?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Order not found. Please check your details.');
      }
      
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = {
      'Pending': 1,
      'Processing': 2,
      'Shipped': 3,
      'Delivered': 4
    };
    return steps[status] || 1;
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: 'calc(100vh - 70px)', padding: '60px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: 'var(--surface-color)', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>Track Your Order</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Enter your Order ID and billing email to check the status of your shipment.</p>
          
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>Order ID</label>
              <input 
                type="text" 
                placeholder="e.g. ORD-12345" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                style={{ width: '100%', padding: '14px 20px', borderRadius: '100px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'Outfit', fontSize: '16px' }}
                required
              />
            </div>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>Billing Email</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 20px', borderRadius: '100px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'Outfit', fontSize: '16px' }}
                required
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '100px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit', transition: 'var(--transition)', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </div>
          </form>

          {error && (
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: '500' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
              {error}
            </div>
          )}
        </div>

        {order && (
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '32px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Order {order.id}</h3>
                <p style={{ color: 'var(--text-muted)' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Amount</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-color)' }}>₹{order.total.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="fk-stepper-container">
              <div className={`fk-step ${getStatusStep(order.status) >= 1 ? 'active' : ''}`}>
                <div className="fk-step-icon"><i className="fa-solid fa-clipboard-list"></i></div>
                <div className="fk-step-text">Order Placed</div>
              </div>
              <div className={`fk-step-line ${getStatusStep(order.status) >= 2 ? 'active' : ''}`}></div>
              
              <div className={`fk-step ${getStatusStep(order.status) >= 2 ? 'active' : ''}`}>
                <div className="fk-step-icon"><i className="fa-solid fa-box-open"></i></div>
                <div className="fk-step-text">Processing</div>
              </div>
              <div className={`fk-step-line ${getStatusStep(order.status) >= 3 ? 'active' : ''}`}></div>
              
              <div className={`fk-step ${getStatusStep(order.status) >= 3 ? 'active' : ''}`}>
                <div className="fk-step-icon"><i className="fa-solid fa-truck-fast"></i></div>
                <div className="fk-step-text">Shipped</div>
              </div>
              <div className={`fk-step-line ${getStatusStep(order.status) >= 4 ? 'active' : ''}`}></div>
              
              <div className={`fk-step ${getStatusStep(order.status) >= 4 ? 'active' : ''}`}>
                <div className="fk-step-icon"><i className="fa-solid fa-house-circle-check"></i></div>
                <div className="fk-step-text">Delivered</div>
              </div>
            </div>

            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>Items in this order</h4>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', padding: '16px', borderBottom: index < order.items.length - 1 ? '1px solid var(--border-color)' : 'none', gap: '16px' }}>
                  <img src={item.product.image.replace('./', '/')} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', padding: '8px' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>{item.product.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Size: {item.size} • Qty: {item.quantity}</div>
                    <div style={{ fontWeight: '600' }}>₹{item.product.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', padding: '24px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)' }}>Shipping Details</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
                {order.firstName} {order.lastName}<br />
                {order.address}<br />
                {order.city} - {order.pincode}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;
