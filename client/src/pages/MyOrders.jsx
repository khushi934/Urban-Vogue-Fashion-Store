import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeAdvisor, setActiveAdvisor] = useState(null); // stores the order ID being advised
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('uv_token');
    if (!token) {
      navigate('/');
      return;
    }

    fetch('/api/my-orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const getStatusStep = (status) => {
    const steps = { 'Pending': 1, 'Processing': 2, 'Shipped': 3, 'Delivered': 4 };
    return steps[status] || 1;
  };

  const getAIAdvice = (items) => {
    const categories = items.map(i => i.product.category);
    const hasMen = categories.includes('Men');
    const hasWomen = categories.includes('Women');
    const itemNames = items.map(i => i.product.name.toLowerCase());
    
    if (itemNames.some(n => n.includes('hoodie') || n.includes('jacket'))) {
      return "AI Stylist says: Layering is key! Pair your new outerwear with a crisp white tee and distressed denim for an effortlessly cool streetwear vibe.";
    } else if (itemNames.some(n => n.includes('sneaker') || n.includes('shoe'))) {
      return "AI Stylist says: Let your kicks do the talking. Keep the rest of your outfit muted with monochromatic tones to make your new footwear pop.";
    } else if (hasWomen) {
      return "AI Stylist says: Elevate this look with minimalistic silver jewelry and a sleek cross-body bag for the perfect transition from day to night.";
    } else if (hasMen) {
      return "AI Stylist says: Keep it sharp and casual. Throw on a classic watch and some relaxed-fit cargo pants to complete the silhouette.";
    }
    return "AI Stylist says: A great choice! Accessorize with confidence and mix textures to bring this outfit to life.";
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading your orders...</div>;
  if (error) return <div style={{ padding: '100px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: 'calc(100vh - 70px)', padding: '60px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>My Orders</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>View your past purchases and get exclusive styling advice.</p>

        {orders.length === 0 ? (
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '60px 40px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <i className="fa-solid fa-bag-shopping" style={{ fontSize: '48px', color: 'var(--border-color)', marginBottom: '16px' }}></i>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No orders yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Looks like you haven't made your first purchase yet.</p>
            <Link to="/store" className="fk-btn-orange" style={{ display: 'inline-block', width: 'auto', padding: '12px 32px' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '40px' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Order Placed</div>
                      <div style={{ fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total</div>
                      <div style={{ fontWeight: '600' }}>₹{order.total.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Order ID</div>
                      <div style={{ fontWeight: '600' }}>{order.id}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveAdvisor(activeAdvisor === order.id ? null : order.id)}
                    className="fk-ai-stylist-btn"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i> AI Stylist
                  </button>
                </div>

                {/* AI Stylist Panel */}
                <div className={`fk-ai-panel ${activeAdvisor === order.id ? 'open' : ''}`}>
                  <div className="fk-ai-content">
                    <div className="fk-ai-header">
                      <i className="fa-solid fa-wand-magic-sparkles"></i> Urban Vogue AI Stylist
                    </div>
                    <p className="fk-ai-text">{getAIAdvice(order.items)}</p>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <div className="fk-stepper-container" style={{ margin: '20px 0 40px 0' }}>
                    <div className={`fk-step ${getStatusStep(order.status) >= 1 ? 'active' : ''}`}>
                      <div className="fk-step-icon"><i className="fa-solid fa-clipboard-list"></i></div>
                      <div className="fk-step-text">Placed</div>
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {order.items.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <img src={item.product.image.replace('./', '/')} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', padding: '8px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>{item.product.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Size: {item.size} • Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: '600' }}>₹{item.product.price.toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
