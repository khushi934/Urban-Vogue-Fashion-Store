import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Password reset successful!');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Invalid Link</h2>
        <p>No reset token provided. Please request a new password reset link.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '100px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: 'var(--color-bg-card)', padding: '40px', borderRadius: '12px', border: '1px solid var(--color-border-dark)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">New Password</label>
            <input 
              type="password" 
              className="auth-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Confirm New Password</label>
            <input 
              type="password" 
              className="auth-input" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full auth-submit" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          {message && <p style={{ color: 'var(--color-success)', marginTop: '16px', textAlign: 'center' }}>{message}</p>}
          {error && <p style={{ color: 'var(--color-accent)', marginTop: '16px', textAlign: 'center' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
