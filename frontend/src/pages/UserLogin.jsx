import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, register } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const UserLogin = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register({ ...formData, role: 'user' });
        alert('Registration successful! You can now login.');
        setIsRegister(false);
      } else {
        const { data } = await login({ email: formData.email, password: formData.password });
        loginUser(data.token, data.user);
        navigate('/');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <Link to="/" style={styles.backBtn}>← Home</Link>
      <div style={styles.container} className="animate-fade">
        <div style={styles.card} className="white-card">
          <div style={styles.iconCircle}>👤</div>
          <h2 style={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p style={styles.subtitle}>
            {isRegister ? 'Join our community to request resources' : 'Sign in to manage your requests'}
          </p>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            {isRegister && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
            )}
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
            </button>
          </form>
          
          <div style={styles.toggleRow}>
            <span style={styles.toggleText}>
              {isRegister ? 'Already have an account?' : "New here?"}
            </span>
            <button onClick={() => setIsRegister(!isRegister)} style={styles.toggleBtn}>
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '20px', 
    position: 'relative' 
  },
  backBtn: { 
    position: 'absolute', 
    top: '40px', 
    left: '40px', 
    color: '#94a3b8', 
    textDecoration: 'none', 
    fontWeight: '600' 
  },
  container: { width: '100%', maxWidth: '480px' },
  card: { padding: '50px 40px', textAlign: 'center' },
  iconCircle: { 
    width: '60px', 
    height: '60px', 
    background: '#f8fafc', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '2rem', 
    margin: '0 auto 24px' 
  },
  title: { fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px', color: '#0f172a' },
  subtitle: { color: '#64748b', marginBottom: '40px', fontSize: '1rem', fontWeight: '400' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  inputGroup: { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8' },
  submitBtn: { padding: '16px', fontSize: '1.1rem', marginTop: '10px' },
  toggleRow: { 
    marginTop: '30px', 
    paddingTop: '24px', 
    borderTop: '1px solid #f1f5f9', 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '8px' 
  },
  toggleText: { color: '#64748b' },
  toggleBtn: { 
    background: 'none', 
    border: 'none', 
    color: '#dc2626', 
    fontWeight: '700', 
    cursor: 'pointer', 
    fontSize: '1rem',
    textDecoration: 'underline'
  }
};

export default UserLogin;
