import React, { useState } from 'react';

function AuthModal({ onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // login, signup, forgot
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.devResetUrl) {
          setMessage(
            <span>
              {data.message}<br/><br/>
              <strong style={{color: '#ff5722'}}>Dev Mode:</strong> <a href={data.devResetUrl} style={{color: '#2874f0', textDecoration: 'underline'}}>Click here to reset password</a>
            </span>
          );
        } else {
          setMessage(data.message || 'If an account exists, a password reset link will be sent.');
        }
      } else {
        setError(data.error || 'Failed to request reset');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="auth-modal" onClick={onClose}>
      <div className="auth-container" onClick={e => e.stopPropagation()}>
        <div className="auth-left">
          <h2>{activeTab === 'login' ? 'Login' : activeTab === 'signup' ? 'Looks like you\'re new here!' : 'Reset Password'}</h2>
          <p>
            {activeTab === 'login' ? 'Get access to your Orders, Wishlist and Recommendations' : 
             activeTab === 'signup' ? 'Sign up with your email to get started' : 
             'Enter your email to receive a password reset link'}
          </p>
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Login" style={{ marginTop: 'auto', alignSelf: 'center', width: '200px' }} />
        </div>
        
        <div className="auth-right">
          <button className="auth-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
          
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} style={{ paddingTop: '20px' }}>
              <div className="auth-input-group">
                <input type="email" name="email" placeholder="Enter Email Address" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="auth-input-group">
                <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} required />
                <button type="button" onClick={() => setActiveTab('forgot')} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#2874f0', cursor: 'pointer', float: 'right', marginTop: '10px' }}>Forgot?</button>
              </div>
              
              <div style={{ marginTop: '40px', fontSize: '12px', color: '#878787', marginBottom: '20px' }}>
                By continuing, you agree to Urban Vogue's Terms of Use and Privacy Policy.
              </div>
              
              <button type="submit" className="fk-btn-orange">Login</button>
              {error && <p style={{ color: 'red', marginTop: '10px', fontSize: '12px' }}>{error}</p>}
              
              <button type="button" className="fk-btn-white" onClick={() => setActiveTab('signup')}>New to Urban Vogue? Create an account</button>
            </form>
          )}

          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} style={{ paddingTop: '20px' }}>
              <div className="auth-input-group">
                <input type="text" name="name" placeholder="Enter Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="auth-input-group">
                <input type="email" name="email" placeholder="Enter Email Address" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="auth-input-group">
                <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} required />
              </div>
              
              <button type="submit" className="fk-btn-orange" style={{ marginTop: '20px' }}>Continue</button>
              {error && <p style={{ color: 'red', marginTop: '10px', fontSize: '12px' }}>{error}</p>}
              
              <button type="button" className="fk-btn-white" onClick={() => setActiveTab('login')}>Existing User? Log in</button>
            </form>
          )}

          {activeTab === 'forgot' && (
            <form onSubmit={handleForgot} style={{ paddingTop: '20px' }}>
              <div className="auth-input-group">
                <input type="email" name="email" placeholder="Enter Email Address" value={formData.email} onChange={handleChange} required />
              </div>
              
              <button type="submit" className="fk-btn-orange" style={{ marginTop: '20px' }}>Send Reset Link</button>
              {message && <p style={{ color: '#388e3c', marginTop: '10px', fontSize: '12px' }}>{message}</p>}
              {error && <p style={{ color: 'red', marginTop: '10px', fontSize: '12px' }}>{error}</p>}
              
              <button type="button" className="fk-btn-white" onClick={() => setActiveTab('login')}>Back to Login</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
