import React, { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { login, register } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <Link to="/" style={styles.backBtn}>← Home</Link>
      <div style={styles.container} className="animate-fade">
        <div style={styles.card} className="white-card">
          <div style={styles.iconCircle}>{role === 'admin' ? '🛡️' : '🏥'}</div>
          <h2 style={styles.title}>{isRegister ? 'Staff Registration' : 'Partner Login'}</h2>
          <p style={styles.subtitle}>
            {role === 'admin' ? 'Administrative oversight access' : 'Hospital facility management portal'}
          </p>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            {isRegister && (
               <div style={styles.inputGroup}>
                <label style={styles.label}>Admin/Staff Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
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
                placeholder="staff@hospital.com"
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
            
            {isRegister && role === 'hospital' && (
              <div style={styles.hospitalSection}>
                <div style={styles.sectionHeader}>Facility Details</div>
                <div style={styles.grid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Hospital Name</label>
                    <input
                      type="text"
                      placeholder="City General"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Contact Number</label>
                    <input
                      type="text"
                      placeholder="+91..."
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>City</label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Address</label>
                  <input
                    type="text"
                    placeholder="Street, Landmark, Area"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            )}
            
            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : (isRegister ? 'Apply for Access' : 'Login to Portal')}
            </button>
          </form>
          
          <div style={styles.toggleRow}>
            <span style={styles.toggleText}>
              {isRegister ? 'Already registered?' : 'Need to register facility?'}
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
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', position: 'relative' },
  backBtn: { position: 'absolute', top: '40px', left: '40px', color: '#94a3b8', textDecoration: 'none', fontWeight: '600' },
  container: { width: '100%', maxWidth: '600px' },
  card: { padding: '50px 40px', textAlign: 'center' },
  iconCircle: { width: '60px', height: '60px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 24px' },
  title: { fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px', color: '#0f172a' },
  subtitle: { color: '#64748b', marginBottom: '40px', fontSize: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  inputGroup: { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8' },
  hospitalSection: { marginTop: '10px', paddingTop: '24px', borderTop: '2px solid #f8fafc', display: 'flex', flexDirection: 'column', gap: '20px' },
  sectionHeader: { fontSize: '1.1rem', fontWeight: '800', color: '#dc2626', textAlign: 'left', marginBottom: '5px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  submitBtn: { padding: '16px', fontSize: '1.1rem', marginTop: '10px' },
  toggleRow: { marginTop: '30px', paddingTop: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', gap: '8px' },
  toggleText: { color: '#64748b' },
  toggleBtn: { background: 'none', border: 'none', color: '#dc2626', fontWeight: '700', cursor: 'pointer', fontSize: '1rem', textDecoration: 'underline' }
};

export default Login;
