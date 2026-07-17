import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus(data.error || 'Failed to send message.');
      }
    } catch (err) {
      setStatus('An error occurred while sending your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: 'calc(100vh - 70px)', padding: '60px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: 'var(--surface-color)', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)', textAlign: 'center' }}>Contact Us</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '40px', textAlign: 'center', fontSize: '18px' }}>We'd love to hear from you. Please fill out the form below and we will get in touch with you shortly.</p>
          
          {status === 'success' ? (
            <div style={{ padding: '30px', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: '48px', color: '#10b981', marginBottom: '16px' }}></i>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Message Sent!</h3>
              <p>Thank you for reaching out. Our support team will get back to you within 24 hours.</p>
              <button 
                onClick={() => setStatus('')}
                style={{ marginTop: '20px', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '100px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>Your Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'Outfit', fontSize: '16px' }}
                    required
                  />
                </div>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'Outfit', fontSize: '16px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="How can we help you?" 
                  value={formData.subject}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'Outfit', fontSize: '16px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>Message *</label>
                <textarea 
                  name="message"
                  placeholder="Type your message here..." 
                  value={formData.message}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'Outfit', fontSize: '16px', minHeight: '150px', resize: 'vertical' }}
                  required
                ></textarea>
              </div>

              {status && status !== 'success' && (
                <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: '500' }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
                  {status}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', padding: '16px', borderRadius: '100px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit', transition: 'var(--transition)', opacity: loading ? 0.7 : 1, marginTop: '10px' }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px', backgroundColor: 'var(--surface-color)', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <i className="fa-solid fa-envelope" style={{ fontSize: '32px', color: 'var(--primary-color)', marginBottom: '16px' }}></i>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Email Us</h3>
            <p style={{ color: 'var(--text-muted)' }}>support@urbanvogue.com</p>
          </div>
          <div style={{ flex: '1', minWidth: '250px', backgroundColor: 'var(--surface-color)', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <i className="fa-solid fa-phone" style={{ fontSize: '32px', color: 'var(--primary-color)', marginBottom: '16px' }}></i>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Call Us</h3>
            <p style={{ color: 'var(--text-muted)' }}>+1 (800) 555-0199</p>
          </div>
          <div style={{ flex: '1', minWidth: '250px', backgroundColor: 'var(--surface-color)', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <i className="fa-solid fa-location-dot" style={{ fontSize: '32px', color: 'var(--primary-color)', marginBottom: '16px' }}></i>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Visit Us</h3>
            <p style={{ color: 'var(--text-muted)' }}>101 Fashion Avenue, NY</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
