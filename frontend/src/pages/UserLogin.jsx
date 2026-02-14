import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, register } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const UserLogin = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div style={styles.wrapper}>
      <Link to="/" style={styles.backBtn}>← Back to Home</Link>
      <div style={styles.container}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>{isRegister ? 'Register' : 'Login'}</h2>
          <p style={styles.subtitle}>User Account</p>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={styles.input}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={styles.input}
              required
            />
            
            <button type="submit" style={styles.button}>
              {isRegister ? 'Register' : 'Login'}
            </button>
          </form>
          
          <p style={styles.toggle}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={() => setIsRegister(!isRegister)} style={styles.link}>
              {isRegister ? 'Login here' : 'Register here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative' },
  backBtn: { position: 'absolute', top: '20px', left: '20px', padding: '10px 20px', background: '#fff', borderRadius: '8px', color: '#dc2626', fontWeight: '600' },
  container: { width: '100%', maxWidth: '450px' },
  formCard: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 30px rgba(0,0,0,0.2)', textAlign: 'center' },
  title: { fontSize: '2rem', color: '#dc2626', marginBottom: '10px', fontWeight: '700' },
  subtitle: { color: '#666', marginBottom: '30px', fontSize: '1.1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', fontSize: '16px', border: '2px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' },
  button: { padding: '15px', fontSize: '16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' },
  toggle: { textAlign: 'center', marginTop: '20px', color: '#666' },
  link: { color: '#dc2626', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }
};

export default UserLogin;
