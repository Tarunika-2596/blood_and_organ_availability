import React, { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { login, register } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    hospitalName: '',
    address: '',
    city: '',
    contactNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role
        };
        if (role === 'hospital') {
          payload.hospitalData = {
            name: formData.hospitalName,
            address: formData.address,
            city: formData.city,
            contactNumber: formData.contactNumber
          };
        }
        await register(payload);
        alert('Registration successful! You can now login.');
        setIsRegister(false);
      } else {
        const { data } = await login({ email: formData.email, password: formData.password });
        loginUser(data.token, data.user);
        navigate(role === 'admin' ? '/admin/dashboard' : '/hospital/dashboard');
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
          <p style={styles.subtitle}>{role === 'admin' ? 'Admin Panel' : 'Hospital Portal'}</p>
          
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
            
            {isRegister && role === 'hospital' && (
              <>
                <div style={styles.divider}>Hospital Details</div>
                <input
                  type="text"
                  placeholder="Hospital Name"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                  style={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  style={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  style={styles.input}
                  required
                />
              </>
            )}
            
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
  container: { width: '100%', maxWidth: '500px' },
  formCard: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 30px rgba(0,0,0,0.2)', textAlign: 'center' },
  title: { fontSize: '2rem', color: '#dc2626', marginBottom: '10px', fontWeight: '700' },
  subtitle: { color: '#666', marginBottom: '30px', fontSize: '1.1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', fontSize: '16px', border: '2px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' },
  divider: { padding: '10px', background: '#f0f0f0', borderRadius: '8px', fontWeight: '600', color: '#dc2626', margin: '10px 0' },
  button: { padding: '15px', fontSize: '16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' },
  toggle: { textAlign: 'center', marginTop: '20px', color: '#666' },
  link: { color: '#dc2626', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }
};

export default Login;
