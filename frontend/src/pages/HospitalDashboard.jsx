import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateBlood, updateOrgan } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const HospitalDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bloodData, setBloodData] = useState({ bloodGroup: '', unitsAvailable: '' });
  const [organData, setOrganData] = useState({ organType: '', status: '' });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const organs = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Cornea'];

  const handleBloodUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateBlood({ ...bloodData, unitsAvailable: Number(bloodData.unitsAvailable) });
      alert('Blood stock updated successfully');
      setBloodData({ bloodGroup: '', unitsAvailable: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  const handleOrganUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateOrgan(organData);
      alert('Organ availability updated successfully');
      setOrganData({ organType: '', status: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Hospital Dashboard</h1>
            <p style={styles.welcome}>Welcome, <strong>{user?.name}</strong></p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Update Blood Stock</h2>
            </div>
            <form onSubmit={handleBloodUpdate} style={styles.form}>
              <select
                value={bloodData.bloodGroup}
                onChange={(e) => setBloodData({...bloodData, bloodGroup: e.target.value})}
                style={styles.input}
                required
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              <input
                type="number"
                placeholder="Units Available"
                value={bloodData.unitsAvailable}
                onChange={(e) => setBloodData({...bloodData, unitsAvailable: e.target.value})}
                style={styles.input}
                min="0"
                required
              />
              <button type="submit" style={styles.submitBtn}>Update Blood Stock</button>
            </form>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Update Organ Availability</h2>
            </div>
            <form onSubmit={handleOrganUpdate} style={styles.form}>
              <select
                value={organData.organType}
                onChange={(e) => setOrganData({...organData, organType: e.target.value})}
                style={styles.input}
                required
              >
                <option value="">Select Organ</option>
                {organs.map(org => <option key={org} value={org}>{org}</option>)}
              </select>
              <select
                value={organData.status}
                onChange={(e) => setOrganData({...organData, status: e.target.value})}
                style={styles.input}
                required
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
              <button type="submit" style={styles.submitBtn}>Update Organ Status</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', padding: '20px' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px', background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  title: { color: '#dc2626', fontSize: '2rem', margin: 0, fontWeight: '700' },
  welcome: { color: '#666', marginTop: '5px', fontSize: '1.1rem' },
  logoutBtn: { padding: '12px 25px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' },
  card: { padding: '30px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  cardHeader: { marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' },
  cardTitle: { fontSize: '1.4rem', color: '#333', margin: 0, fontWeight: '600' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', fontSize: '16px', border: '2px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' },
  submitBtn: { padding: '15px', fontSize: '16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }
};

export default HospitalDashboard;
